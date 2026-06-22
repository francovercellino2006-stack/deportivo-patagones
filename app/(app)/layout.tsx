import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-[#F4F6FA]">
      <TopBar />
      <main id="main-content" className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 pb-28">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
