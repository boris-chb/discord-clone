"use client";

import { Plus } from "lucide-react";
import SidebarTooltip from "./sidebar-tooltip";
import { useModal } from "@/hooks/use-modal-store";

interface SidebarItemProps {}

const SidebarAction: React.FC<SidebarItemProps> = () => {
  const { onOpen } = useModal();
  return (
    <>
      <SidebarTooltip label="Create a server" side="right" align="center">
        <button
          onClick={() => onOpen("createServer")}
          className="group flex items-center"
        >
          <div className="flex mx-3 h-12 w-12 rounded-3xl group-hover:rounded-lg transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
            <Plus
              className="group-hover:text-white transition text-emerald-500"
              size={25}
            />
          </div>
        </button>
      </SidebarTooltip>
    </>
  );
};

export default SidebarAction;