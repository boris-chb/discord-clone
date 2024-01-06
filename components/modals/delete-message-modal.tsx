"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useChat } from "@livekit/components-react";
import { useModal } from "@/hooks/use-modal-store";
import { useChatStore } from "@/state/store";
import axios from "axios";

import { useParams, useRouter } from "next/navigation";
import { NextResponse } from "next/server";
import queryString from "query-string";
import { useState } from "react";

export default function DeleteMessageModal() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { serverId, channelId } = useParams();
  const { messages, setMessages } = useChatStore();

  const {
    isOpen,
    onClose,
    type,
    data: { messageId },
  } = useModal();

  const isModalOpen = isOpen && type === "deleteMessage";

  const onDeleteMessage = async () => {
    try {
      setIsLoading(true);

      const url = queryString.stringifyUrl({
        url: `/api/messages/`,
        query: { messageId, serverId },
      });

      console.log(url);

      const res = await axios.delete(url);
      console.log(res.data);
      setMessages(messages.filter(msg => msg.id !== res.data.foundMsg.id));

      onClose();
    } catch (error) {
      console.log(error);
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
            You cannot recover the message after deleting it.
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
              onClick={onDeleteMessage}
            >
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
