import Sidebar from "@/components/navigation/sidebar";
import ModalProvider from "@/components/providers/modal-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
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
      <html suppressHydrationWarning lang="en">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          storageKey="discord-theme"
        >
          <ModalProvider />
          <body className={cn(inter.className, "bg-white dark:bg-stone-800")}>
            <Toaster />
            <div className="h-full">
              <div className="invisible md:visible md:flex h-full w-[80px] z-30 flex-col fixed inset-y-0">
                <Sidebar />T
              </div>
              <main className="md:pl-[80px] h-full">{children}</main>
            </div>
          </body>
        </ThemeProvider>
      </html>
    </ClerkProvider>
  );
}
