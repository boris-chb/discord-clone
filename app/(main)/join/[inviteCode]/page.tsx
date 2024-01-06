import { getCurrentProfile } from "@/lib/current-profile";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

interface InvitePageProps {
  params: {
    inviteCode: string;
  };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const profile = await getCurrentProfile();
  if (!profile) return <RedirectToSignIn />;

  if (!params.inviteCode) redirect("/");

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  // user already part of the server
  if (existingServer) return redirect(`/${existingServer.id}`);

  const serverToJoin = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (serverToJoin) return redirect(`/${serverToJoin.id}`);

  return <></>;
}
