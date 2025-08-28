import CardInnerWrapper from '@/components/CardInnerWrapper'
import React from 'react'
import ChatForm from './ChatForm'
import { getMessageThread } from '@/app/actions/messageActions'
import { getAuthUserId } from '@/app/actions/authActions'
import MessageList from './MessageList'
import { createChatId } from '@/lib/util'

export default async function ChatPage({ params }: { params: { userId: string } }) {
  const currentUserId = await getAuthUserId() as string;
  const messages = await getMessageThread(params.userId)
  const chatId = createChatId(currentUserId, params.userId);


  return (
    <>
      <CardInnerWrapper
        header='Chat'
        body={
          <div>
            <MessageList 
              initialMessages={messages} 
              currentUserId={currentUserId} 
              chatId={chatId}
            />
          </div>
        }
        footer={
          <ChatForm />
        }
      />
    </>
  )
}
