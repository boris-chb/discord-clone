"use client";

import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import "@livekit/components-styles";
import axios from "axios";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export default function MediaRoom({ audio, chatId, video }: MediaRoomProps) {
  const { user } = useUser();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!user) return;

    const name = `${user.firstName} ${user.lastName ?? ""}`;

    const getToken = async () => {
      try {
        const { data } = await axios.get(
          `/api/livekit?room=${chatId}&username=${name}`,
        );
        console.log(data);
        setToken(data.token);
      } catch (e) {
        console.log(e);
      }
    };

    getToken();
  }, [user, chatId]);

  if (token === "")
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );

  return (
    <LiveKitRoom
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      audio={audio}
      video={video}
      data-lk-theme="default"
    >
      <VideoConference />
    </LiveKitRoom>
  );
}
