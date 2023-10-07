"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

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
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketClient = io(
      process.env.NEXT_PUBLIC_BACKEND_URL_PROD as string,
      {
        addTrailingSlash: false,
      }
    );

    console.log(process.env.NEXT_PUBLIC_BACKEND_URL_PROD);

    socketClient?.on("connect", () => {
      setIsConnected(true);
      setSocket(socketClient);
      console.log("client connected");
    });

    socketClient?.on("disconnect", () => {
      setIsConnected(false);
      setSocket(null);
      console.log("client disconnected");
    });

    return () => {
      socketClient?.close();
      setSocket(null);
      setIsConnected(false);
      console.log("client connection closed");
    };
    // eslint-disable-next-line
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
