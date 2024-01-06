"use client";
import { useEffect, useState } from "react";

import CreateChannelModal from "@/components/modals/create-channel-modal";
import ManageMembersModal from "@/components/modals/manage-members-modal";
import DeleteChannelModal from "@/components/modals/delete-channel-modal";
import DeleteMessageModal from "@/components/modals/delete-message-modal";
import CreateServerModal from "@/components/modals/create-server-modal";
import DeleteServerModal from "@/components/modals/delete-server-modal";
import LeaveServerModal from "@/components/modals/leave-server-modal";
import EditChannelModal from "@/components/modals/edit-channel-modal";
import EditServerModal from "@/components/modals/edit-server-modal";
import InviteModal from "@/components/modals/invite-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <EditChannelModal />
      <ManageMembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <DeleteMessageModal />
    </>
  );
};

export default ModalProvider;
