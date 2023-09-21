import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface ChannelProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

export default async function ChannelPage({
  params: { channelId, serverId },
}: ChannelProps) {
  const profile = await getCurrentProfile();
  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });
  const member = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile?.id,
    },
  });

  if (!member || !channel) redirect("/");

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
      <ChatHeader name={channel.name} type="channel" serverId={serverId} />

      <ChatMessages
        member={member}
        name={channel.name}
        chatId={channel.id}
        type="channel"
        apiUrl="/api/messages"
        socketUrl="/api/socket/messages"
        socketQuery={{
          channelId,
          serverId,
        }}
        paramKey="channelId"
        paramValue={channelId}
      />

      <ChatInput
        name={channel.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{
          channelId,
          serverId,
        }}
      />
    </div>
  );
}
