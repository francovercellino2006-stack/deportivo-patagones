import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Newspaper, Calendar, Trophy, CreditCard, Clock, Users,
  ChevronRight, AlertCircle, CheckCircle2, Megaphone,
  MapPin, Shield, Dumbbell
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, categoryBadgeVariant } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  mockUser, mockNoticias, mockEventos, mockCuotas,
  mockPartidos, mockAvisos, mockProfesores, type AvisoTipo
} from "@/lib/mock-data";
import { formatDate, formatShortDate, formatCurrency } from "@/lib/utils";

export const metadata: Metadata = { title: "Inicio" };

const quickLinks = [
  { href: "/noticias",     label: "Noticias",   icon: Newspaper,  bg: "bg-[#15803D]/8",  color: "text-[#15803D]"  },
  { href: "/avisos",       label: "Avisos",     icon: Megaphone,  bg: "bg-[#15803D]/8",  color: "text-[#15803D]"  },
  { href: "/horarios",     label: "Horarios",   icon: Clock,      bg: "bg-[#15803D]/8",  color: "text-[#15803D]"  },
  { href: "/cuotas",       label: "Cuotas",     icon: CreditCard, bg: "bg-amber-50",     color: "text-amber-600"  },
  { href: "/calendario",   label: "Agenda",     icon: Calendar,   bg: "bg-[#15803D]/8",  color: "text-[#15803D]"  },
  { href: "/perfil",       label: "Mi Carnet",  icon: Shield,     bg: "bg-[#15803D]/8",  color: "text-[#15803D]"  },
];

const tipoCfg: Record<AvisoTipo, { label: string; dot: string }> = {
  general:      { label: "General",      dot: "bg-[#566070]"  },
  suspensión:   { label: "Suspendido",   dot: "bg-[#C8102E]"  },
  recordatorio: { label: "Recordatorio", dot: "bg-amber-500"  },
  resultado:    { label: "Resultado",    dot: "bg-emerald-500" },
  convocatoria: { label: "Convocatoria", dot: "bg-[#15803D]"  },
};

const categoryGradient: Record<string, string> = {
  "Fútbol":        "from-[#15803D] to-[#22C55E]",
  "Básquet":       "from-[#1d4ed8] to-[#3b82f6]",
  "Hockey":        "from-[#0d9488] to-[#14b8a6]",
  "Institucional": "from-[#4A5568] to-[#718096]",
  "Cuotas":        "from-[#d97706] to-[#f59e0b]",
};

