"use client";
import type { ReactNode } from "react";
import { AuthProvider } from "@/components/providers/auth-provider";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-dvh flex flex-col bg-[#F4F6FA]">
        <TopBar />
        <main id="main-content" className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 pb-28">
          {children}
        </main>
        <BottomNav />
      </div>
    </AuthProvider>
  );
}
