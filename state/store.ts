import { create } from "zustand";

type ChatStore = {
  messages: Message[];
  dms: DirectMessage[];
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  addDm: (dm: DirectMessage) => void;
  setDms: (dms: DirectMessage[]) => void;
};

export const useChatStore = create<ChatStore>(set => ({
  dms: [],
  addDm: dm => set(state => ({ dms: [...state.dms, dm] })),
  setDms: dms => set({ dms }),
  messages: [],
  addMessage: message =>
    set(state => ({ messages: [...state.messages, message] })),
  setMessages: messages => set({ messages }),
}));
