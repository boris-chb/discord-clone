import { Channel, ChannelType } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "editServer"
  | "leaveServer"
  | "inviteMember"
  | "manageMembers"
  | "deleteServer"
  | "createChannel"
  | "editChannel"
  | "deleteChannel"
  | "deleteMessage";

interface ModalData {
  server?: Server;
  channelType?: ChannelType;
  channel?: Channel;
  messageId?: string;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>(set => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false, data: {} }),
}));
