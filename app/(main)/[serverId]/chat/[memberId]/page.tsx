import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import MediaRoom from "@/components/media-room";
import { getOrCreateChat } from "@/lib/chat";
import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";

interface ChatProps {
  params: {
    serverId: string;
    memberId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

export default async function ChatPage({
  params: { serverId, memberId },
  searchParams,
}: ChatProps) {
  const profile = await getCurrentProfile();

  if (!profile) return <RedirectToSignIn />;

  const currentMember = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
  });

  if (!currentMember) return <RedirectToSignIn />;

  const chat = await getOrCreateChat(currentMember.id, memberId);

  // TODO
  if (!chat) return <>Not found</>;

  const { firstMember, secondMember } = chat;

  const interlocutor =
    firstMember.profileId === profile.id ? secondMember : firstMember;

  const dms = await db.directMessage.findMany({
    take: 10,
    where: {
      memberId: interlocutor.id,
    },
    include: {
      member: {
        include: {
          profile: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <div className="bg-white dark:bg-zinc-800 flex flex-col h-full">
      <ChatHeader
        imageUrl={interlocutor.profile.imageUrl}
        name={interlocutor.profile.name}
        serverId={serverId}
        type="chat"
      />
      {searchParams.video ? (
        <MediaRoom chatId={chat.id} video={true} audio={true} />
      ) : (
        <>
          <ChatMessages
            member={currentMember}
            initialMessages={dms}
            chatId={chat.id}
            name={interlocutor.profile.name}
            type="chat"
          />

          <ChatInput
            apiUrl="/api/direct-messages"
            serverId={serverId}
            name={interlocutor.profile.name}
            id={chat.id}
            type="chat"
          />
        </>
      )}
    </div>
  );
}
