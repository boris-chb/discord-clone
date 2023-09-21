"use client";

import ActionTooltip from "@/components/navigation/sidebar-tooltip";
import { ModalType, useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface ChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const channelTypeIconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

export default function Channel({ channel, role, server }: ChannelProps) {
  const params = useParams();
  const router = useRouter();
  const { onOpen } = useModal();

  const Icon = channelTypeIconMap[channel.type];

  const handleClick = () => {
    router.push(`/${server.id}/${channel.id}/`);
  };

  const handleAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { channel, server });
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group p-2 rounded-md flex items-center gap-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <Icon className="flex-shrink-0 w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="flex ml-auto items-center gap-2">
          <ActionTooltip label="Edit">
            <Edit
              onClick={e => handleAction(e, "editChannel")}
              className="hidden group-hover:block w-3 h-3 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={e => handleAction(e, "deleteChannel")}
              className="hidden group-hover:block w-3 h-3 text-zinc-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <Lock className="ml-auto w-3 h-3 text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  );
}
