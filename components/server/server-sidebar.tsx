import ServerHeader from "@/components/server/server-header";
import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn, redirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

interface ServerSidebarProps {
  serverId: string;
}

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
    </div>
  );
}
