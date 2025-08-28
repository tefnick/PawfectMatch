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
}

const useMessageStore = create<MessageState>()(devtools((set) => ({
  // initial state below
  messages: [],
  unreadCount: 0,
  add: (message) => set(state => ({messages: [message, ...state.messages]})),
  remove: (id) => set(state => ({messages: state.messages.filter(message => message.id !== id)})),
  set: (messages) => set({messages}),
  updateUnreadCount: (amount: number) => set(state => ({ unreadCount: state.unreadCount + amount }))
}), {name: "messageStoreDemo"}));

export default useMessageStore;