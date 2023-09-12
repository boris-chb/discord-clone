import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import ModalProvider from "@/components/providers/modal-provider";
import Sidebar from "@/components/navigation/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord clone",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          storageKey="discord-theme"
        >
          <ModalProvider />
          <body className={cn(inter.className, "bg-white dark:bg-stone-800")}>
            <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
              <Sidebar />
            </div>
            {children}
          </body>
        </ThemeProvider>
      </html>
    </ClerkProvider>
  );
}
