"use client";

import { useSocket } from "@/components/providers/socket-provider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SocketStatusProps {}

export default function SocketStatus({}: SocketStatusProps) {
  const { isConnected } = useSocket();

  return (
    <Badge
      className={cn(
        "bg-yellow-600 text-white border-none",
        isConnected && "bg-emerald-600",
      )}
      variant="outline"
    >
      {isConnected ? "Connected" : "Reconnecting"}
    </Badge>
  );
}
