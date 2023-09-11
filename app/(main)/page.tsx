import InitialModal from "@/components/modals/initial-modal";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { db } from "@/lib/db";
import { initProfile } from "@/lib/init-profile";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";

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

  if (server) return redirect(`/server/${server.id}`);

  return (
    <div className="text-3xl">
      <ThemeToggle />
      <UserButton afterSignOutUrl="/" />
      <InitialModal />
    </div>
  );
}
