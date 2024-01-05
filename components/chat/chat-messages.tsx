"use client";

import Message, { MessageFollowUp } from "@/components/chat/chat-item";
import ChatItemSkeleton from "@/components/chat/chat-item-loading";
import { useSocket } from "@/components/providers/socket-provider";
import { useChatStore } from "@/state/store";
import type { Member } from "@prisma/client";
import { ElementRef, useEffect, useRef } from "react";

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  type: "channel" | "chat";
  initialMessages: Message[] | DirectMessage[];
}

export default function ChatMessages({
  initialMessages,
  member,
  type,
}: ChatMessagesProps) {
  const { socket } = useSocket();
  const { messages, dms, setMessages, setDms, addMessage, addDm } =
    useChatStore();

  // Scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, dms]);

  // Add messages to store
  useEffect(() => {
    if (type === "chat") {
      setDms(initialMessages as DirectMessage[]);
    } else if (type === "channel") {
      setMessages(initialMessages as Message[]);
    }
    //eslint-disable-next-line
  }, []);

  // Listen for new messages from WebSocket
  useEffect(() => {
    const handleNewMessage = (message: Message | DirectMessage) => {
      if (type === "channel") {
        addMessage(message as Message);
      } else if (type === "chat") {
        addDm(message as DirectMessage);
      }
    };

    socket?.on("new-message", (message) => {
      console.log(`new message`, message);
      addMessage(message);
    });

    return () => {
      socket?.off("new-message", handleNewMessage);
    };
    //eslint-disable-next-line
  }, [socket]);

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
    <div className="flex-1 flex-col gap-1 py-4 overflow-y-auto">
      {/* perform checks for pagination (infinite scroll) */}
      {!messages ? (
        <ChatItemSkeleton length={10} />
      ) : (
        messages.map((message, i) => {
          const isLastMessage = i === messages.length - 1;
          const isFirstMessageFromUser =
            i === 0 ||
            message.member.profile.name !== messages[i - 1].member.profile.name;

          if (isFirstMessageFromUser) {
            return (
              <Message
                key={message.id}
                currentMember={member}
                message={message}
                ref={isLastMessage ? bottomRef : null}
              />
            );
          } else {
            return (
              <MessageFollowUp
                key={message.id}
                currentMember={member}
                message={message}
                ref={isLastMessage ? bottomRef : null}
              />
            );
          }
        })
      )}

      <div ref={bottomRef}></div>
    </div>
  );
}
