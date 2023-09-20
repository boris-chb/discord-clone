"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

type SocketContext = {
  socket: any | null;
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
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketClient = io(process.env.NEXT_PUBLIC_SITE_URL as string, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    console.log(socketClient);

    socketClient.on("connect", () => {
      console.log("connected");
      setIsConnected(true);
    });

    socketClient.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketClient);

    return () => {};
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
