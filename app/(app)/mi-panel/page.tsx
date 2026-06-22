"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Pin, Trash2, ChevronDown, ChevronUp, Megaphone, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockAvisos, mockProfesores, type AvisoTipo } from "@/lib/mock-data";

// In a real app this comes from session/auth
const PROFE_SIMULADO = mockProfesores[2]; // Diego Paredes

const tipoOpciones: { value: AvisoTipo; label: string; emoji: string }[] = [
  { value: "general",      label: "General",      emoji: "📢" },
  { value: "convocatoria", label: "Convocatoria",  emoji: "📋" },
  { value: "suspensión",   label: "Suspensión",    emoji: "🚫" },
  { value: "recordatorio", label: "Recordatorio",  emoji: "⏰" },
  { value: "resultado",    label: "Resultado",     emoji: "🏆" },
];

const tipoCfg: Record<AvisoTipo, { color: string }> = {
  general:      { color: "bg-[#f1f3f7] text-[#6b7280]" },
  suspensión:   { color: "bg-[#C8102E]/10 text-[#C8102E]" },
  recordatorio: { color: "bg-amber-50 text-amber-700" },
  resultado:    { color: "bg-emerald-50 text-emerald-700" },
  convocatoria: { color: "bg-[#15803D]/10 text-[#15803D]" },
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
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [tipo, setTipo] = useState<AvisoTipo>("general");
  const [fijado, setFijado] = useState(false);
  const [publicado, setPublicado] = useState(false);
  const [formOpen, setFormOpen] = useState(true);

  const misAvisos = mockAvisos.filter(a => a.profesorId === PROFE_SIMULADO.id);

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
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Link href="/avisos">
          <button className="flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
        </Link>
      </div>

      {/* Profile bar */}
      <div className="flex items-center gap-3 mb-5 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
        <Avatar className="w-12 h-12">
          <AvatarFallback>{PROFE_SIMULADO.initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{PROFE_SIMULADO.name}</p>
          <p className="text-xs text-[var(--muted)]">
            {PROFE_SIMULADO.deporte} · {PROFE_SIMULADO.categorias.join(", ")}
          </p>
        </div>
        <span className="ml-auto text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-full font-medium">
          Profe activo
        </span>
      </div>

      {/* Compose form */}
      <Card className="mb-5 overflow-hidden">
        <button
          onClick={() => setFormOpen(o => !o)}
          className="w-full flex items-center justify-between p-4 hover:bg-[var(--surface-2)] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-vc-blue" />
            <span className="font-semibold text-sm">Nuevo aviso</span>
          </div>
          {formOpen ? <ChevronUp className="w-4 h-4 text-[var(--muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--muted)]" />}
        </button>

        {formOpen && (
          <div className="px-4 pb-4 space-y-3 border-t border-[var(--border)] pt-4">
            {/* Tipo */}
            <div>
              <p className="text-xs font-medium text-[var(--muted)] mb-2">Tipo de aviso</p>
              <div className="flex gap-2 flex-wrap">
                {tipoOpciones.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setTipo(opt.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                      tipo === opt.value
                        ? `${tipoCfg[opt.value].color} border-transparent`
                        : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)]"
                    }`}
                  >
                    <span>{opt.emoji}</span> {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Título */}
            <div>
              <input
                type="text"
                placeholder="Título del aviso…"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                maxLength={80}
                className="w-full h-10 px-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm font-medium placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-vc-blue focus:border-transparent transition-all"
              />
              <p className="text-[10px] text-[var(--muted)] text-right mt-1">{titulo.length}/80</p>
            </div>

            {/* Contenido */}
            <div>
              <textarea
                placeholder="Escribí el mensaje para tus alumnos…"
                value={contenido}
                onChange={e => setContenido(e.target.value)}
                rows={4}
                maxLength={600}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-vc-blue focus:border-transparent transition-all resize-none leading-relaxed"
              />
              <p className="text-[10px] text-[var(--muted)] text-right mt-1">{contenido.length}/600</p>
            </div>

            {/* Fijar */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div
                onClick={() => setFijado(f => !f)}
                className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${fijado ? "bg-vc-blue" : "bg-[var(--border)]"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${fijado ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
              <div>
                <p className="text-sm font-medium">Fijar aviso</p>
                <p className="text-[10px] text-[var(--muted)]">Aparece primero y destacado en el feed</p>
              </div>
              <Pin className={`w-4 h-4 ml-auto shrink-0 ${fijado ? "text-vc-blue" : "text-[var(--muted)]"}`} />
            </label>

            {/* Preview */}
            {(titulo || contenido) && (
              <div className="bg-[var(--surface-2)] rounded-xl p-3 border border-[var(--border)]">
                <p className="text-[10px] text-[var(--muted)] mb-2 font-medium uppercase tracking-wide">Vista previa</p>
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-[9px]">{PROFE_SIMULADO.initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-semibold">{PROFE_SIMULADO.name}</span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ml-auto ${tipoCfg[tipo].color}`}>
                    {tipoOpciones.find(o => o.value === tipo)?.label}
                  </span>
                </div>
                {titulo && <p className="text-xs font-semibold mb-1">{titulo}</p>}
                {contenido && <p className="text-xs text-[var(--fg-secondary)] leading-relaxed line-clamp-3">{contenido}</p>}
              </div>
            )}

            {/* Submit */}
            {publicado ? (
              <div className="flex items-center justify-center gap-2 h-11 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl text-sm font-semibold">
                ✓ ¡Publicado!
              </div>
            ) : (
              <button
                onClick={handlePublicar}
                disabled={!canPublish}
                className="w-full h-11 bg-vc-blue text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-vc-blue-hover transition-colors"
              >
                <Send className="w-4 h-4" /> Publicar aviso
              </button>
            )}
          </div>
        )}
      </Card>

      {/* Mis publicaciones */}
      <div>
        <p className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">
          Lo que publicaste ({misAvisos.length})
        </p>
        <div className="space-y-3">
          {misAvisos.map(aviso => (
            <Card key={aviso.id} className={aviso.fijado ? "border-vc-blue/30" : ""}>
              {aviso.fijado && <div className="h-0.5 bg-vc-blue rounded-t-[14px]" />}
              <CardContent className="py-3.5">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap flex-1">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tipoCfg[aviso.tipo].color}`}>
                      {tipoOpciones.find(o => o.value === aviso.tipo)?.label}
                    </span>
                    {aviso.fijado && <Pin className="w-3 h-3 text-vc-blue" />}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] text-[var(--muted)]">{formatRelative(aviso.fecha)}</span>
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-[var(--muted)] hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-sm font-semibold leading-snug">{aviso.titulo}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">{aviso.categoria}</p>
                <p className="text-xs text-[var(--fg-secondary)] mt-1.5 leading-relaxed line-clamp-2">{aviso.contenido}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
