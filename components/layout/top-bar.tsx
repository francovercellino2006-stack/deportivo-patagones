"use client";
import Link from "next/link";
import Image from "next/image";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function TopBar({ className }: { className?: string }) {
  return (
    <header className={cn(
      "sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-[#E8ECF4] pt-safe",
      className
    )}>
      <div className="flex items-center justify-between h-14 px-4 max-w-2xl mx-auto">
        {/* Brand */}
        <Link href="/inicio" className="flex items-center gap-2.5">
          <Image src="/escudo.png" alt="VC" width={34} height={33} className="shrink-0 drop-shadow-sm" />
          <div className="leading-none">
            <p className="text-[#0D1117] font-black text-sm tracking-tight">Deportivo Patagones</p>
            <p className="text-[#8892A4] text-[10px] font-medium">Club Atlético · Patagones</p>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F0F3FA] transition-colors">
            <Bell className="w-5 h-5 text-[#4A5568]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C8102E] rounded-full ring-2 ring-white" />
          </button>
          <Link href="/perfil">
            <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-[#15803D]/20 hover:ring-[#15803D]/50 transition-all">
              <AvatarImage src="" alt={mockUser.name} />
              <AvatarFallback className="bg-[#15803D] text-white text-xs font-bold">
                {mockUser.name.split(" ").map(n => n[0]).slice(0,2).join("")}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#0D1117]">{title}</h1>
        {subtitle && <p className="text-sm text-[#8892A4] mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
