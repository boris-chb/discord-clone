import SidebarItem from "@/components/navigation/sidebar-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { UserButton } from "@clerk/nextjs";
import SidebarAction from "./sidebar-action";

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = async () => {
  const profile = await getCurrentProfile();

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          // we always have a profile since we go through set up on '/'
          // if they don't have one, we always create it, profile can't be null!
          profileId: profile!.id,
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
