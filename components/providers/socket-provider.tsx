"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentProfile } from "@/lib/current-profile";
import { Socket, io } from "socket.io-client";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

type SocketContext = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContext>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { serverId, channelId } = useParams();
  const { user: currentUser } = useUser();

  const user =
    currentUser?.username ?? currentUser?.fullName ?? currentUser?.firstName;

  useEffect(() => {
    const socketClient = io(process.env.NEXT_PUBLIC_BACKEND_URL_PROD as string);

    socketClient?.on("connect", () => {
      setSocket(socketClient);
      console.log("client connected");
    });

    socketClient?.on("disconnect", () => {
      setSocket(null);
      console.log(`client disconnected`);
    });

    return () => {
      socketClient?.close();
      setSocket(null);
      console.log("client connection closed");
    };
    // eslint-disable-next-line
  }, []);

  // Join room for current channel
  useEffect(() => {
    if (!currentUser || !socket || !channelId) return;

    const roomId = `${serverId}:${channelId}`;

    socket?.emit("join-room", { roomId, user });

    // join a different room only when channelId or socket is changed
    // no need to add currentUser, since changing it requires redirects, which
    // modifies channelId, which is already included
    //eslint-disable-next-line
  }, [channelId, socket, currentUser]);

  return (
    <SocketContext.Provider
      value={{ socket, isConnected: socket?.connected as boolean }}
    >
      {children}
    </SocketContext.Provider>
  );
};
