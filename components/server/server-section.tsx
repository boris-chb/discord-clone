"use client";

import SidebarTooltip from "@/components/navigation/sidebar-tooltip";
import { useModal } from "@/hooks/use-modal-store";
import { ChannelType, MemberRole } from "@prisma/client";
import { Plus, Settings } from "lucide-react";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

const ServerSection: React.FC<ServerSectionProps> = ({
  role,
  sectionType,
  label,
  channelType,
  server,
}) => {
  const { onOpen } = useModal();
  return (
    <div className="flex items-center justify-between py-2">
      <p className="uppercase text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>

      {/* CREATE CHANNEL BUTTON */}
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <SidebarTooltip label="Create Channel" side="top">
          <button
            onClick={() => onOpen("createChannel", { channelType })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <Plus className="h-4 w-4" />
          </button>
        </SidebarTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <SidebarTooltip label="Manage Members" side="top">
          <button
            onClick={() => onOpen("manageMembers", { server })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <Settings className="h-4 w-4" />
          </button>
        </SidebarTooltip>
      )}
    </div>
  );
};

export default ServerSection;
