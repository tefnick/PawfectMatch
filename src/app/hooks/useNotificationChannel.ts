import { pusherClient } from "@/lib/pusher";
import { Channel } from "pusher-js";
import { useCallback, useEffect, useRef } from "react";
import { MessageDTO } from "@/types";
import { usePathname, useSearchParams } from "next/navigation";
import useMessageStore from "./useMessageStore";
import { toast } from "react-toastify";
import { newMessageToast } from "@/components/NewMessageToast";
import { newLikeToast } from "@/components/NotificationToast";

export const useNotificationChannel = (userId: string | null) => {
  const channelRef = useRef<Channel | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const add = useMessageStore(state => state.add);
  const updateUnreadCount = useMessageStore(state => state.updateUnreadCount);

  const handleNewMessage = useCallback((message: MessageDTO) => {
    // if user is in messages chat or in outbox, don't notify, just add msg to store
    if (pathname === "/messages" && searchParams.get("container") !== "outbox") {
      add(message)
      updateUnreadCount(1)
    } else if (pathname !== `/dogs/${message.senderId}/chat`) { // user is not in a chat, send noti
      newMessageToast(message);
      updateUnreadCount(1)
    }
  }, [add, pathname, searchParams, updateUnreadCount])

  const handleNewLike = useCallback((data: {name: string, image: string | null, userId: string}) => {
    newLikeToast(data.name, data.image, data.userId);
  }, [])

  useEffect(() => {
    if (!userId) return;
    if (!channelRef.current) {
      channelRef.current = pusherClient.subscribe(`private-${userId}`);

      channelRef.current.bind("message:new", handleNewMessage)
      channelRef.current.bind("like:new", handleNewLike)
    }

    return () => {
      if (channelRef.current && channelRef.current.subscribed) {
        channelRef.current.unsubscribe();
        channelRef.current.unbind_all()
        channelRef.current = null;
      }
    }
  }, [userId, handleNewMessage])
}