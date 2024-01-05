import Sidebar from "@/components/navigation/sidebar";
import ServerSidebar from "@/components/server/server-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

interface MobileSidebarProps {
  serverId: string;
}

export default function MobileSidebar({ serverId }: MobileSidebarProps) {
  return (
    <Sheet modal={false}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-0 flex gap-0 min-w-[72] sm:max-w-none md:hidden"
      >
        <Sidebar className="flex" />
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
}
