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
import queryString from "query-string";
import { useState } from "react";

export default function DeleteChannelModal() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    isOpen,
    onClose,
    type,
    data: { server, channel },
  } = useModal();

  const isModalOpen = isOpen && type === "deleteChannel";

  const onDeleteChannel = async () => {
    try {
      setIsLoading(true);

      const url = queryString.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: { serverId: server?.id },
      });

      await axios.delete(url);

      onClose();
      router.refresh();
      router.push(`/${server?.id}`);
    } catch (error) {
      console.log(`could not delete channel ${channel?.name}`, error);
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
            You&apos;re about to delete
            <span className="text-indigo-500">#{channel?.name}</span> channel.
            This action cannot be undone!
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
              onClick={onDeleteChannel}
            >
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
