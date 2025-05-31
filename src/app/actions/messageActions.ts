"use server";

import { messageSchema, MessageSchema } from "@/lib/schemas/messageSchema";
import { ActionResult, MessageWithSenderRecipient } from "@/types";
import { Message } from "@prisma/client";
import { getAuthUserId } from "./authActions";
import { prisma } from "@/lib/prisma";
import { mapMessageToMessageDTO } from "@/lib/mappings";

export async function createMessage(recipientUserId: string, data: MessageSchema): Promise<ActionResult<Message>> {
  try {
    const userId = await getAuthUserId();

    const validated = messageSchema.safeParse(data);

    if (!validated.success) return { status: "error", error: validated.error.errors }

    const { text } = validated.data;

    const message = await prisma.message.create({
      data: {
        text: text,
        senderId: userId,
        recipientId: recipientUserId,
      }
    })

    return { status: "success", data: message };
  } catch (error) {
    console.log(error)
    return { status: "error", error: "Failed to create message" }
  }
}

export async function getMessageThread(recipientId: string) {
  try {
    const userId = await getAuthUserId();

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
      select: {
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
    })

    if (messages.length > 0) {
      await prisma.message.updateMany({
        where: {
          senderId: recipientId,
          recipientId: userId,
          dateRead: null
        },
        data: {
          dateRead: new Date()
        }
      })
    }

    return messages.map(message => mapMessageToMessageDTO(message))
  } catch (error) {
    console.log(error)
    throw new Error("Failed to get message thread");
  }
}

export async function getMessagesByContainer(container: string) {
  try {
    const userId = await getAuthUserId();
        
    const conditions = {
      [container === "outbox" ? "senderId" : "recipientId"] : userId,
      ...(container === "outbox" ? {senderDeleted: false} : {recipientDeleted: false})
    }

    const messages = await prisma.message.findMany({
      where: conditions,
      orderBy: {
        created: "desc"
      },
      select: {
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
        },
      }
    });

    return messages.map(message => mapMessageToMessageDTO(message));
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to get messages for ${container}`);
  }
}

export async function deleteMessage(messageId: string, isOutBox: boolean) {
  const selector= isOutBox ? 'senderDeleted' : 'recipientDeleted';
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
          OR: messagesToDelete.map(m => ({id: m.id}))
        }
      })
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete message");
  }
}