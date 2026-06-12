import type { Metadata } from "next";
import { CheckCircle2, Clock, AlertCircle, Download, CreditCard, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/top-bar";
import { mockCuotas } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Cuotas" };

function EstadoBadge({ estado }: { estado: string }) {
  if (estado === "pagado") return (
    <span className="flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400">
      <CheckCircle2 className="w-3.5 h-3.5" /> Pagado
    </span>
  );
  if (estado === "pendiente") return (
    <span className="flex items-center gap-1 text-xs font-medium text-yellow-700 dark:text-yellow-400">
      <Clock className="w-3.5 h-3.5" /> Pendiente
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-xs font-medium text-red-700 dark:text-red-400">
      <AlertCircle className="w-3.5 h-3.5" /> Vencida
    </span>
  );
}

export default function CuotasPage() {
  const pendiente = mockCuotas.historial.find(c => c.estado === "pendiente");
  const pagadas = mockCuotas.historial.filter(c => c.estado === "pagado");
  const totalPagado = pagadas.reduce((sum, c) => sum + c.monto, 0);

  return (
    <div>
      <PageHeader title="Cuotas" subtitle="¿Cómo venís con la cuota?" />

      {/* Estado actual */}
      {pendiente ? (
        <Card className="bg-gradient-to-r from-vc-blue to-vc-blue/80 border-0 mb-4">
          <CardContent className="py-5">
            <p className="text-white/70 text-sm mb-1">Tenés una cuota pendiente</p>
            <p className="text-white text-3xl font-bold mb-0.5">{formatCurrency(pendiente.monto)}</p>
            {"vencimiento" in pendiente && (
              <p className="text-white/70 text-sm">{pendiente.mes} · Vence {formatDate(pendiente.vencimiento, { day: "numeric", month: "long" })}</p>
            )}
            <Button className="mt-4 bg-white text-vc-blue hover:bg-white/90 w-full" size="lg">
              <CreditCard className="w-4 h-4" /> Pagar con Mercado Pago
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-r from-green-500 to-green-600 border-0 mb-4">
          <CardContent className="py-5 flex items-center gap-4">
            <CheckCircle2 className="w-10 h-10 text-white/80 shrink-0" />
            <div>
              <p className="text-white font-bold text-lg">¡Estás al día!</p>
              <p className="text-white/80 text-sm">Próximo vencimiento: {formatDate(mockCuotas.proxVencimiento, { day: "numeric", month: "long" })}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumen */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <p className="text-xs text-[var(--muted)]">Total pagado</p>
            </div>
            <p className="font-bold text-lg">{formatCurrency(totalPagado)}</p>
            <p className="text-xs text-[var(--muted)]">{pagadas.length} cuotas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-yellow-600" />
              <p className="text-xs text-[var(--muted)]">Próximo vencimiento</p>
            </div>
            <p className="font-bold text-lg">{pendiente ? formatCurrency(pendiente.monto) : "—"}</p>
            <p className="text-xs text-[var(--muted)]">{pendiente ? "Pendiente" : "Sin deudas"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Historial */}
      <Card>
        <CardHeader>
          <CardTitle>Lo que pagaste</CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="space-y-0 divide-y divide-[var(--border)]">
            {mockCuotas.historial.map(cuota => (
              <div key={cuota.id} className="flex items-center justify-between py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{cuota.mes}</p>
                  <EstadoBadge estado={cuota.estado} />
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold">{formatCurrency(cuota.monto)}</p>
                  {cuota.estado === "pagado" && "comprobante" in cuota && (
                    <Button variant="ghost" size="icon-sm">
                      <Download className="w-4 h-4" />
                    </Button>
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