export default function InicioPage() {
  const proximoPartido  = mockPartidos[0];
  const noticiaDestacada = mockNoticias.find(n => n.pinned) ?? mockNoticias[0];
  const pendiente = mockCuotas.historial.find(c => c.estado === "pendiente");
  const cuotaAlDia = mockCuotas.status === "al-dia" && !pendiente;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Greeting */}
      <div className="pt-1">
        <p className="text-sm text-[#566070] font-medium">Hola de nuevo,</p>
        <h1 className="text-2xl font-black tracking-tight text-[#0D1117]">
          {mockUser.name.split(" ")[0]}{" "}
          <span role="img" aria-label="Saludos">👋</span>
        </h1>
      </div>

      {/* Match hero card */}
      <Card className="overflow-hidden border-0 shadow-[0_4px_20px_0_rgb(21_128_61/0.18)]">
        <div className="bg-gradient-to-br from-[#15803D] via-[#0F6B30] to-[#052E16] p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Próximo partido</span>
            <span className="text-[10px] bg-white/15 text-white/80 px-2 py-0.5 rounded-full font-medium">
              {proximoPartido.deporte} · {proximoPartido.categoria}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            {/* Local */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
                <Image src="/escudo.png" alt="DP" width={40} height={39} />
              </div>
              <span className="text-xs font-bold text-white text-center leading-tight">Dep. Patagones</span>
            </div>

            {/* VS */}
            <div className="flex flex-col items-center gap-1 px-3">
              <div className="bg-white/10 rounded-xl px-4 py-2">
                <span className="text-xl font-black text-white tracking-tight">VS</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/60">
                <Calendar className="w-3 h-3" aria-hidden="true" />
                <time
                  dateTime={`${proximoPartido.fecha}T${proximoPartido.hora}`}
                  className="text-[10px] font-medium"
                >
                  {formatShortDate(proximoPartido.fecha)} · {proximoPartido.hora}
                </time>
              </div>
            </div>

            {/* Visitante */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
                <span className="text-white font-black text-lg">
                  {proximoPartido.visitante.split(" ").map(w => w[0]).slice(0,2).join("")}
                </span>
              </div>
              <span className="text-xs font-bold text-white text-center leading-tight">{proximoPartido.visitante}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-4 text-white/60">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs">{proximoPartido.lugar}</span>
          </div>
        </div>
      </Card>

      {/* Cuota status strip */}
      <Link href="/cuotas">
        <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-opacity hover:opacity-90 ${
          cuotaAlDia
            ? "bg-emerald-50 border-emerald-100"
            : "bg-amber-50 border-amber-100"
        }`}>
          {cuotaAlDia
            ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            : <AlertCircle  className="w-5 h-5 text-amber-600 shrink-0" />
          }
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
            <span className="text-sm font-bold text-amber-700 shrink-0">{formatCurrency(pendiente.monto)}</span>
          )}
          <ChevronRight className="w-4 h-4 text-[#566070] shrink-0" />
        </div>
      </Link>

      {/* Quick actions */}
      <div>
        <h2 className="text-xs font-semibold text-[#566070] uppercase tracking-wider mb-3">Accesos rápidos</h2>
        <div className="grid grid-cols-3 gap-3">
          {quickLinks.map(({ href, label, icon: Icon, bg, color }) => (
            <Link key={href} href={href}>
              <div className="bg-white rounded-2xl border border-[#E8ECF4] shadow-[0_2px_8px_0_rgb(0_0_0/0.04)] p-3.5 flex flex-col items-center gap-2.5 hover:shadow-[0_4px_16px_0_rgb(21_128_61/0.12)] transition-shadow active:scale-95">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg}`}>
                  <Icon aria-hidden="true" className={`w-5 h-5 ${color}`} strokeWidth={1.8} />
                </div>
                <span className="text-xs font-semibold text-[#4A5568] text-center leading-tight">{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured news */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-[#566070] uppercase tracking-wider">Destacado</h2>
          <Link href="/noticias" className="text-xs text-[#15803D] font-semibold">Ver todo →</Link>
        </div>
        <Link href={`/noticias/${noticiaDestacada.id}`}>
          <Card className="overflow-hidden hover:shadow-[0_4px_16px_0_rgb(0_0_0/0.08)] transition-shadow">
            <div className={`h-28 bg-gradient-to-br ${categoryGradient[noticiaDestacada.category] ?? "from-[#15803D] to-[#22C55E]"} relative flex items-end p-4`}>
              <Badge className="bg-white/20 text-white border-0 text-[10px]">{noticiaDestacada.category}</Badge>
            </div>
            <CardContent className="py-3.5">
              <p className="font-bold text-sm leading-snug text-[#0D1117] line-clamp-2">{noticiaDestacada.title}</p>
              <p className="text-xs text-[#566070] mt-1 line-clamp-2">{noticiaDestacada.excerpt}</p>
              <time dateTime={noticiaDestacada.date} className="block text-[10px] text-[#566070] mt-2">
                {formatShortDate(noticiaDestacada.date)}
              </time>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* More news */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-[#566070] uppercase tracking-wider">Más noticias</h2>
        </div>
        <div className="space-y-2">
          {mockNoticias.filter(n => !n.pinned).slice(0, 3).map(noticia => (
            <Link key={noticia.id} href={`/noticias/${noticia.id}`}>
              <Card className="hover:shadow-[0_4px_12px_0_rgb(0_0_0/0.07)] transition-shadow">
                <CardContent className="py-3.5 flex items-center gap-3">
                  <div aria-hidden="true" className={`w-10 h-10 rounded-xl bg-gradient-to-br ${categoryGradient[noticia.category] ?? "from-[#15803D] to-[#22C55E]"} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Badge variant={categoryBadgeVariant(noticia.category)} className="text-[10px] px-1.5 py-0">{noticia.category}</Badge>
                      <time dateTime={noticia.date} className="text-[10px] text-[#566070]">{formatShortDate(noticia.date)}</time>
                    </div>
                    <p className="text-sm font-semibold text-[#0D1117] leading-snug line-clamp-1">{noticia.title}</p>
                  </div>
                  <ChevronRight aria-hidden="true" className="w-4 h-4 text-[#6B7A8D] shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Coach updates */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-[#566070] uppercase tracking-wider">Profes avisaron</h2>
          <Link href="/avisos" className="text-xs text-[#15803D] font-semibold">Ver todo →</Link>
        </div>
        <div className="space-y-2">
          {mockAvisos.slice(0, 3).map(aviso => {
            const profe = mockProfesores.find(p => p.id === aviso.profesorId);
            const cfg = tipoCfg[aviso.tipo];
            return (
              <Link key={aviso.id} href="/avisos">
                <Card className="hover:shadow-[0_4px_12px_0_rgb(0_0_0/0.07)] transition-shadow">
                  <CardContent className="py-3.5 flex items-start gap-3">
                    <Avatar className="w-9 h-9 shrink-0 ring-2 ring-[#E8ECF4]">
                      <AvatarFallback className="bg-[#15803D]/10 text-[#15803D] text-xs font-bold">
                        {profe?.initials ?? "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-bold text-[#0D1117]">{aviso.profesorName}</span>
                        <span className="text-[10px] text-[#566070]">· {aviso.deporte}</span>
                      </div>
                      <p className="text-sm font-semibold text-[#0D1117] line-clamp-1">{aviso.titulo}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
                        <span className="text-[10px] text-[#566070]">{cfg.label}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#6B7A8D] shrink-0 mt-0.5" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
