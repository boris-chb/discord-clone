import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="text-3xl">
      <ThemeToggle />
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
