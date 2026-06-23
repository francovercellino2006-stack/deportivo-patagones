"use client";
import { useState, useTransition } from "react";
import { CheckCircle2, Clock, AlertCircle, Plus, RotateCcw, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency, getInitials } from "@/lib/utils";
import { marcarPagado, marcarPendiente, crearCuota } from "./actions";
import type { Profile, Cuota } from "@/lib/supabase/types";

type SocioConCuota = Profile & { cuota: Cuota | null };

type Filtro = "todos" | "pendiente" | "pagado" | "vencida" | "sin-cuota";

const FILTROS: { id: Filtro; label: string }[] = [
  { id: "todos",     label: "Todos"      },
  { id: "pendiente", label: "Pendientes" },
  { id: "vencida",   label: "Vencidas"   },
  { id: "pagado",    label: "Pagados"    },
  { id: "sin-cuota", label: "Sin cuota"  },
];

function EstadoBadge({ estado }: { estado: string }) {
  if (estado === "pagado") return (
    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
      <CheckCircle2 className="w-3.5 h-3.5" /> Pagado
    </span>
  );
  if (estado === "vencida") return (
    <span className="flex items-center gap-1 text-[10px] font-semibold text-[#C8102E]">
      <AlertCircle className="w-3.5 h-3.5" /> Vencida
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600">
      <Clock className="w-3.5 h-3.5" /> Pendiente
    </span>
  );
}

function ActionButton({
  cuota, socioId, sports,
}: { cuota: Cuota | null; socioId: string; sports: string[] | null }) {
  const [isPending, startTransition] = useTransition();
  const [creando, setCreando] = useState(false);
  const [deporte, setDeporte] = useState(sports?.[0] ?? "Fútbol");
  const [monto, setMonto] = useState("8500");

  if (!cuota) {
    if (!creando) {
      return (
        <button
          type="button"
          onClick={() => setCreando(true)}
          className="flex items-center gap-1 text-[11px] font-semibold text-[#15803D] bg-[#15803D]/8 hover:bg-[#15803D]/15 px-2.5 py-1.5 rounded-full transition-colors shrink-0"
        >
          <Plus className="w-3 h-3" /> Agregar cuota
        </button>
      );
    }
    return (
      <div className="flex flex-col gap-2 items-end">
        <select
          value={deporte}
          onChange={e => setDeporte(e.target.value)}
          className="text-[11px] border border-[#E8ECF4] rounded-lg px-2 py-1 bg-white"
        >
          {(sports ?? ["Fútbol"]).map(s => <option key={s}>{s}</option>)}
        </select>
        <input
          type="number"
          value={monto}
          onChange={e => setMonto(e.target.value)}
          className="text-[11px] border border-[#E8ECF4] rounded-lg px-2 py-1 w-20 bg-white"
          placeholder="Monto"
        />
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setCreando(false)}
            className="text-[11px] px-2.5 py-1.5 rounded-full border border-[#E8ECF4] text-[#566070]"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => crearCuota(socioId, deporte, Number(monto)))}
            className="flex items-center gap-1 text-[11px] font-semibold text-white bg-[#15803D] px-2.5 py-1.5 rounded-full disabled:opacity-60"
          >
            {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
            Crear
          </button>
        </div>
      </div>
    );
  }

  if (cuota.estado === "pagado") {
    return (
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => marcarPendiente(cuota.id))}
        className="flex items-center gap-1 text-[11px] font-semibold text-[#566070] bg-[#F0F3FA] hover:bg-[#E8ECF4] px-2.5 py-1.5 rounded-full transition-colors disabled:opacity-60 shrink-0"
      >
        {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
        Revertir
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => marcarPagado(cuota.id))}
      className="flex items-center gap-1 text-[11px] font-semibold text-white bg-[#15803D] hover:bg-[#052E16] px-2.5 py-1.5 rounded-full transition-colors disabled:opacity-60 shrink-0"
    >
      {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
      Marcar pagado
    </button>
  );
}

