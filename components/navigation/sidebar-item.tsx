"use client";

import ActionTooltip from "@/components/navigation/sidebar-tooltip";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SidebarItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ id, imageUrl, name }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button className="group relative flex items-center">
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-2xl transition-all duration-300 w-[4px]",
            params?.serverId !== id && "group-hover:h-5",
            params?.serverId === id ? "h-10" : "h-2",
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-12 w-12 rounded-lg group-hover:rounded-3xl transition-all overflow-hidden",
            params?.serverId === id && "bg-primary/10 text-primary rounded-lg",
          )}
        >
          <Image
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fill
            src={imageUrl}
            alt="server"
            className="dark:bg-zinc-800"
          />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default SidebarItem;
