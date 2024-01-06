"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ScrollArea } from "@/components/ui/scroll-area";
import UserAvatar from "@/components/user-avatar";

import {
  Check,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  UserX,
} from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import { MemberRole } from "@prisma/client";
import { useEffect, useState } from "react";
import qs from "query-string";
import axios from "axios";

const roleIconMap = {
  Guest: null,
  Moderator: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-400" />,
  Admin: <ShieldAlert className="h-4 w-4 ml-2 text-rose-400" />,
};

export default function ManageMembersModal() {
  const router = useRouter();
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const [loadingId, setLoadingId] = useState("");

  const { server } = data as { server: ServerWithMembersWithProfiles };

  const isModalOpen = isOpen && type === "manageMembers";

  const onChangeRole = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server.id,
        },
      });

      const res = await axios.patch(url, { role });
      router.refresh();
      onOpen("manageMembers", { server: res.data });
    } catch (error) {
    } finally {
      setLoadingId("");
    }
  };

  const onKickMember = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server.id,
        },
      });

      const res = await axios.delete(url);
      onOpen("manageMembers", { server: res.data });
    } catch (error) {
      console.log(`Could not kick member with id ${memberId}\n`, error);
    } finally {
      setLoadingId("");
    }
  };

  if (!server) return <></>;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage members
          </DialogTitle>
          <DialogDescription className="text-center">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server.members &&
            server.members.length > 0 &&
            server.members.map(member => (
              <div key={member.id} className="flex items-center gap-x-2 mb-6">
                <UserAvatar src={member.profile.imageUrl} />
                <div className="flex flex-col gap-1">
                  <div className="text-xs font-semibold flex gap-1 items-center">
                    {member.profile.name} {roleIconMap[member.role]}
                  </div>
                  <p className="text-xs ">{member.profile.email}</p>
                </div>
                {server.profileId !== member.profileId &&
                  loadingId !== member.id && (
                    <div className="ml-auto">
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger>
                          <MoreVertical className="h-4 w-4 " />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="bottom">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center">
                              <ShieldQuestion className="h-4 w-4 mr-2" />
                              <span>Role</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    onChangeRole(member.id, "Guest")
                                  }
                                >
                                  <Shield className="h-4 w-4 mr-2" /> Guest{" "}
                                  {member.role === "Guest" && (
                                    <Check className="h-4 w-4 ml-auto" />
                                  )}
                                </DropdownMenuItem>{" "}
                                <DropdownMenuItem
                                  onClick={() =>
                                    onChangeRole(member.id, "Moderator")
                                  }
                                >
                                  <Shield className="h-4 w-4 mr-2" /> Moderator{" "}
                                  {member.role === "Moderator" && (
                                    <Check className="h-4 w-4 ml-auto" />
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onKickMember(member.id)}
                          >
                            <UserX className="h-4 w-4 mr-2" /> Kick
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                {loadingId === member.id && (
                  <Loader2 className="animate-spin  ml-auto w-4 h-4" />
                )}
              </div>
            ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
