import SidebarItem from "@/components/navigation/sidebar-item";
import { RedirectToSignIn, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getCurrentProfile } from "@/lib/current-profile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import SidebarAction from "./sidebar-action";
import { cn } from "@/lib/utils";
import { db } from "@/lib/db";
import Link from "next/link";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Sidebar: React.FC<SidebarProps> = async ({ className }) => {
  const profile = await getCurrentProfile();

  if (!profile) return <RedirectToSignIn />;

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

  return (
    <nav
      className={cn(
        "space-y-4 py-3 md:flex flex-col items-center h-full text-primary  dark:bg-zinc-950 bg-zinc-200 hidden w-18",
        className && className,
      )}
    >
      <SidebarAction />
      <Separator className="w-3/4 bg-zinc-300 dark:bg-zinc-700 mx-auto" />
      <ScrollArea className="flex-1 w-full h-full my-3">
        <div className="flex flex-col gap-3">
          {servers.map(server => (
            <Link
              key={server.id}
              href={`/${server.id}/${server?.channels[0].id}`}
            >
              <SidebarItem
                key={server.id}
                id={server.id}
                name={server.name}
                imageUrl={server.imageUrl}
              />
            </Link>
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
              userPreviewSecondaryIdentifier: "dark:text-zinc-100",
              userButtonPopoverCard:
                "dark:bg-zinc-800 dark:text-white dark:border dark:border-zinc-600",
              userButtonPopoverActionButtonText: "dark:text-white",
              userButtonPopoverActions: "dark:bg-zinc-800",
              userButtonPopoverFooter: "hidden",
            },
          }}
        />
      </div>
    </nav>
  );
};

export default Sidebar;
