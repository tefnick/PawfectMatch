import { MessageDTO } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useCallback, useEffect, useRef } from "react";
import { Key } from "readline";
import { deleteMessage, getMessagesByContainer } from "../actions/messageActions";
import useMessageStore from "./useMessageStore";
import { useShallow } from "zustand/shallow";

export const useMessages = (initialMessages: MessageDTO[], nextCursor?: string) => {
  const cursorRef = useRef(nextCursor);
  const { set, remove, messages, updateUnreadCount, resetMessages } = useMessageStore(
    useShallow(
      state => ({
        set: state.set,
        remove: state.remove,
        messages: state.messages,
        updateUnreadCount: state.updateUnreadCount,
        resetMessages: state.resetMessages
      })
    )
  );
  const searchParams = useSearchParams()
  const router = useRouter()
  const isOutbox = searchParams.get('container') === "outbox";
  const container = searchParams.get("container");
  const [isDeleting, setIsDeleting] = useState({id: '', loading: false});
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    set(initialMessages);
    cursorRef.current = nextCursor

    return () => {
      resetMessages();
    }
  },[initialMessages, resetMessages, set, nextCursor])

  const loadMore = useCallback(async () => {
    if (cursorRef.current) {
      setLoadingMore(true);
      const { messages, nextCursor } = await getMessagesByContainer(container, cursorRef.current)
      set(messages);
      cursorRef.current = nextCursor;
      setLoadingMore(false);
    }
  }, [container, set])

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
    messages,
    loadMore,
    loadingMore,
    hasMore: !!cursorRef.current
  }
}