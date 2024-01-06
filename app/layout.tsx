import { SocketProvider } from "@/components/providers/socket-provider";
// import ModalProvider from "@/components/providers/modal-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import Sidebar from "@/components/navigation/sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord clone",
  description: "Realtime messaging app inspired by Discord",
};

const ModalProvider = dynamic(
  () => import("../components/providers/modal-provider"),
  {
    loading: () => <p>Loading...</p>,
  },
);

// export const runtime = "edge";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <SocketProvider>
        <html suppressHydrationWarning lang="en">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            storageKey="discord-theme"
          >
            <body className={`${inter.className}`}>
              <Toaster />
              <ModalProvider />
              <div className="h-full flex">
                <Sidebar />
                <main className="h-full w-full">{children}</main>
              </div>
            </body>
          </ThemeProvider>
        </html>
      </SocketProvider>
    </ClerkProvider>
  );
}
