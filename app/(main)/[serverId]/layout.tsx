import ServerSidebar from "@/components/server/server-sidebar";
import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

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
    <div className="h-full pl-16">
      <div className="h-full w-60 fixed">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="ml-60 h-full w-full">{children}</main>
    </div>
  );
}
