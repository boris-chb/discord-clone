import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import SidebarAction from "./sidebar-action";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import SidebarItem from "@/components/navigation/sidebar-item";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserButton } from "@clerk/nextjs";

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = async () => {
  const profile = await getCurrentProfile();

  if (!profile) return redirect("/");

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <nav className="space-y-4 py-3 flex flex-col items-center h-full text-primary w-full dark:bg-zinc-950">
      <SidebarAction />
      <Separator className="w-3/4 bg-zinc-300 dark:bg-zinc-700 mx-auto" />
      <ScrollArea className="flex-1  w-full my-3">
        <div className="flex flex-col gap-3">
          {servers.map(server => (
            <SidebarItem
              key={server.id}
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          ))}
        </div>
      </ScrollArea>
      <div className="mt-auto flex items-center flex-col gap-4">
        <ThemeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-12 w-12",
            },
          }}
        />
      </div>
    </nav>
  );
};

export default Sidebar;
