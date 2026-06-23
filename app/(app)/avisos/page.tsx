"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pin, ChevronDown, ChevronUp, Megaphone, Users, ChevronRight, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  mockAvisos, mockComunidades, mockUser,
  type ComunidadId, type AvisoTipo,
} from "@/lib/mock-data";

/* ── Helpers ───────────────────────────────────────────── */

const tipoCfg: Record<AvisoTipo, { label: string; bg: string; text: string }> = {
  general:      { label: "General",      bg: "bg-[#F4F6FA]",     text: "text-[#566070]"   },
  suspensión:   { label: "Suspendido",   bg: "bg-[#C8102E]/8",   text: "text-[#C8102E]"   },
  recordatorio: { label: "Recordatorio", bg: "bg-amber-50",      text: "text-amber-700"   },
  resultado:    { label: "Resultado",    bg: "bg-emerald-50",    text: "text-emerald-700" },
  convocatoria: { label: "Convocatoria", bg: "bg-[#15803D]/8",   text: "text-[#15803D]"   },
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

/* ── Aviso card ────────────────────────────────────────── */

function AvisoCard({ aviso }: { aviso: typeof mockAvisos[0] }) {
  const [expanded, setExpanded] = useState(false);
  const cfg     = tipoCfg[aviso.tipo];
  const comunidad = mockComunidades.find(c => c.id === aviso.comunidadId)!;
  const short   = aviso.contenido.length > 180;
  const texto   = !short || expanded ? aviso.contenido : aviso.contenido.slice(0, 180) + "…";

  return (
    <Card className={`overflow-hidden transition-shadow hover:shadow-[0_4px_16px_0_rgb(0_0_0/0.07)] ${aviso.fijado ? `border-[${comunidad.color}]/30` : ""}`}>
      {aviso.fijado && (
        <div className={`h-0.5 bg-gradient-to-r ${comunidad.gradient}`} />
      )}
      <CardContent className="py-4">
        <div className="flex items-start gap-3">
          <Avatar className={`w-10 h-10 shrink-0 ring-2 ring-[#E8ECF4] ${comunidad.colorBg}`}>
            <AvatarFallback className={`text-xs font-bold ${comunidad.colorText}`}>
              {aviso.profesorName.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-[#0D1117]">{aviso.profesorName}</span>
              {aviso.fijado && <Pin aria-hidden="true" className={`w-3 h-3 ${comunidad.colorText}`} />}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span className={`text-[10px] font-semibold ${comunidad.colorText}`}>{aviso.deporte}</span>
              <span aria-hidden="true" className="text-[10px] text-[#6B7A8D]">·</span>
              <span className="text-[10px] text-[#566070]">{aviso.categoria}</span>
              <span aria-hidden="true" className="text-[10px] text-[#6B7A8D]">·</span>
              <time dateTime={aviso.fecha} className="text-[10px] text-[#566070]">
                {formatRelative(aviso.fecha)}
              </time>
            </div>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${cfg.bg} ${cfg.text}`}>
            {cfg.label}
          </span>
        </div>

        <div className="mt-3">
          <p className="text-sm font-bold text-[#0D1117] mb-1.5">{aviso.titulo}</p>
          <p className="text-sm text-[#4A5568] leading-relaxed">{texto}</p>
          {short && (
            <button
              type="button"
              onClick={() => setExpanded(e => !e)}
              className={`flex items-center gap-1 text-xs font-semibold mt-2 hover:underline ${comunidad.colorText}`}
            >
              {expanded
                ? <><ChevronUp aria-hidden="true" className="w-3.5 h-3.5" /> Ver menos</>
                : <><ChevronDown aria-hidden="true" className="w-3.5 h-3.5" /> Ver más</>}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Community card (list view) ────────────────────────── */

function ComunidadCard({
  comunidad,
  esMiembro,
  onSelect,
}: {
  comunidad: typeof mockComunidades[0];
  esMiembro: boolean;
  onSelect: () => void;
}) {
  const avisos = mockAvisos.filter(a => a.comunidadId === comunidad.id);
  const reciente = avisos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];

  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full text-left bg-white rounded-2xl border border-[#E8ECF4] p-4 hover:shadow-[0_4px_16px_0_rgb(0_0_0/0.07)] transition-shadow active:scale-[0.99]"
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${comunidad.gradient} flex items-center justify-center shrink-0 shadow-sm`}>
          <span className="text-2xl" role="img" aria-label={comunidad.nombre}>{comunidad.emoji}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#0D1117]">{comunidad.nombre}</span>
            {esMiembro && (
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${comunidad.colorBg} ${comunidad.colorText}`}>
                Miembro
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Users aria-hidden="true" className="w-3 h-3 text-[#566070]" />
            <span className="text-[11px] text-[#566070]">{comunidad.miembros} miembros</span>
            {reciente && (
              <>
                <span aria-hidden="true" className="text-[#6B7A8D]">·</span>
                <span className="text-[11px] text-[#566070] truncate">
                  {formatRelative(reciente.fecha)}
                </span>
              </>
            )}
          </div>
          {reciente && (
            <p className="text-xs text-[#566070] mt-1 line-clamp-1 leading-snug">
              <span className="font-semibold text-[#0D1117]">{reciente.profesorName.split(" ")[0]}:</span>{" "}
              {reciente.titulo}
            </p>
          )}
        </div>

        <ChevronRight aria-hidden="true" className="w-4 h-4 text-[#6B7A8D] shrink-0" />
      </div>
    </button>
  );
}

/* ── Community feed view ───────────────────────────────── */

function ComunidadFeed({
  comunidadId,
  onBack,
}: {
  comunidadId: ComunidadId;
  onBack: () => void;
}) {
  const comunidad = mockComunidades.find(c => c.id === comunidadId)!;
  const esMiembro = mockUser.comunidades.includes(comunidadId);
  const avisos    = mockAvisos
    .filter(a => a.comunidadId === comunidadId)
    .sort((a, b) => {
      if (a.fijado !== b.fijado) return a.fijado ? -1 : 1;
      return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
    });

  return (
    <div className="animate-fade-in">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-[#566070] hover:text-[#0D1117] transition-colors mb-4"
        aria-label="Volver a comunidades"
      >
        <ArrowLeft aria-hidden="true" className="w-4 h-4" /> Comunidades
      </button>

      <div className={`bg-gradient-to-br ${comunidad.gradient} rounded-2xl p-5 mb-5 shadow-sm`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <span className="text-3xl" role="img" aria-label={comunidad.nombre}>{comunidad.emoji}</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">{comunidad.nombre}</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Users aria-hidden="true" className="w-3.5 h-3.5 text-white/70" />
              <span className="text-sm text-white/80">{comunidad.miembros} miembros</span>
            </div>
          </div>
          {esMiembro && (
            <span className="ml-auto text-[10px] font-bold bg-white/20 text-white px-2.5 py-1 rounded-full">
              Miembro ✓
            </span>
          )}
        </div>
        <p className="text-sm text-white/80 leading-relaxed">{comunidad.descripcion}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {comunidad.profes.map(p => (
            <span key={p} className="text-[10px] bg-white/15 text-white/90 px-2 py-0.5 rounded-full font-medium">
              {p}
            </span>
          ))}
        </div>
      </div>

      {avisos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-4xl mb-3" role="img" aria-label="Sin novedades">{comunidad.emoji}</span>
          <p className="text-sm font-bold text-[#0D1117]">Sin publicaciones todavía</p>
          <p className="text-xs text-[#566070] mt-1">Cuando haya novedades aparecerán acá.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {avisos.map(aviso => (
            <AvisoCard key={aviso.id} aviso={aviso} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── "Para vos" combined feed ─────────────────────────── */

function FeedParaVos() {
  const misAvisos = mockAvisos
    .filter(a => mockUser.comunidades.includes(a.comunidadId))
    .sort((a, b) => {
      if (a.fijado !== b.fijado) return a.fijado ? -1 : 1;
      return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
    });

  const misComunidades = mockComunidades.filter(c => mockUser.comunidades.includes(c.id));

  return (
    <div>
      {/* Sport filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-none">
        {misComunidades.map(c => (
          <span
            key={c.id}
            className={`shrink-0 flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full ${c.colorBg} ${c.colorText}`}
          >
            <span role="img" aria-label={c.nombre}>{c.emoji}</span>
            {c.nombre}
          </span>
        ))}
      </div>

      {misAvisos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Bell className="w-8 h-8 text-[#566070]/40 mb-3" />
          <p className="text-sm font-bold text-[#0D1117]">Sin novedades</p>
          <p className="text-xs text-[#566070] mt-1">Cuando tus profes publiquen algo, aparecerá acá.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {misAvisos.map(aviso => (
            <AvisoCard key={aviso.id} aviso={aviso} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────── */

type Tab = "para-vos" | "comunidades";

export default function AvisosPage() {
  const [tab, setTab] = useState<Tab>("para-vos");
  const [comunidadActiva, setComunidadActiva] = useState<ComunidadId | null>(null);

  if (comunidadActiva) {
    return (
      <ComunidadFeed
        comunidadId={comunidadActiva}
        onBack={() => setComunidadActiva(null)}
      />
    );
  }

  const misComunidades = mockComunidades.filter(c => mockUser.comunidades.includes(c.id));

  const misAvisosCount = mockAvisos.filter(a => mockUser.comunidades.includes(a.comunidadId)).length;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#0D1117]">Avisos</h1>
          <p className="text-sm text-[#566070] mt-0.5">Novedades de tus deportes</p>
        </div>
        <Link
          href="/mi-panel"
          className="flex items-center gap-1.5 bg-[#15803D] text-white text-xs font-bold px-3.5 h-8 rounded-full hover:bg-[#052E16] transition-colors shadow-sm shrink-0"
        >
          <Megaphone aria-hidden="true" className="w-3.5 h-3.5" /> Mi panel
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F0F3FA] rounded-xl p-1 mb-5">
        <button
          type="button"
          onClick={() => setTab("para-vos")}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg transition-all ${
            tab === "para-vos"
              ? "bg-white text-[#0D1117] shadow-sm"
              : "text-[#566070] hover:text-[#0D1117]"
          }`}
        >
          <Bell aria-hidden="true" className="w-3.5 h-3.5" />
          Para vos
          {misAvisosCount > 0 && (
            <span className="text-[9px] font-bold bg-[#15803D] text-white px-1.5 py-0.5 rounded-full">
              {misAvisosCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setTab("comunidades")}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg transition-all ${
            tab === "comunidades"
              ? "bg-white text-[#0D1117] shadow-sm"
              : "text-[#566070] hover:text-[#0D1117]"
          }`}
        >
          <Users aria-hidden="true" className="w-3.5 h-3.5" />
          Comunidades
        </button>
      </div>

      {/* Tab content */}
      {tab === "para-vos" ? (
        <FeedParaVos />
      ) : (
        <div>
          {/* Mis comunidades */}
          <section aria-labelledby="mis-comunidades-label">
            <h2 id="mis-comunidades-label" className="text-[10px] font-bold text-[#566070] uppercase tracking-widest mb-3">
              Mis comunidades
            </h2>
            <div className="space-y-3 mb-6">
              {misComunidades.map(c => (
                <ComunidadCard
                  key={c.id}
                  comunidad={c}
                  esMiembro={true}
                  onSelect={() => setComunidadActiva(c.id)}
                />
              ))}
            </div>
          </section>

        </div>
      )}
    </div>
  );
}
