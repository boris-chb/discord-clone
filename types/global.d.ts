import { Member, Profile, Server } from "@prisma/client";

declare global {
  type ServerWithMembersWithProfiles = Server & {
    members: (Member & { profile: Profile })[];
  };
}
