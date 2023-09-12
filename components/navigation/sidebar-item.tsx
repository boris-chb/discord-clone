"use client";

import SidebarTooltip from "@/components/navigation/sidebar-tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

interface SidebarItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ id, imageUrl, name }) => {
  const params = useParams();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/${id}`);
  };

  return (
    <SidebarTooltip side="right" align="center" label={name}>
      <button
        onClick={handleClick}
        className="group relative flex items-center"
      >
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-2xl transition-all duration-300 w-[4px]",
            params?.serverId !== id && "group-hover:h-5",
            params?.serverId === id ? "h-10" : "h-2"
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-12 w-12 rounded-lg group-hover:rounded-3xl transition-all overflow-hidden",
            params?.serverId === id && "bg-primary/10 text-primary rounded-lg"
          )}
        >
          <Image fill src={imageUrl} alt="server" />
        </div>
      </button>
    </SidebarTooltip>
  );
};

export default SidebarItem;
