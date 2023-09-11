import Sidebar from "@/components/navigation/sidebar";

interface ServerLayoutProps {
  children: React.ReactNode;
}

const ServerLayout: React.FC<ServerLayoutProps> = ({ children }) => {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <Sidebar />
      </div>
      <main className="md:pl-[72px] h-full">{children}</main>
    </div>
  );
};

export default ServerLayout;
