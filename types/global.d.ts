import { Member, Profile, Server as _Server } from "@prisma/client";

declare global {
  type ServerWithMembersWithProfiles = _Server & {
    members: (Member & { profile: Profile })[];
  };
  type Server = _Server;
}
