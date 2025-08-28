"use server";

import { messageSchema, MessageSchema } from "@/lib/schemas/messageSchema";
import { ActionResult, MessageDTO, MessageWithSenderRecipient } from "@/types";
import { Message } from "@prisma/client";
import { getAuthUserId } from "./authActions";
import { prisma } from "@/lib/prisma";
import { mapMessageToMessageDTO } from "@/lib/mappings";
import { pusherServer } from "@/lib/pusher";
import { createChatId } from "@/lib/util";
import { m } from "framer-motion";
import { read } from "fs";

export async function createMessage(recipientUserId: string, data: MessageSchema): Promise<ActionResult<MessageDTO>> {
  try {
    const userId = await getAuthUserId() as string;

    const validated = messageSchema.safeParse(data);

    if (!validated.success) return { status: "error", error: validated.error.errors }

    const { text } = validated.data;

    const message = await prisma.message.create({
      data: {
        text: text,
        senderId: userId,
        recipientId: recipientUserId,
      },
      select: messageSelect
    })

    const messageDTO = mapMessageToMessageDTO(message);

    // push message to pusher
    await pusherServer.trigger(createChatId(userId, recipientUserId), 'message:new', messageDTO);
    await pusherServer.trigger(`private-${recipientUserId}`, "message:new", messageDTO);


    return { status: "success", data: messageDTO };
  } catch (error) {
    console.log(error)
    return { status: "error", error: "Failed to create message" }
  }
}

export async function getMessageThread(recipientId: string) {
  try {
    const userId = await getAuthUserId() as string;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            recipientId: recipientId,
            senderDeleted: false,
          },
          { // get both sides of conversation
            senderId: recipientId,
            recipientId: userId,
            recipientDeleted: false,
          }
        ]
      },
      orderBy: {
        created: "asc"
      },
      select: messageSelect
    })

    let readCount = 0;

    if (messages.length > 0) {
      const readMessageIds = messages
        .filter(m => m.dateRead === null 
          && m.recipient?.userId === userId
          && m.sender?.userId === recipientId)
        .map(m => m.id);

      await prisma.message.updateMany({
        where: {
          id: {
            in: readMessageIds
          }
        },
        data: {
          dateRead: new Date()
        }
      })

      readCount = readMessageIds.length;

      await pusherServer.trigger(createChatId(recipientId, userId), 'messages:read', readMessageIds);
    }

    const messagesToReturn = messages.map(message => mapMessageToMessageDTO(message));

    return {messages: messagesToReturn, readCount}
  } catch (error) {
    console.log(error)
    throw new Error("Failed to get message thread");
  }
}

export async function getMessagesByContainer(container: string) {
  try {
    const userId = await getAuthUserId();

    const conditions = {
      [container === "outbox" ? "senderId" : "recipientId"]: userId,
      ...(container === "outbox" ? { senderDeleted: false } : { recipientDeleted: false })
    }

    const messages = await prisma.message.findMany({
      where: conditions,
      orderBy: {
        created: "desc"
      },
      select: messageSelect
    });

    return messages.map(message => mapMessageToMessageDTO(message));
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to get messages for ${container}`);
  }
}

export async function deleteMessage(messageId: string, isOutBox: boolean) {
  const selector = isOutBox ? 'senderDeleted' : 'recipientDeleted';
  try {
    const userId = await getAuthUserId();

    await prisma.message.update({
      where: {
        id: messageId
      },
      data: {
        [selector]: true
      }
    })

    const messagesToDelete = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            senderDeleted: true,
            recipientDeleted: true,
          },
          {
            recipientId: userId,
            senderDeleted: true,
            recipientDeleted: true,
          }
        ]
      }
    })

    if (messagesToDelete.length > 0) {
      await prisma.message.deleteMany({
        where: {
          OR: messagesToDelete.map(m => ({ id: m.id }))
        }
      })
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete message");
  }
}

export async function getUnreadMessageCount() {
  try {
    const userId = await getAuthUserId();

    return prisma.message.count({
      where: {
        recipientId: userId,
        dateRead: null,
        recipientDeleted: false
      }
    })
  } catch (error) {
    console.error(error)
    throw error;
  }
}

const messageSelect = {
  id: true,
  text: true,
  created: true,
  dateRead: true,
  sender: {
    select: {
      userId: true,
      name: true,
      image: true
    }
  },
  recipient: {
    select: {
      userId: true,
      name: true,
      image: true
    }
  }
}

