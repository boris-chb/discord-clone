import MessageEditForm from "@/components/chat/message-edit-form";
import ActionTooltip from "@/components/navigation/sidebar-tooltip";
import UserAvatar from "@/components/user-avatar";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member, MemberRole, Profile } from "@prisma/client";
import axios from "axios";
import { Edit, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";

interface MessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    React.RefAttributes<HTMLDivElement> {
  message: Message;
  currentMember: Member;
}

const roleIconMap = {
  Guest: null,
  Moderator: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-400" />,
  Admin: <ShieldAlert className="h-4 w-4 ml-2 text-rose-400" />,
};

const FIRST_USER_MESSAGE_DATE_FORMAT = "dd/MM/yyyy HH:mm";

export default function Message({
  currentMember,
  message: {
    body,
    channelId,
    createdAt,
    deleted,
    fileUrl,
    id,
    member,
    memberId,
    updatedAt,
  },
  ...rest
}: MessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModal();
  const params = useParams();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsEditing(false);
      // if (e.ctrlKey && e.key.toLowerCase() === "e") setIsEditing(true);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fileType = fileUrl?.split(".").pop();
  const isAdmin = currentMember.role === MemberRole.Admin;
  const isModerator = currentMember.role === MemberRole.Moderator;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && isOwner && !fileUrl;
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;
  const avatar = isOwner ? (
    <UserAvatar className="w-10 h-10" src={member.profile.imageUrl} />
  ) : (
    <Link
      className="hover:drop-shadow-md transition"
      href={`/${params?.serverId}/chat/${member.id}`}
    >
      <UserAvatar className="w-10 h-10" src={member.profile.imageUrl} />
    </Link>
  );

  return (
    <div
      className="relative group flex items-center hover:bg-black/5 px-4 py-2 transition w-full"
      {...rest}
    >
      <div className="group flex gap-x-3 items-center justify-start w-full">
        {avatar}
        <div className="flex flex-col w-full">
          {/* SENDER & TIMESTAMP */}
          <div className="flex items-center gap-x-2 h-8">
            <div className="flex items-center">
              <Link
                className="text-sm font-semibold hover:underline"
                href={`/${params?.serverId}/chat/${member.id}`}
              >
                <span className="">{member.profile.name}</span>
              </Link>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <time className="text-xs text-muted-foreground">
              {format(new Date(createdAt), FIRST_USER_MESSAGE_DATE_FORMAT)}
            </time>
            {canDeleteMessage && (
              <div className="hidden group-hover:flex items-center ml-4 gap-x-2 p-1 bg-white dark:bg-zinc-800 border rounded-sm">
                {canEditMessage && (
                  <ActionTooltip label="Edit">
                    <Edit
                      onClick={() => setIsEditing(!isEditing)}
                      className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                    />
                  </ActionTooltip>
                )}
                <ActionTooltip label="Delete">
                  <Trash
                    onClick={() => onOpen("deleteMessage", {})}
                    className="cursor-pointer ml-auto h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                  />
                </ActionTooltip>
              </div>
            )}
          </div>
          {isImage && <>img msg</>}
          {isPDF && <>pdf msg</>}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}
            >
              {body}
              {updatedAt && !deleted && (
                <span className="text-xs mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <MessageEditForm id={id} body={body} toggleEdit={setIsEditing} />
          )}
        </div>
      </div>
    </div>
  );
}

export function MessageFollowUp({
  currentMember,
  message: {
    body,
    channelId,
    createdAt,
    deleted,
    fileUrl,
    id,
    member,
    memberId,
    updatedAt,
  },
  ...rest
}: MessageProps) {
  return (
    <div className="group py-1 px-4 pr-16 leading-[22px] hover:bg-gray-950/[.07]">
      <div className="flex gap-x-3 items-baseline">
        <p className="pl-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100">
          {format(new Date(createdAt), "HH:mm")}
        </p>
        <p
          className={cn(
            "text-sm text-zinc-600 dark:text-zinc-300",
            deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs"
          )}
        >
          {body}
          {updatedAt && !deleted && (
            <span className="text-xs mx-2 text-zinc-500 dark:text-zinc-400">
              (edited)
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
