import { MessageDTO } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { Key } from "readline";
import { deleteMessage } from "../actions/messageActions";
import useMessageStore from "./useMessageStore";
import { useShallow } from "zustand/shallow";

export const useMessages = (initialMessages: MessageDTO[]) => {
  const { set, remove, messages, updateUnreadCount } = useMessageStore(
    useShallow(
      state => ({
        set: state.set,
        remove: state.remove,
        messages: state.messages,
        updateUnreadCount: state.updateUnreadCount
      })
    )
  );
  const searchParams = useSearchParams()
  const router = useRouter()
  const isOutbox = searchParams.get('container') === "outbox";
  const [isDeleting, setIsDeleting] = useState({id: '', loading: false});

  useEffect(() => {
    set(initialMessages);

    return () => {
      set([])
    }
  },[initialMessages, set])

  const columns = [
    { key: isOutbox ? 'recipientName' : 'senderName', label: isOutbox ? 'Recipient' : 'Sender' },
    { key: 'text', label: 'Message' },
    { key: 'created', label: isOutbox ? 'Date sent' : 'Date received' },
    { key: 'actions', label: 'actions' },
  ]

  const handleRowSelect = (key: Key) => {
    const message = initialMessages.find(m => m.id === key);
    const url = isOutbox ? `/dogs/${message?.recipientId}` : `/dogs/${message?.senderId}`;
    router.push(url + '/chat');
  }

  const handleDeleteMessage = useCallback(async (message: MessageDTO) => {
    setIsDeleting({id: message.id, loading: true})
    await deleteMessage(message.id, isOutbox);
    remove(message.id)
    if (!message.dateRead && !isOutbox) updateUnreadCount(-1);
    setIsDeleting({id: '', loading: false})
  }, [isOutbox, remove, updateUnreadCount]);

  return {
    isOutbox,
    columns,
    deleteMessage: handleDeleteMessage,
    selectRow: handleRowSelect,
    isDeleting,
    messages
  }
}