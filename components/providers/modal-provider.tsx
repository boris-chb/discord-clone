"use client";

import ServerModal from "@/components/modals/create-server-modal";
import { useEffect, useState } from "react";

interface ModalProviderProps {}

const ModalProvider: React.FC<ModalProviderProps> = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return (
    <>
      <ServerModal />
    </>
  );
};

export default ModalProvider;
