import type { Metadata } from "next";
import Image from "next/image";
import { Shield, CreditCard, Trophy, Settings, LogOut, ChevronRight, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/layout/top-bar";
import { mockUser, mockCuotas } from "@/lib/mock-data";
import { formatDate, getInitials } from "@/lib/utils";

export const metadata: Metadata = { title: "Mi Perfil" };

export default function PerfilPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Mi perfil" />

      {/* Profile hero */}
      <Card className="mb-4 overflow-hidden border-0 shadow-[0_4px_20px_0_rgb(21_128_61/0.12)]">
        <div className="h-24 bg-gradient-to-br from-[#15803D] via-[#0F6B30] to-[#052E16]" />
        <CardContent className="pt-0 -mt-10 pb-5">
          <div className="flex items-end justify-between mb-4">
            <Avatar className="w-20 h-20 ring-4 ring-white shadow-lg">
              <AvatarImage src="" alt={mockUser.name} />
              <AvatarFallback className="bg-[#15803D] text-white text-xl font-black">
                {getInitials(mockUser.name)}
              </AvatarFallback>
            </Avatar>
            <button className="px-4 h-8 rounded-full border border-[#E8ECF4] text-xs font-semibold text-[#4A5568] bg-white hover:bg-[#F0F3FA] transition-colors mt-10">
              Editar
            </button>
          </div>
          <h2 className="text-xl font-black text-[#0D1117]">{mockUser.name}</h2>
          <p className="text-sm text-[#566070] mt-0.5">Socio #{mockUser.socioNumber}</p>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <Badge variant="green" className="font-semibold">{mockUser.category}</Badge>
            {mockUser.sports.map(s => (
              <Badge key={s} variant="default">{s}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Member card */}
      <Card className="mb-4 overflow-hidden border-0 shadow-[0_4px_20px_0_rgb(21_128_61/0.15)]">
        <div className="bg-gradient-to-br from-[#15803D] via-[#0F6B30] to-[#052E16] p-5 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute -right-4 top-8 w-20 h-20 rounded-full bg-white/5" />

          <div className="flex items-start justify-between mb-6 relative z-10">
            <div>
              <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Club Atlético</p>
              <p className="text-white font-black text-lg leading-tight">Deportivo Patagones</p>
            </div>
            <Image src="/escudo.png" alt="DP" width={44} height={43} className="opacity-90 drop-shadow-md" />
          </div>

          <div className="relative z-10">
            <p className="text-white font-black text-xl tracking-wide mb-4">{mockUser.name}</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/50 text-[9px] uppercase tracking-widest font-semibold">Socio</p>
                <p className="text-white font-bold text-sm">#{mockUser.socioNumber}</p>
              </div>
              <div>
                <p className="text-white/50 text-[9px] uppercase tracking-widest font-semibold">Desde</p>
                <p className="text-white font-bold text-sm">{formatDate(mockUser.joinedAt, { year: "numeric", month: "long" })}</p>
              </div>
              <div>
                <p className="text-white/50 text-[9px] uppercase tracking-widest font-semibold">Estado</p>
                <p className="text-emerald-300 font-bold text-sm flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> Al día
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Menu links */}
      <Card className="mb-4">
        <CardContent className="py-1 divide-y divide-[#F4F6FA]">
          {[
            { icon: CreditCard, label: "Mis cuotas", sub: "Ver historial de pagos", href: "/cuotas" },
            { icon: Trophy,     label: "Mis eventos", sub: "Eventos inscriptos",    href: "/eventos" },
            { icon: Settings,   label: "Ajustes",    sub: "Configuración de cuenta", href: "#"      },
          ].map(({ icon: Icon, label, sub, href }) => (
            <a key={label} href={href} className="flex items-center gap-3.5 py-4 hover:bg-[#F4F6FA] transition-colors -mx-5 px-5 first:rounded-t-2xl last:rounded-b-2xl">
              <div className="w-9 h-9 rounded-xl bg-[#F0F3FA] flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5 text-[#4A5568]" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0D1117]">{label}</p>
                <p className="text-xs text-[#566070]">{sub}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#6B7A8D] shrink-0" />
            </a>
          ))}
        </CardContent>
      </Card>

      <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-[#E8ECF4] bg-white text-[#C8102E] hover:bg-red-50 transition-colors">
        <LogOut className="w-4 h-4" />
        <span className="text-sm font-semibold">Cerrar sesión</span>
      </button>
    </div>
  );
}
