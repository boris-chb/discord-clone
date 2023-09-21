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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ChatItemProps {
  id: string;
  body: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-400" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-400" />,
};

export default function ChatItem({
  body,
  currentMember,
  deleted,
  fileUrl,
  id,
  isUpdated,
  member,
  socketQuery,
  socketUrl,
  timestamp,
}: ChatItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsEditing(false);
      // if (e.ctrlKey && e.key.toLowerCase() === "e") setIsEditing(true);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fileType = fileUrl?.split(".").pop();
  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && isOwner && !fileUrl;
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;
  const avatar = isOwner ? (
    <UserAvatar src={member.profile.imageUrl} />
  ) : (
    <Link
      className="hover:drop-shadow-md transition"
      href={`/${params?.serverId}/${member.id}`}
    >
      <UserAvatar src={member.profile.imageUrl} />
    </Link>
  );

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        {avatar}
        <div className="flex flex-col w-full">
          {/* SENDER & TIMESTAMP */}
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <Link
                className="text-sm font-semibold hover:underline"
                href={`/${params?.serverId}/${member.id}`}
              >
                {member.profile.name}
              </Link>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs">{timestamp}</span>
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
              {isUpdated && !deleted && (
                <span className="text-xs mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <MessageEditForm
              id={id}
              body={body}
              toggleEdit={setIsEditing}
              socketQuery={socketQuery}
              socketUrl={socketUrl}
            />
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
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
              onClick={() => onOpen("deleteChannel", {})}
              className="cursor-pointer ml-auto h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
}
