"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Pin, Trash2, ChevronDown, ChevronUp, Plus, Users, LogIn } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockAvisos, mockProfesores, mockComunidades, type AvisoTipo, type ComunidadId } from "@/lib/mock-data";
import { useAuth } from "@/components/providers/auth-provider";

const deporteAComunidad: Record<string, ComunidadId> = {
  "Fútbol":   "futbol",
  "Básquet":  "basquet",
  "Hockey":   "hockey",
  "Patín":    "patin",
  "Gimnasia": "gimnasia",
};

const tipoOpciones: { value: AvisoTipo; label: string; emoji: string }[] = [
  { value: "general",      label: "General",      emoji: "📢" },
  { value: "convocatoria", label: "Convocatoria",  emoji: "📋" },
  { value: "suspensión",   label: "Suspensión",    emoji: "🚫" },
  { value: "recordatorio", label: "Recordatorio",  emoji: "⏰" },
  { value: "resultado",    label: "Resultado",     emoji: "🏆" },
];

const tipoCfg: Record<AvisoTipo, { bg: string; text: string }> = {
  general:      { bg: "bg-[#F4F6FA]",     text: "text-[#566070]"   },
  suspensión:   { bg: "bg-[#C8102E]/10",  text: "text-[#C8102E]"   },
  recordatorio: { bg: "bg-amber-50",      text: "text-amber-700"   },
  resultado:    { bg: "bg-emerald-50",    text: "text-emerald-700" },
  convocatoria: { bg: "bg-[#15803D]/10",  text: "text-[#15803D]"   },
};

function formatRelative(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? "ayer" : `hace ${days} días`;
}

