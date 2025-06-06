import CardInnerWrapper from '@/components/CardInnerWrapper'
import { CardBody, CardHeader } from '@nextui-org/react'
import React from 'react'
import ChatForm from './ChatForm'
import { getMessageThread } from '@/app/actions/messageActions'
import MessageBox from './MessageBox'
import { getAuthUserId } from '@/app/actions/authActions'

export default async function ChatPage({params}: {params: {userId: string}}) {
  const currentUserId = await getAuthUserId() as string;
  const messages = await getMessageThread(params.userId)

  const body = (
    <div>
      {messages.length === 0 ? 'No messages to display' : (
        <div>
          {messages.map((message) => (
            <MessageBox 
              key={message.id} 
              message={message} 
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <>
      <CardInnerWrapper 
        header='Chat'
        body={
          <div>
            {body}
          </div>
        }
        footer={
          <ChatForm />
        }
      />
    </>
  )
}
