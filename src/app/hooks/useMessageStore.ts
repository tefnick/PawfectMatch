import { MessageDTO } from "@/types"
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type MessageState = {
  messages: MessageDTO[];
  unreadCount: number;
  add: (message: MessageDTO) => void;
  remove: (id: string) => void;
  set: (message: MessageDTO[]) => void;
  updateUnreadCount: (amount: number) => void;
  resetMessages: () => void;
}

const useMessageStore = create<MessageState>()(devtools((set) => ({
  // initial state below
  messages: [],
  unreadCount: 0,
  add: (message) => set(state => ({messages: [message, ...state.messages]})),
  remove: (id) => set(state => ({messages: state.messages.filter(message => message.id !== id)})),
  set: (messages) => set(state => {
    // some defensive coding to prevent duplicates during hot module reloading during local dev
    const map = new Map([...state.messages, ...messages].map(m => [m.id, m]));
    const uniqueMessages = Array.from(map.values());
    return { messages: uniqueMessages }
  }),
  updateUnreadCount: (amount: number) => set(state => ({ unreadCount: state.unreadCount + amount })),
  resetMessages: () => set({messages: []})
}), {name: "messageStoreDemo"}));

export default useMessageStore;