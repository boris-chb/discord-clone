import ServerHeader from "@/components/server/server-header";
import ServerSearch from "@/components/server/server-search";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn, redirectToSignIn } from "@clerk/nextjs";
import { ChannelType, MemberRole } from "@prisma/client";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

interface ServerSidebarProps {
  serverId: string;
}

const channelIconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
};

export default async function ServerSidebar({ serverId }: ServerSidebarProps) {
  const currentUserProfile = await getCurrentProfile();
  if (!currentUserProfile) return <RedirectToSignIn />;

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  if (!server) return;

  const textChannels = server?.channels.filter(
    channel => channel.type === ChannelType.TEXT
  );

  const audioChannels = server?.channels.filter(
    channel => channel.type === ChannelType.AUDIO
  );

  const videoChannels = server?.channels.filter(
    channel => channel.type === ChannelType.VIDEO
  );

  // get all channel members except current user
  const members = server?.members.filter(
    member => member.profileId !== currentUserProfile.id
  );

  const role = server?.members.find(
    member => member.profileId === currentUserProfile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-zinc-800 bg-zinc-200">
      <ServerHeader server={server} role={role} />
      <ScrollArea>
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members.map(member => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
      </ScrollArea>
      {textChannels.map(channel => (
        <div key={`${channel.name}-${Math.random()}`}>{channel.name}</div>
      ))}
    </div>
  );
}
