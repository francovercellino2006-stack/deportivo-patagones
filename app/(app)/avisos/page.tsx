"use client";
import { useState } from "react";
import Link from "next/link";
import { Pin, ChevronDown, ChevronUp, Megaphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/layout/top-bar";
import { mockAvisos, mockProfesores, type AvisoTipo } from "@/lib/mock-data";

const deportes = ["Todos", "Fútbol", "Básquet", "Hockey", "Patín", "Gimnasia"];

const tipoCfg: Record<AvisoTipo, { label: string; bg: string; text: string; dot: string }> = {
  general:      { label: "General",      bg: "bg-[#F4F6FA]",          text: "text-[#6b7280]",   dot: "bg-[#566070]"   },
  suspensión:   { label: "Suspendido",   bg: "bg-[#C8102E]/8",        text: "text-[#C8102E]",   dot: "bg-[#C8102E]"   },
  recordatorio: { label: "Recordatorio", bg: "bg-amber-50",            text: "text-amber-700",   dot: "bg-amber-500"   },
  resultado:    { label: "Resultado",    bg: "bg-emerald-50",          text: "text-emerald-700", dot: "bg-emerald-500" },
  convocatoria: { label: "Convocatoria", bg: "bg-[#15803D]/8",         text: "text-[#15803D]",   dot: "bg-[#15803D]"   },
};

const avatarColor: Record<string, string> = {
  "Fútbol":   "bg-[#15803D]/10 text-[#15803D]",
  "Básquet":  "bg-[#1d4ed8]/10 text-[#1d4ed8]",
  "Hockey":   "bg-[#0d9488]/10 text-[#0d9488]",
  "Patín":    "bg-[#7c3aed]/10 text-[#7c3aed]",
  "Gimnasia": "bg-[#059669]/10 text-[#059669]",
};

function formatRelative(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "ayer";
  return `hace ${days} días`;
}

function AvisoCard({ aviso }: { aviso: typeof mockAvisos[0] }) {
  const [expanded, setExpanded] = useState(false);
  const cfg   = tipoCfg[aviso.tipo];
  const profe = mockProfesores.find(p => p.id === aviso.profesorId);
  const short = aviso.contenido.length > 160;
  const texto = !short || expanded ? aviso.contenido : aviso.contenido.slice(0, 160) + "…";
  const av    = avatarColor[aviso.deporte] ?? "bg-[#15803D]/10 text-[#15803D]";

  return (
    <Card className={`overflow-hidden transition-shadow hover:shadow-[0_4px_16px_0_rgb(0_0_0/0.08)] ${aviso.fijado ? "border-[#15803D]/30" : ""}`}>
      {aviso.fijado && (
        <div className="h-1 bg-gradient-to-r from-[#15803D] to-[#22C55E]" />
      )}
      <CardContent className="py-4">

        {/* Author row */}
        <div className="flex items-start gap-3">
          <Avatar className={`w-10 h-10 shrink-0 ring-2 ring-[#E8ECF4] ${av}`}>
            <AvatarFallback className={`text-xs font-bold ${av}`}>
              {profe?.initials ?? "??"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-[#0D1117]">{aviso.profesorName}</span>
              {aviso.fijado && <Pin className="w-3 h-3 text-[#15803D]" />}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span className="text-[10px] font-semibold text-[#566070]">{aviso.deporte}</span>
              <span className="text-[10px] text-[#6B7A8D]">·</span>
              <span className="text-[10px] text-[#566070]">{aviso.categoria}</span>
              <span className="text-[10px] text-[#6B7A8D]">·</span>
              <span className="text-[10px] text-[#566070]">{formatRelative(aviso.fecha)}</span>
            </div>
          </div>

          {/* Tipo badge */}
          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${cfg.bg} ${cfg.text}`}>
            {cfg.label}
          </span>
        </div>

        {/* Content */}
        <div className="mt-3">
          <p className="text-sm font-bold text-[#0D1117] mb-1.5">{aviso.titulo}</p>
          <p className="text-sm text-[#4A5568] leading-relaxed">{texto}</p>
          {short && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-1 text-xs text-[#15803D] font-semibold mt-2 hover:underline"
            >
              {expanded
                ? <><ChevronUp className="w-3.5 h-3.5" /> Ver menos</>
                : <><ChevronDown className="w-3.5 h-3.5" /> Ver más</>
              }
            </button>
          )}
        </div>

      </CardContent>
    </Card>
  );
}

export default function AvisosPage() {
  const [filtro, setFiltro] = useState("Todos");

  const filtrados = mockAvisos
    .filter(a => filtro === "Todos" || a.deporte === filtro)
    .sort((a, b) => {
      if (a.fijado !== b.fijado) return a.fijado ? -1 : 1;
      return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
    });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Avisos"
        subtitle="Novedades de tus profes"
        action={
          <Link
            href="/mi-panel"
            className="flex items-center gap-1.5 bg-[#15803D] text-white text-xs font-bold px-3.5 h-8 rounded-full hover:bg-[#052E16] transition-colors shadow-sm"
          >
            <Megaphone className="w-3.5 h-3.5" /> Mi panel
          </Link>
        }
      />

      {/* Sport filters */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-5 -mx-4 px-4 scrollbar-none">
        {deportes.map(d => (
          <button
            key={d}
            onClick={() => setFiltro(d)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filtro === d
                ? "bg-[#15803D] text-white shadow-sm"
                : "bg-white border border-[#E8ECF4] text-[#566070] hover:text-[#0D1117]"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Feed */}
      {filtrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#F0F3FA] flex items-center justify-center mb-4">
            <Megaphone className="w-7 h-7 text-[#566070]" />
          </div>
          <p className="text-sm font-bold text-[#0D1117]">Sin avisos por acá</p>
          <p className="text-xs text-[#566070] mt-1 max-w-[200px]">
            Cuando los profes publiquen algo, va a aparecer acá.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtrados.map(aviso => <AvisoCard key={aviso.id} aviso={aviso} />)}
        </div>
      )}
    </div>
  );
}
