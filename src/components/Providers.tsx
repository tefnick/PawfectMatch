"use client";

import { getUnreadMessageCount } from '@/app/actions/messageActions';
import useMessageStore from '@/app/hooks/useMessageStore';
import { useNotificationChannel } from '@/app/hooks/useNotificationChannel';
import { usePresenceChannel } from '@/app/hooks/usePresenceChannel';
import { NextUIProvider } from '@nextui-org/react'
import React, { useCallback, useEffect } from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Providers({ children, userId }: {children: React.ReactNode, userId: string | null}) {
  const updateUnreadCount = useMessageStore(state => state.updateUnreadCount)

  const setUnreadCount = useCallback((amount: number) => {
    updateUnreadCount(amount)
  }, [updateUnreadCount]);

  useEffect(() => {
    if (userId) {
      getUnreadMessageCount().then((count) => {
        setUnreadCount(count);
      });
    }
    
  },[setUnreadCount, userId])

  usePresenceChannel();
  useNotificationChannel(userId);
  return (
    <NextUIProvider>
      <ToastContainer position='top-right' hideProgressBar className='z-50'/>
        {children}
    </NextUIProvider>
  )
}
