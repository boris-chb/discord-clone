"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteServerModal() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    isOpen,
    onClose,
    type,
    data: { server },
  } = useModal();

  const isModalOpen = isOpen && type === "deleteServer";

  const onLeaveServer = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/servers/${server?.id}/`);

      onClose();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.log("could not delete server", server?.id, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-1 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Are you sure?
          </DialogTitle>

          <DialogDescription className="text-center">
            You&apos;re about to delete server «
            <span className="text-indigo-500">{server?.name}</span>». This
            action cannot be undone!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isLoading}
              variant={"ghost"}
              onClick={() => onClose()}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant={"destructive"}
              onClick={onLeaveServer}
            >
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
