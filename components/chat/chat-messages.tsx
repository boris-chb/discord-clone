"use client";

import ChatItem from "@/components/chat/chat-item";
import ChatItemSkeleton from "@/components/chat/chat-item-loading";
import { useSocket } from "@/components/providers/socket-provider";
import { useChatStore } from "@/state/store";
import type { Member } from "@prisma/client";
import { format } from "date-fns";
import { ElementRef, useEffect, useRef } from "react";

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  type: "channel" | "chat";
  initialMessages: Message[] | DirectMessage[];
}

const DATE_FORMAT = "d MMM yyyy, HH:mm";

export default function ChatMessages({
  initialMessages,
  member,
  type,
}: ChatMessagesProps) {
  const { socket } = useSocket();
  const { messages, setMessages, addMessage, addDm, dms, setDms } =
    useChatStore();

  useEffect(() => {
    if (type === "chat") {
      setDms(initialMessages as DirectMessage[]);
    } else if (type === "channel") {
      setMessages(initialMessages as Message[]);
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, dms]);

  useEffect(() => {
    const handleNewMessage = (message: Message | DirectMessage) => {
      if (type === "channel") {
        addMessage(message as Message);
      } else if (type === "chat") {
        addDm(message as DirectMessage);
      }
    };

    socket?.on("new-message", handleNewMessage);

    return () => {
      socket?.off("new-message", handleNewMessage);
    };

    //eslint-disable-next-line
  }, []);

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  if (messages?.length === 0)
    return (
      <div className="h-full flex items-end justify-center">
        <p className="p-3 text-zinc-400 font-light">
          This is the start of your conversation.
        </p>
      </div>
    );

  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      {/* perform checks for pagination (infinite scroll) */}
      <div className="flex flex-col m-2">
        {!messages ? (
          <ChatItemSkeleton length={5} />
        ) : (
          messages.map(message => (
            <ChatItem
              key={message.id}
              id={message.id}
              currentMember={member}
              member={message.member}
              body={message.body}
              fileUrl={message.fileUrl}
              deleted={message.deleted}
              isUpdated={message.updatedAt !== message.createdAt}
              timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
            />
          ))
        )}
      </div>
      <div ref={bottomRef}></div>
    </div>
  );
}
