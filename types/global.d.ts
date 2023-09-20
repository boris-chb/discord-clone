import { Member, Profile, Server as _Server } from "@prisma/client";
import { Socket, Server as NetServer } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
declare global {
  type ServerWithMembersWithProfiles = _Server & {
    members: (Member & { profile: Profile })[];
  };
  type Server = _Server;
  type ServerIoResponse = NextApiResponse & {
    socket: Socket & {
      server: NetServer & {
        io: SocketIOServer;
      };
    };
  };
}
