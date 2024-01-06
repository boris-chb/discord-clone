import ServerSidebar from "@/components/server/server-sidebar";
import { getCurrentProfile } from "@/lib/current-profile";
import MobileSidebar from "@/components/mobile-toggle";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

interface ServerLayoutProps {
  children: React.ReactNode;
  params: {
    serverId: string;
  };
}

export default async function ServerLayout({
  children,
  params,
}: ServerLayoutProps) {
  const profile = await getCurrentProfile();

  if (!profile) return redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) return redirect("/");

  return (
    <div className="h-full">
      <div className="fixed top-1 md:hidden">
        <MobileSidebar serverId={params.serverId} />
      </div>
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
}
