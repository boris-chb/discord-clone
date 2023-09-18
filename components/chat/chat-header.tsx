import MobileToggle from "@/components/mobile-toggle";
import { Hash, Menu } from "lucide-react";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "chat";
  imageUrl?: string;
}

export default function ChatHeader({
  imageUrl,
  name,
  serverId,
  type,
}: ChatHeaderProps) {
  return (
    <div className="text-md font-semibold flex px-3 items-center h-12 border-b-2 border-neutral-200 dark:border-neutral-800">
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <Hash className="w-5 h-5 mr-2 text-zinc-500 dark:text-zinc-400" />
      )}
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
    </div>
  );
}
