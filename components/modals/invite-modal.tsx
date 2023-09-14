"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useModal } from "@/hooks/use-modal-store";
import { useOrigin } from "@/hooks/use-origin";
import axios from "axios";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";

export default function InviteModal() {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    isOpen,
    onOpen,
    onClose,
    type,
    data: { server },
  } = useModal();

  const origin = useOrigin();

  const inviteUrl = `${origin}/join/${server?.inviteCode}`;

  const isModalOpen = isOpen && type === "inviteMember";

  function onCopy() {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
  }

  async function generateNewLink() {
    try {
      setIsLoading(true);
      const res = await axios.patch(`/api/servers/${server?.id}/invite-code`);
      onOpen("inviteMember", { server: res.data });
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-1 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Send invite
          </DialogTitle>

          <DialogDescription>
            Invite people to join your server.
          </DialogDescription>
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button
              disabled={isLoading}
              className="ml-2 w-5 h-5"
              onClick={onCopy}
              size="icon"
            >
              {copied ? <Check className="text-emerald-700" /> : <Copy />}
            </Button>
          </div>
          <Button
            onClick={generateNewLink}
            disabled={isLoading}
            variant={"link"}
            size={"sm"}
            className="text-xs text-zinc-500 mt-4 mx-auto w-1/2"
          >
            Generate new invite
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
