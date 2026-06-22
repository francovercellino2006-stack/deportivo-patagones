import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, MapPin, Users, ChevronRight, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, categoryBadgeVariant } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/top-bar";
import { mockEventos } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Eventos" };

const categoryGradient: Record<string, string> = {
  "Fútbol":        "from-[#15803D] to-[#22C55E]",
  "Básquet":       "from-[#1d4ed8] to-[#3b82f6]",
  "Hockey":        "from-[#0d9488] to-[#14b8a6]",
  "Institucional": "from-[#4A5568] to-[#718096]",
  "Eventos":       "from-[#15803D] to-[#ef4444]",
};

export default function EventosPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Eventos" subtitle="Actividades del club" />

      <div className="space-y-3">
        {mockEventos.map(evento => {
          const fecha = new Date(evento.date + "T00:00:00");
          const day   = fecha.getDate();
          const month = fecha.toLocaleDateString("es-AR", { month: "short" });
          const cuposDisp = evento.cupos ? evento.cupos - (evento.inscriptos ?? 0) : null;
          const pctFull   = evento.cupos ? ((evento.inscriptos ?? 0) / evento.cupos) * 100 : 0;
          const casiLleno = pctFull > 75;
          const grad      = categoryGradient[evento.category] ?? "from-[#15803D] to-[#22C55E]";

          return (
            <Link key={evento.id} href={`/eventos/${evento.id}`}>
              <Card className="overflow-hidden hover:shadow-[0_6px_20px_0_rgb(0_0_0/0.09)] transition-shadow">
                <CardContent className="p-0">
                  <div className="flex gap-0">
                    {/* Date column */}
                    <div className={`bg-gradient-to-b ${grad} w-16 flex flex-col items-center justify-center py-5 shrink-0`}>
                      <span className="text-2xl font-black text-white leading-none">{day}</span>
                      <span className="text-[10px] text-white/80 font-bold uppercase mt-1">{month}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <Badge variant={categoryBadgeVariant(evento.category)} className="text-[10px]">
                          {evento.category}
                        </Badge>
                        {evento.confirmed && (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                            <CheckCircle2 className="w-3 h-3" /> Confirmado
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm text-[#0D1117] leading-snug mb-2">{evento.title}</h3>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-[#8892A4]">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>{evento.time} hs</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#8892A4]">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span>{evento.location}</span>
                        </div>
                      </div>

                      {evento.cupos && (
                        <div className="mt-3">
                          <div className="flex justify-between text-[10px] text-[#8892A4] mb-1.5">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {evento.inscriptos}/{evento.cupos} inscriptos
                            </span>
                            <span className={casiLleno ? "text-[#C8102E] font-semibold" : ""}>
                              {cuposDisp} lugares libres
                            </span>
                          </div>
                          <div className="h-1.5 bg-[#F0F3FA] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${casiLleno ? "bg-[#C8102E]" : "bg-[#15803D]"}`}
                              style={{ width: `${pctFull}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center pr-3">
                      <ChevronRight className="w-4 h-4 text-[#C4CBD8]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