export function CuotasAdminTable({
  socios,
  mesActual,
}: {
  socios: SocioConCuota[];
  mesActual: string;
}) {
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const filtrados = socios.filter(s => {
    if (filtro === "todos")     return true;
    if (filtro === "sin-cuota") return !s.cuota;
    return s.cuota?.estado === filtro;
  });

  const counts = {
    total:     socios.length,
    pagados:   socios.filter(s => s.cuota?.estado === "pagado").length,
    pendientes: socios.filter(s => s.cuota?.estado === "pendiente").length,
    vencidas:  socios.filter(s => s.cuota?.estado === "vencida").length,
    sinCuota:  socios.filter(s => !s.cuota).length,
  };

  const totalCobrado = socios
    .filter(s => s.cuota?.estado === "pagado")
    .reduce((sum, s) => sum + (s.cuota?.monto ?? 0), 0);

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card>
          <CardContent className="py-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#15803D]/8 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
            </div>
            <div>
              <p className="text-xl font-black text-[#0D1117]">{counts.pagados}</p>
              <p className="text-[11px] text-[#566070]">Pagaron · {mesActual}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xl font-black text-[#0D1117]">{counts.pendientes + counts.vencidas}</p>
              <p className="text-[11px] text-[#566070]">Sin pagar</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#15803D]/8 flex items-center justify-center shrink-0">
              <span className="text-sm font-black text-[#15803D]">$</span>
            </div>
            <div>
              <p className="text-lg font-black text-[#0D1117] leading-tight">
                {formatCurrency(totalCobrado)}
              </p>
              <p className="text-[11px] text-[#566070]">Cobrado</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C8102E]/8 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4 text-[#C8102E]" />
            </div>
            <div>
              <p className="text-xl font-black text-[#0D1117]">{counts.vencidas}</p>
              <p className="text-[11px] text-[#566070]">Vencidas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-none">
        {FILTROS.map(f => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFiltro(f.id)}
            className={`shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              filtro === f.id
                ? "bg-[#15803D] text-white border-[#15803D]"
                : "bg-white text-[#566070] border-[#E8ECF4] hover:bg-[#F0F3FA]"
            }`}
          >
            {f.label}
            {f.id === "pendiente" && counts.pendientes > 0 && (
              <span className="ml-1 bg-amber-500 text-white text-[9px] font-bold px-1 py-0.5 rounded-full">
                {counts.pendientes}
              </span>
            )}
            {f.id === "vencida" && counts.vencidas > 0 && (
              <span className="ml-1 bg-[#C8102E] text-white text-[9px] font-bold px-1 py-0.5 rounded-full">
                {counts.vencidas}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lista de socios */}
      {filtrados.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-[#566070]">
            No hay socios en esta categoría
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtrados.map(socio => (
            <Card key={socio.id} className={`border ${
              !socio.cuota                    ? "border-[#E8ECF4]" :
              socio.cuota.estado === "pagado" ? "border-emerald-100" :
              socio.cuota.estado === "vencida"? "border-red-100"    :
                                               "border-amber-100"
            }`}>
              <CardContent className="py-3.5 flex items-center gap-3">
                {/* Avatar */}
                <Avatar className="w-10 h-10 shrink-0">
                  <AvatarFallback className="bg-[#15803D]/10 text-[#15803D] text-xs font-bold">
                    {getInitials(socio.name)}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-sm font-bold text-[#0D1117] leading-tight">{socio.name}</p>
                    {socio.socio_number && (
                      <span className="text-[10px] text-[#566070]">#{socio.socio_number}</span>
                    )}
                  </div>
                  {socio.cuota ? (
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {socio.cuota.deporte && (
                        <span className="text-[10px] font-semibold text-[#15803D] bg-[#15803D]/8 px-1.5 py-0.5 rounded-full">
                          {socio.cuota.deporte}
                        </span>
                      )}
                      <EstadoBadge estado={socio.cuota.estado} />
                      <span className="text-[10px] text-[#566070]">
                        {formatCurrency(socio.cuota.monto)}
                      </span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#566070] mt-0.5">Sin cuota este mes</p>
                  )}
                  {socio.cuota?.pagado_at && (
                    <p className="text-[10px] text-[#566070] mt-0.5">
                      Pagó el {new Date(socio.cuota.pagado_at).toLocaleDateString("es-AR", {
                        day: "numeric", month: "short",
                      })}
                    </p>
                  )}
                </div>

                {/* Action */}
                <ActionButton
                  cuota={socio.cuota}
                  socioId={socio.id}
                  sports={socio.sports}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
