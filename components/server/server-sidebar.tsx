import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import ServerSection from "@/components/server/server-section";
import ServerHeader from "@/components/server/server-header";
import ServerSearch from "@/components/server/server-search";
import { getCurrentProfile } from "@/lib/current-profile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChannelType, MemberRole } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import Channel from "@/components/server/channel";
import { RedirectToSignIn } from "@clerk/nextjs";
import Member from "@/components/server/member";
import { db } from "@/lib/db";

interface ServerSidebarProps {
  serverId: string;
}

const channelIconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.Guest]: null,
  [MemberRole.Moderator]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.Admin]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
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
    channel => channel.type === ChannelType.TEXT,
  );

  const audioChannels = server?.channels.filter(
    channel => channel.type === ChannelType.AUDIO,
  );

  const videoChannels = server?.channels.filter(
    channel => channel.type === ChannelType.VIDEO,
  );

  // get all channel members except current user
  const members = server?.members.filter(
    member => member.profileId !== currentUserProfile.id,
  );

  const role = server?.members.find(
    member => member.profileId === currentUserProfile.id,
  )?.role;

  return (
    <div className="flex flex-col p-2 h-full text-primary w-full dark:bg-zinc-900 bg-zinc-100">
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
      <Separator className="rounded-md my-2 bg-zinc-200" />
      {!!textChannels.length && (
        <div className="mb-2 ">
          <ServerSection
            sectionType="channels"
            channelType={ChannelType.TEXT}
            role={role}
            label="Text Channels"
          />
          {textChannels.map(channel => (
            <Channel
              key={channel.id}
              channel={channel}
              server={server}
              role={role}
            />
          ))}
        </div>
      )}
      {!!audioChannels.length && (
        <div className="mb-2 ">
          <ServerSection
            sectionType="channels"
            channelType={ChannelType.AUDIO}
            role={role}
            label="Voice Channels"
          />
          {audioChannels.map(channel => (
            <Channel
              key={channel.id}
              channel={channel}
              server={server}
              role={role}
            />
          ))}
        </div>
      )}
      {!!videoChannels.length && (
        <div className="mb-2">
          <ServerSection
            sectionType="channels"
            channelType={ChannelType.VIDEO}
            role={role}
            label="Video Channels"
          />
          {videoChannels.map(channel => (
            <Channel
              key={channel.id}
              channel={channel}
              server={server}
              role={role}
            />
          ))}
        </div>
      )}
      {!!members.length && (
        <div className="mb-2">
          <ServerSection
            sectionType="members"
            role={role}
            label="Members"
            server={server}
          />
          {members.map(member => (
            <Member key={member.id} member={member} server={server} />
          ))}
        </div>
      )}
    </div>
  );
}
