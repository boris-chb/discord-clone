import SocketStatus from "@/components/socket-status";
import UserAvatar from "@/components/user-avatar";
import { Hash } from "lucide-react";

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
    <div className="pl-10 text-md font-semibold flex items-center h-14 border-b border-neutral-200 dark:border-neutral-600 ">
      {type === "channel" && (
        <Hash className="w-5 h-5 mr-2 text-zinc-500 dark:text-zinc-400" />
      )}
      {type === "chat" && (
        <UserAvatar src={imageUrl} className="h-8 w-8 mr-2" />
      )}
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
      <div className="ml-auto mr-2 flex items-center">
        <SocketStatus />
      </div>
    </div>
  );
}
