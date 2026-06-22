import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Star, Clock, MapPin, Users, Megaphone,
  CreditCard, CalendarDays, Settings, User, ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockUser, mockCuotas, mockHorarios, mockComunidades, mockProfesores } from "@/lib/mock-data";
import { formatDate, formatCurrency, getInitials } from "@/lib/utils";
import { LogoutButton } from "./LogoutButton";

export const metadata: Metadata = { title: "Mi panel" };

const menuItems = [
  {
    href:    "/cuotas",
    label:   "Mis cuotas",
    sub:     "Pagos y estado de cuenta",
    icon:    CreditCard,
    iconBg:  "bg-amber-50",
    iconColor: "text-amber-600",
    accent:  "#d97706",
  },
  {
    href:    "/eventos",
    label:   "Mis eventos",
    sub:     "Actividades inscriptas",
    icon:    CalendarDays,
    iconBg:  "bg-[#15803D]/8",
    iconColor: "text-[#15803D]",
    accent:  "#15803D",
  },
  {
    href:    "/horarios",
    label:   "Horarios",
    sub:     "Entrenamientos del club",
    icon:    Clock,
    iconBg:  "bg-blue-50",
    iconColor: "text-blue-600",
    accent:  "#2563eb",
  },
  {
    href:    "#",
    label:   "Ajustes",
    sub:     "Cuenta y notificaciones",
    icon:    Settings,
    iconBg:  "bg-[#F4F6FA]",
    iconColor: "text-[#566070]",
    accent:  "#566070",
  },
];

