import {
  Member,
  Profile,
  Server as _Server,
  Message as _Message,
  DirectMessage as _DirectMessage,
} from "@prisma/client";
import { Socket, Server as NetServer } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
declare global {
  type ServerWithMembersWithProfiles = _Server & {
    members: (Member & { profile: Profile })[];
  };
  type Server = _Server;
  type Message = _Message & {
    member: Member & {
      profile: Profile;
    };
  };
  type DirectMessage = _DirectMessage & {
    member: Member & {
      profile: Profile;
    };
  };
  type ServerIoResponse = NextApiResponse & {
    socket: Socket & {
      server: NetServer & {
        io: SocketIOServer;
      };
    };
  };
}
