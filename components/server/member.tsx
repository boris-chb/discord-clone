"use client";
import UserAvatar from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface MemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

const roleIconMap = {
  Guest: null,
  Moderator: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-400" />,
  Admin: <ShieldAlert className="h-4 w-4 ml-2 text-rose-400" />,
};

export default function Member({ member, server }: MemberProps) {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.role];

  const onSelectMember = () => {
    router.push(`/${server.id}/chat/${member.id}`);
  };

  return (
    <button
      onClick={onSelectMember}
      className={cn(
        "group p-2 rounded-md flex items-center gap-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar
        className="h-8 w-8 md:h-10 md:w-10"
        src={member.profile.imageUrl}
      />
      <p
        className={cn(
          "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.memberId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
}