export default function PerfilPage() {
  const pendiente    = mockCuotas.historial.find(c => c.estado === "pendiente");
  const cuotaAlDia   = mockCuotas.status === "al-dia" && !pendiente;

  return (
    <div className="animate-fade-in space-y-4">

      {/* ── Profile hero ─────────────────────────────────── */}
      <Card className="overflow-hidden border-0 shadow-[0_4px_20px_0_rgb(21_128_61/0.12)]">
        <div className="h-20 bg-gradient-to-br from-[#15803D] via-[#0F6B30] to-[#052E16]" />
        <CardContent className="pt-0 -mt-10 pb-5">
          <div className="flex items-end justify-between mb-3">
            <Avatar className="w-20 h-20 ring-4 ring-white shadow-lg">
              <AvatarImage src="" alt={mockUser.name} />
              <AvatarFallback className="bg-[#15803D] text-white text-xl font-black">
                {getInitials(mockUser.name)}
              </AvatarFallback>
            </Avatar>
            <button type="button" className="px-4 h-8 rounded-full border border-[#E8ECF4] text-xs font-semibold text-[#4A5568] bg-white hover:bg-[#F0F3FA] transition-colors mt-10">
              Editar
            </button>
          </div>
          <h1 className="text-xl font-black text-[#0D1117]">{mockUser.name}</h1>
          <p className="text-sm text-[#566070] mt-0.5">Socio #{mockUser.socioNumber}</p>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <Badge variant="green" className="font-semibold">{mockUser.category}</Badge>
            {mockUser.sports.map(s => <Badge key={s} variant="default">{s}</Badge>)}
          </div>
        </CardContent>
      </Card>

      {/* ── Cuota status ─────────────────────────────────── */}
      <Link href="/cuotas">
        <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-opacity hover:opacity-90 ${
          cuotaAlDia ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"
        }`}>
          <CreditCard className={`w-5 h-5 shrink-0 ${cuotaAlDia ? "text-emerald-600" : "text-amber-600"}`} aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold ${cuotaAlDia ? "text-emerald-800" : "text-amber-800"}`}>
              {cuotaAlDia ? "Cuota al día ✓" : "Tenés una cuota pendiente"}
            </p>
            {pendiente && "vencimiento" in pendiente && (
              <p className="text-xs text-amber-600 mt-0.5">
                {pendiente.mes} · Vence {formatDate(pendiente.vencimiento, { day: "numeric", month: "long" })}
              </p>
            )}
          </div>
          {pendiente && (
            <span className="text-sm font-bold text-amber-700 shrink-0">
              {formatCurrency(pendiente.monto)}
            </span>
          )}
          <ChevronRight className="w-4 h-4 text-[#566070] shrink-0" aria-hidden="true" />
        </div>
      </Link>

      {/* ── Panel menu grid ───────────────────────────────── */}
      <div>
        <p className="text-[10px] font-bold text-[#566070] uppercase tracking-widest mb-3">Mi panel</p>
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map(({ href, label, sub, icon: Icon, iconBg, iconColor, accent }) => (
            <Link key={label} href={href}>
              <div className="bg-white border border-[#E8ECF4] rounded-2xl p-4 hover:shadow-[0_4px_16px_0_rgb(0_0_0/0.08)] transition-all active:scale-[0.98] h-full">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${iconBg}`}>
                  <Icon aria-hidden="true" className={`w-5 h-5 ${iconColor}`} strokeWidth={1.8} />
                </div>
                <p className="text-sm font-bold text-[#0D1117] leading-tight">{label}</p>
                <p className="text-[11px] text-[#566070] mt-0.5 leading-snug">{sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Mis deportes ─────────────────────────────────── */}
      <div>
        <p className="text-[10px] font-bold text-[#566070] uppercase tracking-widest mb-3">
          Mis deportes ({mockUser.sports.length})
        </p>
        <div className="space-y-3">
          {mockUser.sports.map(deporte => {
            const comunidad = mockComunidades.find(c => c.nombre === deporte);
            const horarios  = mockHorarios.filter(h => h.deporte === deporte);
            const profes    = mockProfesores.filter(p => p.deporte === deporte);
            if (!comunidad) return null;

            return (
              <Card key={deporte} className="overflow-hidden border-[#E8ECF4]">
                <div className={`bg-gradient-to-br ${comunidad.gradient} p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                        <span className="text-2xl" role="img" aria-label={deporte}>{comunidad.emoji}</span>
                      </div>
                      <div>
                        <p className="text-base font-black text-white leading-tight">{deporte}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Users aria-hidden="true" className="w-3 h-3 text-white/60" />
                          <span className="text-xs text-white/70">{comunidad.miembros} miembros</span>
                        </div>
                      </div>
                    </div>
                    <Link href="/avisos"
                      className="flex items-center gap-1 text-[11px] font-bold bg-white/20 hover:bg-white/30 text-white px-2.5 py-1.5 rounded-full transition-colors shrink-0">
                      <Megaphone aria-hidden="true" className="w-3 h-3" /> Novedades
                    </Link>
                  </div>
                </div>

                <CardContent className="py-3 px-4">
                  {profes.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[10px] font-bold text-[#566070] uppercase tracking-wider mb-2">
                        {profes.length === 1 ? "Profe" : "Profes"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {profes.map(profe => (
                          <div key={profe.id} className="flex items-center gap-1.5">
                            <Avatar className={`w-6 h-6 ${comunidad.colorBg}`}>
                              <AvatarFallback className={`text-[9px] font-bold ${comunidad.colorText}`}>
                                {profe.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-semibold text-[#0D1117]">{profe.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {horarios.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-[#566070] uppercase tracking-wider mb-2">Horarios</p>
                      <div className="space-y-2">
                        {horarios.map(h => (
                          <div key={h.id} className="flex items-start gap-2.5 p-2.5 rounded-xl"
                            style={{ background: `${comunidad.color}08` }}>
                            <div className="w-1 rounded-full shrink-0 mt-0.5 self-stretch min-h-[2rem]"
                              style={{ background: comunidad.color }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-[#0D1117] leading-tight">{h.categoria}</p>
                              <div className="flex items-center gap-1 mt-1 flex-wrap">
                                <Clock aria-hidden="true" className="w-3 h-3 text-[#566070] shrink-0" />
                                <span className="text-[11px] text-[#566070]">{h.dias.join(", ")} · {h.horario}</span>
                              </div>
                              <div className="flex items-center gap-1 mt-0.5">
                                <MapPin aria-hidden="true" className="w-3 h-3 text-[#566070] shrink-0" />
                                <span className="text-[11px] text-[#566070]">{h.lugar}</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold shrink-0 mt-0.5"
                              style={{ color: comunidad.color }}>
                              {h.profesor.split(" ")[0]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ── Carnet digital ───────────────────────────────── */}
      <div>
        <p className="text-[10px] font-bold text-[#566070] uppercase tracking-widest mb-3">Carnet digital</p>
        <Card className="overflow-hidden border-0 shadow-[0_4px_20px_0_rgb(21_128_61/0.15)]">
          <div className="bg-gradient-to-br from-[#15803D] via-[#0F6B30] to-[#052E16] p-5 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5" aria-hidden="true" />
            <div className="absolute -right-4 top-8 w-20 h-20 rounded-full bg-white/5" aria-hidden="true" />
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div>
                <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Club Atlético</p>
                <p className="text-white font-black text-lg leading-tight">Deportivo Patagones</p>
              </div>
              <Image src="/escudo.png" alt="Escudo Deportivo Patagones" width={44} height={43} className="opacity-90 drop-shadow-md" />
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
                    <Star className="w-3 h-3 fill-current" aria-hidden="true" /> Al día
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Cerrar sesión ────────────────────────────────── */}
      <LogoutButton />
    </div>
  );
}
