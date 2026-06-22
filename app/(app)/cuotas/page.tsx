import type { Metadata } from "next";
import { CheckCircle2, Clock, AlertCircle, Download, CreditCard, TrendingUp, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/top-bar";
import { mockCuotas } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Cuotas" };

function EstadoBadge({ estado }: { estado: string }) {
  if (estado === "pagado") return (
    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
      <CheckCircle2 className="w-3.5 h-3.5" /> Pagado
    </span>
  );
  if (estado === "pendiente") return (
    <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600">
      <Clock className="w-3.5 h-3.5" /> Pendiente
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-[10px] font-semibold text-[#C8102E]">
      <AlertCircle className="w-3.5 h-3.5" /> Vencida
    </span>
  );
}

export default function CuotasPage() {
  const pendiente    = mockCuotas.historial.find(c => c.estado === "pendiente");
  const pagadas      = mockCuotas.historial.filter(c => c.estado === "pagado");
  const totalPagado  = pagadas.reduce((sum, c) => sum + c.monto, 0);

  return (
    <div className="animate-fade-in">
      <PageHeader title="Cuotas" subtitle="Tu estado de membresía" />

      {/* Main status card */}
      {pendiente ? (
        <Card className="mb-4 overflow-hidden border-0 shadow-[0_4px_20px_0_rgb(0_61_165/0.15)]">
          <div className="bg-gradient-to-br from-[#15803D] via-[#0F6B30] to-[#052E16] p-5">
            <p className="text-white/70 text-sm mb-1">Cuota pendiente</p>
            <p className="text-white text-4xl font-black tracking-tight mb-0.5">{formatCurrency(pendiente.monto)}</p>
            {"vencimiento" in pendiente && (
              <p className="text-white/60 text-sm">
                {pendiente.mes} · Vence {formatDate(pendiente.vencimiento, { day: "numeric", month: "long" })}
              </p>
            )}
          </div>
          <CardContent className="py-4">
            <Button className="w-full h-11 bg-[#15803D] hover:bg-[#052E16] text-white rounded-xl font-bold shadow-sm" size="lg">
              <CreditCard className="w-4 h-4" /> Pagar con Mercado Pago
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-4 overflow-hidden border-0 shadow-[0_4px_20px_0_rgb(22_163_74/0.15)]">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-white font-black text-lg leading-tight">¡Estás al día!</p>
              <p className="text-white/80 text-sm mt-0.5">
                Próximo vencimiento: {formatDate(mockCuotas.proxVencimiento, { day: "numeric", month: "long" })}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs font-medium text-[#8892A4]">Total pagado</p>
            </div>
            <p className="font-black text-xl text-[#0D1117]">{formatCurrency(totalPagado)}</p>
            <p className="text-xs text-[#8892A4] mt-0.5">{pagadas.length} cuotas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-xs font-medium text-[#8892A4]">Próx. vencimiento</p>
            </div>
            <p className="font-black text-xl text-[#0D1117]">{pendiente ? formatCurrency(pendiente.monto) : "—"}</p>
            <p className="text-xs text-[#8892A4] mt-0.5">{pendiente ? "Pendiente" : "Sin deudas"}</p>
          </CardContent>
        </Card>
      </div>

      {/* History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">Historial</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y divide-[#F0F3FA]">
            {mockCuotas.historial.map(cuota => (
              <div key={cuota.id} className="flex items-center justify-between py-3.5 gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    cuota.estado === "pagado" ? "bg-emerald-500" :
                    cuota.estado === "pendiente" ? "bg-amber-500" : "bg-[#C8102E]"
                  }`} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0D1117]">{cuota.mes}</p>
                    <EstadoBadge estado={cuota.estado} />
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <p className="text-sm font-bold text-[#0D1117]">{formatCurrency(cuota.monto)}</p>
                  {cuota.estado === "pagado" && "comprobante" in cuota && (
                    <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#F0F3FA] hover:bg-[#E8ECF4] transition-colors">
                      <Download className="w-3.5 h-3.5 text-[#8892A4]" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
