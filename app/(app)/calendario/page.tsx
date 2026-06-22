import type { Metadata } from "next";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, categoryBadgeVariant } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/top-bar";
import { mockEventos, mockPartidos } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Agenda" };

type CalendarItem =
  | { type: "evento";  date: string; id: string; title: string; time: string; location: string; category: string }
  | { type: "partido"; date: string; id: string; local: string; visitante: string; hora: string; lugar: string; deporte: string; categoria: string };

export default function CalendarioPage() {
  const items: CalendarItem[] = [
    ...mockEventos.map(e => ({ type: "evento"  as const, ...e })),
    ...mockPartidos.map(p => ({ type: "partido" as const, ...p, date: p.fecha })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  const grouped = items.reduce<Record<string, CalendarItem[]>>((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  return (
    <div className="animate-fade-in">
      <PageHeader title="Agenda" subtitle="Partidos, torneos y eventos" />

      <div className="space-y-5">
        {Object.entries(grouped).map(([date, dayItems]) => {
          const d       = new Date(date + "T00:00:00");
          const isToday = new Date().toDateString() === d.toDateString();

          return (
            <div key={date}>
              {/* Date header */}
              <div className="flex items-center gap-3 mb-3 sticky top-[57px] bg-[#F4F6FA] py-1 z-10">
                <div className={`flex flex-col items-center w-11 h-11 rounded-2xl justify-center shrink-0 shadow-sm ${
                  isToday
                    ? "bg-gradient-to-br from-[#15803D] to-[#0F6B30]"
                    : "bg-white border border-[#E8ECF4]"
                }`}>
                  <span className={`text-base font-black leading-none ${isToday ? "text-white" : "text-[#0D1117]"}`}>
                    {d.getDate()}
                  </span>
                  <span className={`text-[9px] font-bold uppercase leading-none mt-0.5 ${
                    isToday ? "text-white/70" : "text-[#566070]"
                  }`}>
                    {d.toLocaleDateString("es-AR", { month: "short" })}
                  </span>
                </div>
                <div>
                  <p className={`text-sm font-bold ${isToday ? "text-[#15803D]" : "text-[#0D1117]"}`}>
                    {isToday ? "Hoy" : d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
                  </p>
                  <p className="text-[10px] text-[#566070]">{dayItems.length} actividades</p>
                </div>
              </div>

              <div className="space-y-2 ml-14">
                {dayItems.map(item => (
                  <Card key={`${item.type}-${item.id}`} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex gap-0">
                        <div className={`w-1 shrink-0 rounded-l-2xl ${
                          item.type === "partido" ? "bg-[#C8102E]" : "bg-[#64748b]"
                        }`} />
                        <div className="flex-1 p-4">
                          {item.type === "evento" ? (
                            <>
                              <div className="flex items-center gap-1.5 mb-1">
                                <Badge variant={categoryBadgeVariant(item.category)} className="text-[10px] px-1.5 py-0">
                                  {item.category}
                                </Badge>
                              </div>
                              <p className="text-sm font-bold text-[#0D1117]">{item.title}</p>
                              <div className="flex items-center gap-4 mt-1.5 text-xs text-[#566070]">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.time}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-1.5 mb-1">
                                <Badge variant="red" className="text-[10px] px-1.5 py-0">Partido</Badge>
                                <span className="text-[10px] text-[#566070]">{item.deporte} · {item.categoria}</span>
                              </div>
                              <p className="text-sm font-bold text-[#0D1117]">{item.local} vs {item.visitante}</p>
                              <div className="flex items-center gap-4 mt-1.5 text-xs text-[#566070]">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.hora}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.lugar}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