export default function MiPanelPage() {
  const { session, ready } = useAuth();
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [tipo, setTipo] = useState<AvisoTipo>("general");
  const [fijado, setFijado] = useState(false);
  const [publicado, setPublicado] = useState(false);
  const [formOpen, setFormOpen] = useState(true);

  const profe      = ready && session?.role === "profe"
    ? mockProfesores.find(p => p.id === session.profesorId) ?? mockProfesores[2]
    : null;

  const comunidadId = profe ? (deporteAComunidad[profe.deporte] ?? "futbol") : "futbol";
  const comunidad   = mockComunidades.find(c => c.id === comunidadId)!;
  const misAvisos   = profe ? mockAvisos.filter(a => a.profesorId === profe.id) : [];

  // Pantalla de acceso denegado
  if (ready && session?.role !== "profe") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-[#15803D]/10 flex items-center justify-center mb-4">
          <LogIn aria-hidden="true" className="w-8 h-8 text-[#15803D]" />
        </div>
        <h1 className="text-lg font-black text-[#0D1117] mb-1">Acceso exclusivo para profes</h1>
        <p className="text-sm text-[#566070] mb-6 max-w-xs">
          Para publicar avisos en una comunidad tenés que ingresar como profe del club.
        </p>
        <Link
          href="/login"
          className="h-11 px-6 bg-[#15803D] text-white rounded-2xl text-sm font-bold hover:bg-[#052E16] transition-colors flex items-center gap-2"
        >
          <LogIn aria-hidden="true" className="w-4 h-4" /> Ir al inicio de sesión
        </Link>
      </div>
    );
  }

  if (!profe) return null; // esperando hidratación

  function handlePublicar() {
    if (!titulo.trim() || !contenido.trim()) return;
    setPublicado(true);
    setTitulo("");
    setContenido("");
    setTipo("general");
    setFijado(false);
    setTimeout(() => setPublicado(false), 3000);
  }

  const canPublish = titulo.trim().length > 0 && contenido.trim().length > 0;

  return (
    <div>
      {/* Back */}
      <div className="flex items-center gap-2 mb-5">
        <Link
          href="/avisos"
          className="flex items-center gap-1.5 text-sm text-[#566070] hover:text-[#0D1117] transition-colors"
          aria-label="Volver a comunidades"
        >
          <ArrowLeft aria-hidden="true" className="w-4 h-4" /> Comunidades
        </Link>
      </div>

      {/* Community banner */}
      <div className={`bg-gradient-to-br ${comunidad.gradient} rounded-2xl p-4 mb-4 shadow-sm`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <span className="text-2xl" role="img" aria-label={comunidad.nombre}>{comunidad.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Publicás en</p>
            <p className="text-lg font-black text-white leading-tight">{comunidad.nombre}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Users aria-hidden="true" className="w-3 h-3 text-white/60" />
              <span className="text-xs text-white/70">{comunidad.miembros} miembros lo recibirán</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile bar */}
      <div className="flex items-center gap-3 mb-4 p-4 bg-white border border-[#E8ECF4] rounded-2xl">
        <Avatar className={`w-11 h-11 ring-2 ring-[#E8ECF4] ${comunidad.colorBg}`}>
          <AvatarFallback className={`text-sm font-bold ${comunidad.colorText}`}>{profe.initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#0D1117]">{profe.name}</p>
          <p className="text-xs text-[#566070]">{profe.categorias.join(" · ")}</p>
        </div>
        <span className="text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">
          Profe activo
        </span>
      </div>

      {/* Compose form */}
      <Card className="mb-5 overflow-hidden border-[#E8ECF4]">
        <button
          type="button"
          onClick={() => setFormOpen(o => !o)}
          className="w-full flex items-center justify-between p-4 hover:bg-[#F8FAFB] transition-colors"
          aria-expanded={formOpen}
        >
          <div className="flex items-center gap-2">
            <Plus aria-hidden="true" className={`w-4 h-4 ${comunidad.colorText}`} />
            <span className="font-semibold text-sm text-[#0D1117]">Nuevo aviso</span>
          </div>
          {formOpen
            ? <ChevronUp aria-hidden="true" className="w-4 h-4 text-[#566070]" />
            : <ChevronDown aria-hidden="true" className="w-4 h-4 text-[#566070]" />}
        </button>

        {formOpen && (
          <div className="px-4 pb-4 space-y-3 border-t border-[#E8ECF4] pt-4">

            {/* Tipo */}
            <div>
              <p className="text-xs font-semibold text-[#566070] mb-2">Tipo de aviso</p>
              <div className="flex gap-2 flex-wrap" role="group" aria-label="Tipo de aviso">
                {tipoOpciones.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTipo(opt.value)}
                    aria-pressed={tipo === opt.value}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                      tipo === opt.value
                        ? `${tipoCfg[opt.value].bg} ${tipoCfg[opt.value].text} border-transparent`
                        : "border-[#E8ECF4] text-[#566070] hover:text-[#0D1117] hover:border-[#C4CBD8]"
                    }`}
                  >
                    <span aria-hidden="true">{opt.emoji}</span> {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Título */}
            <div>
              <label htmlFor="aviso-titulo" className="text-xs font-semibold text-[#566070] mb-1.5 block">
                Título <span aria-hidden="true" className="text-[#C8102E]">*</span>
              </label>
              <input
                id="aviso-titulo"
                type="text"
                placeholder="Ej: Entrenamiento suspendido el martes…"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                maxLength={80}
                aria-required="true"
                className="w-full h-10 px-3 rounded-xl border border-[#E8ECF4] bg-white text-sm font-medium text-[#0D1117] placeholder:text-[#9AA3AF] focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all"
                style={{ "--tw-ring-color": comunidad.color } as React.CSSProperties}
              />
              <p className="text-[10px] text-[#566070] text-right mt-1">{titulo.length}/80</p>
            </div>

            {/* Contenido */}
            <div>
              <label htmlFor="aviso-contenido" className="text-xs font-semibold text-[#566070] mb-1.5 block">
                Mensaje <span aria-hidden="true" className="text-[#C8102E]">*</span>
              </label>
              <textarea
                id="aviso-contenido"
                placeholder={`Escribí las novedades para la comunidad de ${comunidad.nombre}…`}
                value={contenido}
                onChange={e => setContenido(e.target.value)}
                rows={4}
                maxLength={600}
                aria-required="true"
                className="w-full px-3 py-2.5 rounded-xl border border-[#E8ECF4] bg-white text-sm text-[#0D1117] placeholder:text-[#9AA3AF] focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all resize-none leading-relaxed"
              />
              <p className="text-[10px] text-[#566070] text-right mt-1">{contenido.length}/600</p>
            </div>

            {/* Fijar */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div
                role="switch"
                aria-checked={fijado}
                tabIndex={0}
                onClick={() => setFijado(f => !f)}
                onKeyDown={e => e.key === " " && setFijado(f => !f)}
                className={`w-10 h-5 rounded-full transition-colors relative shrink-0 cursor-pointer`}
                style={{ background: fijado ? comunidad.color : "#D1D5DB" }}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${fijado ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0D1117]">Fijar aviso</p>
                <p className="text-[10px] text-[#566070]">Aparece primero y destacado en el feed</p>
              </div>
              <Pin aria-hidden="true" className={`w-4 h-4 ml-auto shrink-0 ${fijado ? comunidad.colorText : "text-[#C4CBD8]"}`} />
            </label>

            {/* Preview */}
            {(titulo || contenido) && (
              <div className="bg-[#F8FAFB] rounded-xl p-3 border border-[#E8ECF4]">
                <p className="text-[10px] text-[#566070] mb-2 font-bold uppercase tracking-wider">Vista previa</p>
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className={`w-7 h-7 ${comunidad.colorBg}`}>
                    <AvatarFallback className={`text-[10px] font-bold ${comunidad.colorText}`}>{profe.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-[#0D1117]">{profe.name}</span>
                    <span className={`text-[10px] font-semibold ml-1.5 ${comunidad.colorText}`}>{comunidad.nombre}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${tipoCfg[tipo].bg} ${tipoCfg[tipo].text}`}>
                    {tipoOpciones.find(o => o.value === tipo)?.label}
                  </span>
                </div>
                {titulo    && <p className="text-xs font-bold text-[#0D1117] mb-1">{titulo}</p>}
                {contenido && <p className="text-xs text-[#4A5568] leading-relaxed line-clamp-3">{contenido}</p>}
              </div>
            )}

            {/* Submit */}
            {publicado ? (
              <div className="flex items-center justify-center gap-2 h-11 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-semibold" role="status">
                ✓ ¡Publicado en {comunidad.nombre}!
              </div>
            ) : (
              <button
                type="button"
                onClick={handlePublicar}
                disabled={!canPublish}
                className="w-full h-11 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                style={{ background: canPublish ? comunidad.color : undefined }}
              >
                <Send aria-hidden="true" className="w-4 h-4" />
                Publicar en {comunidad.nombre} {comunidad.emoji}
              </button>
            )}
          </div>
        )}
      </Card>

      {/* Mis publicaciones */}
      <div>
        <p className="text-[10px] font-bold text-[#566070] uppercase tracking-widest mb-3">
          Mis publicaciones ({misAvisos.length})
        </p>
        <div className="space-y-3">
          {misAvisos.map(aviso => {
            const cfg = tipoCfg[aviso.tipo];
            return (
              <Card key={aviso.id} className={`overflow-hidden border-[#E8ECF4] ${aviso.fijado ? `border-l-4` : ""}`}
                style={aviso.fijado ? { borderLeftColor: comunidad.color } : undefined}
              >
                <CardContent className="py-3.5">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap flex-1">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                        {tipoOpciones.find(o => o.value === aviso.tipo)?.label}
                      </span>
                      {aviso.fijado && <Pin aria-hidden="true" className={`w-3 h-3 ${comunidad.colorText}`} />}
                      <span className={`text-[10px] font-semibold ${comunidad.colorText}`}>{aviso.deporte}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <time dateTime={aviso.fecha} className="text-[10px] text-[#566070]">{formatRelative(aviso.fecha)}</time>
                      <button
                        type="button"
                        aria-label={`Eliminar aviso: ${aviso.titulo}`}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#C4CBD8] hover:text-[#C8102E] transition-colors"
                      >
                        <Trash2 aria-hidden="true" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-[#0D1117] leading-snug">{aviso.titulo}</p>
                  <p className="text-xs text-[#566070] mt-0.5">{aviso.categoria}</p>
                  <p className="text-xs text-[#4A5568] mt-1.5 leading-relaxed line-clamp-2">{aviso.contenido}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
