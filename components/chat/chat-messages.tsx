"use client";

import ChatItem from "@/components/chat/chat-item";
import { useChatQuery } from "@/hooks/use-chat-query";
import type { Member, Message, Profile } from "@prisma/client";
import { ElementRef, Fragment, useRef } from "react";
import { format } from "date-fns";

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "chatId";
  paramValue: string;
  type: "channel" | "chat";
}

type _Message = Message & {
  member: Member & {
    profile: Profile;
  };
};

const DATE_FORMAT = "d MMM yyyy, HH:mm";

export default function ChatMessages({
  apiUrl,
  chatId,
  member,
  name,
  paramKey,
  paramValue,
  socketQuery,
  socketUrl,
  type,
}: ChatMessagesProps) {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isSuccess,
  } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
  });

  if (isLoading) return <div className="w-full h-full">Loading</div>;
  if (isError) return <div className="w-full h-full">Error</div>;

  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      {/* perform checks for pagination (infinite scroll) */}

      <div className="flex flex-col-reverse mt-auto">
        {data?.pages.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: _Message) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                member={message.member}
                body={message.body}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
