"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface ServerSearchProps {
  data: {
    label: string;
    type: "channel" | "member";
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
}

const ServerSearch: React.FC<ServerSearchProps> = ({ data }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  const onSelectItem = ({
    id,
    type,
  }: {
    id: string;
    type: "channel" | "member";
  }) => {
    setIsDialogOpen(false);

    if (type === "member") {
      return router.push(`/${params?.serverId}/chat/${id}`);
    } else if (type === "channel") {
      return router.push(`/${params?.serverId}/${id}`);
    }
  };

  useEffect(() => {
    const shortcutListener = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsDialogOpen(isDialogOpen => !isDialogOpen);
      }
    };
    document.addEventListener("keydown", shortcutListener);

    return () => document.removeEventListener("keydown", shortcutListener);
  }, []);

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        variant="ghost"
        className="group p-2 w-full rounded-md flex items-center gap-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 "
      >
        <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
          Search
        </p>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bordr bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
          <span className="text-xs">&#8984;</span>K
        </kbd>
      </Button>
      <CommandDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <CommandInput placeholder="Search channels and members" />
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          {data.map(({ label, type, data }) => {
            if (!data?.length) return null;

            return (
              <CommandGroup key={`${label}-${Math.random()}`} heading={label}>
                {data.map(({ icon, id, name }) => (
                  <CommandItem
                    onSelect={() => onSelectItem({ id, type })}
                    key={id}
                  >
                    {icon} <span>{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default ServerSearch;
