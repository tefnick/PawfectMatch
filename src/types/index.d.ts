import { ZodIssue } from "zod";

// DTO used to represent response from the server actions
type ActionResult<T> = 
  { status: "success", data: T } | { status: "error", error: string | ZodIssue[] }

type MessageWithSenderRecipient = Prisma.MessageGetPayload<{
  select: { 
    id: true,
    text: true,
    created: true,
    dateRead: true,
    sender: {
      select: { userId, name, image }
    },
    recipient: {
      select: { userId, name, image }
    }
  }
}>

type MessageDTO = {
  id: string,
  text: string,
  created: string,
  dateRead: string | null,
  senderId?: string,
  senderName?: string,
  senderImage?: string | null,
  recipientId?: string,
  recipientName?: string,
  recipientImage?: string | null
}