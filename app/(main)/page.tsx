import InitialModal from "@/components/modals/initial-modal";
import { initProfile } from "@/lib/init-profile";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function Home() {
  const profile = await initProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) return redirect(`/${server.id}`);

  return <InitialModal />;
}
