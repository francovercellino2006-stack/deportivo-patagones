"use client";
import { useState, useTransition } from "react";
import { Search, Check, X, Loader2, ChevronDown, ChevronUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { actualizarDeportes } from "./actions";
import type { Profile } from "@/lib/supabase/types";

const DEPORTES_DISPONIBLES = [
  { nombre: "Fútbol",   emoji: "⚽", color: "#15803D" },
  { nombre: "Básquet",  emoji: "🏀", color: "#1d4ed8" },
  { nombre: "Hockey",   emoji: "🏑", color: "#0d9488" },
  { nombre: "Patín",    emoji: "⛸️", color: "#7c3aed" },
  { nombre: "Gimnasia", emoji: "🤸", color: "#db2777" },
];

function SportBadge({ nombre, small }: { nombre: string; small?: boolean }) {
  const deporte = DEPORTES_DISPONIBLES.find(d => d.nombre === nombre);
  if (!deporte) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full ${
        small ? "text-[10px] px-1.5 py-0.5" : "text-[11px] px-2 py-1"
      }`}
      style={{ background: `${deporte.color}14`, color: deporte.color }}
    >
      <span role="img" aria-label={nombre}>{deporte.emoji}</span>
      {nombre}
    </span>
  );
}

function SocioEditor({
  socio,
  onClose,
}: {
  socio: Profile;
  onClose: () => void;
}) {
  const current = socio.sports ?? [];
  const [selected, setSelected] = useState<string[]>(current);
  const [isPending, startTransition] = useTransition();

  const changed = JSON.stringify(selected.sort()) !== JSON.stringify([...current].sort());

  function toggle(deporte: string) {
    setSelected(prev =>
      prev.includes(deporte)
        ? prev.filter(d => d !== deporte)
        : [...prev, deporte]
    );
  }

  function guardar() {
    startTransition(async () => {
      await actualizarDeportes(socio.id, selected);
      onClose();
    });
  }

  return (
    <div className="mt-3 pt-3 border-t border-[#E8ECF4]">
      <p className="text-[10px] font-bold text-[#566070] uppercase tracking-wider mb-2.5">
        Deportes de {socio.name.split(" ")[0]}
      </p>
      <div className="space-y-2">
        {DEPORTES_DISPONIBLES.map(deporte => {
          const activo = selected.includes(deporte.nombre);
          return (
            <button
              key={deporte.nombre}
              type="button"
              onClick={() => toggle(deporte.nombre)}
              disabled={isPending}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all active:scale-[0.98] ${
                activo
                  ? "border-current bg-current/5"
                  : "border-[#E8ECF4] bg-white hover:bg-[#F8FAFB]"
              }`}
              style={activo ? { borderColor: deporte.color, background: `${deporte.color}08` } : undefined}
            >
              <span className="text-xl" role="img" aria-label={deporte.nombre}>
                {deporte.emoji}
              </span>
              <span className="flex-1 text-left text-sm font-semibold text-[#0D1117]">
                {deporte.nombre}
              </span>
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                  activo ? "text-white" : "border-2 border-[#E8ECF4]"
                }`}
                style={activo ? { background: deporte.color } : undefined}
              >
                {activo && <Check className="w-3.5 h-3.5" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="flex-1 h-10 rounded-xl border border-[#E8ECF4] text-sm font-semibold text-[#566070] hover:bg-[#F0F3FA] transition-colors"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={guardar}
          disabled={!changed || isPending}
          className="flex-1 h-10 rounded-xl bg-[#15803D] text-white text-sm font-bold hover:bg-[#052E16] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
        >
          {isPending ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando...</>
          ) : (
            "Guardar cambios"
          )}
        </button>
      </div>
    </div>
  );
}

function SocioRow({ socio }: { socio: Profile }) {
  const [editing, setEditing] = useState(false);
  const sports = socio.sports ?? [];

  return (
    <Card className={editing ? "border-[#15803D]/30 shadow-[0_4px_16px_0_rgb(21_128_61/0.08)]" : ""}>
      <CardContent className="py-3.5">
        <button
          type="button"
          onClick={() => setEditing(e => !e)}
          className="w-full flex items-center gap-3 text-left"
        >
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarFallback className="bg-[#15803D]/10 text-[#15803D] text-xs font-bold">
              {getInitials(socio.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-[#0D1117]">{socio.name}</p>
              {socio.socio_number && (
                <span className="text-[10px] text-[#566070]">#{socio.socio_number}</span>
              )}
            </div>
            {sports.length > 0 ? (
              <div className="flex flex-wrap gap-1 mt-1">
                {sports.map(s => <SportBadge key={s} nombre={s} small />)}
              </div>
            ) : (
              <p className="text-[11px] text-[#566070] mt-0.5 italic">Sin deportes asignados</p>
            )}
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#15803D] bg-[#15803D]/8 px-2 py-1 rounded-full">
              {sports.length === 0 ? "Asignar" : "Editar"}
            </span>
            {editing
              ? <ChevronUp className="w-4 h-4 text-[#566070]" />
              : <ChevronDown className="w-4 h-4 text-[#566070]" />
            }
          </div>
        </button>

        {editing && (
          <SocioEditor socio={socio} onClose={() => setEditing(false)} />
        )}
      </CardContent>
    </Card>
  );
}

type Filtro = "todos" | string;

export function InscripcionesPanel({ socios }: { socios: Profile[] }) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroDeporte, setFiltroDeporte] = useState<Filtro>("todos");

  const filtrados = socios.filter(s => {
    const matchBusqueda = !busqueda ||
      s.name.toLowerCase().includes(busqueda.toLowerCase()) ||
      (s.socio_number ?? "").includes(busqueda);
    const matchDeporte = filtroDeporte === "todos" ||
      (s.sports ?? []).includes(filtroDeporte);
    return matchBusqueda && matchDeporte;
  });

  const conteos = DEPORTES_DISPONIBLES.map(d => ({
    ...d,
    total: socios.filter(s => (s.sports ?? []).includes(d.nombre)).length,
  }));

  const sinDeporte = socios.filter(s => !s.sports || s.sports.length === 0).length;

  return (
    <div>
      {/* Stats — vista rápida por deporte */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-none">
        {conteos.map(d => (
          <button
            key={d.nombre}
            type="button"
            onClick={() => setFiltroDeporte(f => f === d.nombre ? "todos" : d.nombre)}
            className={`shrink-0 flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all ${
              filtroDeporte === d.nombre
                ? "border-current shadow-sm"
                : "border-[#E8ECF4] bg-white hover:bg-[#F8FAFB]"
            }`}
            style={filtroDeporte === d.nombre ? { borderColor: d.color, background: `${d.color}08` } : undefined}
          >
            <span className="text-lg">{d.emoji}</span>
            <div className="text-left">
              <p className="text-xs font-bold text-[#0D1117] leading-tight">{d.nombre}</p>
              <p className="text-[10px] text-[#566070]">{d.total} inscriptos</p>
            </div>
          </button>
        ))}
      </div>

      {/* Barra de búsqueda */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#566070]" aria-hidden="true" />
        <input
          type="search"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o Nº de socio..."
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E8ECF4] bg-white text-sm text-[#0D1117] placeholder:text-[#566070] focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:border-transparent"
        />
      </div>

      {/* Resumen de filtro activo */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold text-[#566070] uppercase tracking-wider">
          {filtroDeporte === "todos"
            ? `Todos los socios (${filtrados.length})`
            : `${filtroDeporte} (${filtrados.length} inscriptos)`}
        </p>
        {sinDeporte > 0 && filtroDeporte === "todos" && (
          <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            {sinDeporte} sin deporte
          </span>
        )}
      </div>

      {/* Lista de socios */}
      {filtrados.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <Users className="w-8 h-8 text-[#566070]/30 mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#0D1117]">
              {busqueda ? "Sin resultados" : "No hay socios registrados"}
            </p>
            <p className="text-xs text-[#566070] mt-1">
              {busqueda ? "Probá con otro nombre o número" : "Creá usuarios desde Supabase"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtrados.map(socio => (
            <SocioRow key={socio.id} socio={socio} />
          ))}
        </div>
      )}
    </div>
  );
}
