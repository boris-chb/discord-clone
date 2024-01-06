import InitialModal from "@/components/modals/initial-modal";
import { getCurrentProfile } from "@/lib/current-profile";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

interface ServerPageProps {
  params: {
    serverId: string;
  };
}

const ServerPage: React.FC<ServerPageProps> = async ({
  params: { serverId },
}) => {
  const currentProfile = await getCurrentProfile();

  if (!currentProfile) return <RedirectToSignIn />;

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: currentProfile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!server) {
    return <InitialModal />;
  }

  const initialChannel = server?.channels[0];

  return redirect(`/${server.id}/${initialChannel.id}`);
};

export default ServerPage;
