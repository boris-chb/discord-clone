"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Check, Copy, RefreshCw } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";

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
      <DialogContent className="p-1 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Send invite
          </DialogTitle>

          <DialogDescription>
            Invite people to join your server.
          </DialogDescription>
          <Label className="uppercase text-xs font-bold">Invite link</Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button
              disabled={isLoading}
              className="ml-2 w-5 h-5"
              onClick={onCopy}
              size="icon"
            >
              {copied ? (
                <Check className="text-emerald-700 focus-visible:ring-0 focus-visible:ring-offset-0" />
              ) : (
                <Copy />
              )}
            </Button>
          </div>
          <Button
            onClick={generateNewLink}
            disabled={isLoading}
            variant={"link"}
            size={"sm"}
            className="text-xs mt-4 mx-auto w-1/2"
          >
            Generate new invite
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
