import ChatMessages from "@/components/chat/chat-messages";
import { getCurrentProfile } from "@/lib/current-profile";
import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import { getMessages } from "@/lib/get-messages";
import MediaRoom from "@/components/media-room";
import { redirect } from "next/navigation";
import { Message } from "@prisma/client";
import { db } from "@/lib/db";
import axios from "axios";

interface ChannelProps {
  params: {
    serverId: string;
    channelId: string;
  };
  searchParams: any;
}

export const revalidate = 0;

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
    include: {
      profile: true,
    },
  });

  if (!member || !channel) redirect("/");

  const messages = (
    await db.message.findMany({
      take: 20,
      where: {
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  ).reverse();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-800">
      <ChatHeader name={channel.name} type="channel" serverId={serverId} />
      {channel.type === "TEXT" && (
        <>
          <ChatMessages
            initialMessages={messages}
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
          />

          <ChatInput
            serverId={serverId}
            currentUser={member}
            name={channel.name}
            type="channel"
            apiUrl="/api/messages"
            id={channelId}
          />
        </>
      )}
      {channel.type === "AUDIO" && (
        <MediaRoom chatId={channel.id} video={false} audio={true} />
      )}
      {channel.type === "VIDEO" && (
        <MediaRoom chatId={channel.id} video={true} audio={true} />
      )}
    </div>
  );
}
