"use client";

import ServerModal from "@/components/modals/create-server-modal";
import InviteModal from "@/components/modals/invite-modal";
import { useEffect, useState } from "react";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return (
    <>
      <ServerModal />
      <InviteModal />
    </>
  );
};

export default ModalProvider;
