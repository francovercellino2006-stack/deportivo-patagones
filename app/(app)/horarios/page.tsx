import type { Metadata } from "next";
import { MapPin, User, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/top-bar";
import { mockHorarios } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Horarios" };

const deportes = ["Todos", "Fútbol", "Básquet", "Hockey", "Patín", "Gimnasia"];

const sportConfig: Record<string, { gradient: string; dot: string; lightBg: string; textColor: string }> = {
  "Fútbol":   { gradient: "from-[#15803D] to-[#22C55E]", dot: "bg-[#15803D]",  lightBg: "bg-[#15803D]/8",  textColor: "text-[#15803D]"  },
  "Básquet":  { gradient: "from-[#1d4ed8] to-[#3b82f6]", dot: "bg-[#1d4ed8]",  lightBg: "bg-[#1d4ed8]/8",  textColor: "text-[#1d4ed8]"  },
  "Hockey":   { gradient: "from-[#0d9488] to-[#14b8a6]", dot: "bg-[#0d9488]",  lightBg: "bg-[#0d9488]/8",  textColor: "text-[#0d9488]"  },
  "Patín":    { gradient: "from-[#7c3aed] to-[#a78bfa]", dot: "bg-[#7c3aed]",  lightBg: "bg-[#7c3aed]/8",  textColor: "text-[#7c3aed]"  },
  "Gimnasia": { gradient: "from-[#059669] to-[#34d399]", dot: "bg-[#059669]",  lightBg: "bg-[#059669]/8",  textColor: "text-[#059669]"  },
};

export default function HorariosPage() {
  const grouped = mockHorarios.reduce<Record<string, typeof mockHorarios>>((acc, h) => {
    if (!acc[h.deporte]) acc[h.deporte] = [];
    acc[h.deporte].push(h);
    return acc;
  }, {});

  return (
    <div className="animate-fade-in">
      <PageHeader title="Horarios" subtitle="Cuándo y dónde entrenás" />

      {/* Sport filters */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-5 -mx-4 px-4 scrollbar-none">
        {deportes.map((d, i) => {
          const cfg = sportConfig[d];
          return (
            <button
              key={d}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                i === 0
                  ? "bg-[#15803D] text-white shadow-sm"
                  : "bg-white border border-[#E8ECF4] text-[#8892A4] hover:text-[#0D1117]"
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([deporte, horarios]) => {
          const cfg = sportConfig[deporte] ?? sportConfig["Fútbol"];
          return (
            <div key={deporte}>
              {/* Sport header */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shrink-0`}>
                  <span className="text-white text-[10px] font-black">
                    {deporte.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <h2 className="font-bold text-[#0D1117]">{deporte}</h2>
                <span className="text-xs text-[#8892A4]">{horarios.length} actividades</span>
              </div>

              <div className="space-y-2">
                {horarios.map(h => (
                  <Card key={h.id} className="hover:shadow-[0_4px_12px_0_rgb(0_0_0/0.06)] transition-shadow overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex gap-0">
                        <div className={`w-1 bg-gradient-to-b ${cfg.gradient} shrink-0 rounded-l-2xl`} />
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.lightBg} ${cfg.textColor}`}>
                              {h.categoria}
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs text-[#4A5568]">
                              <Clock className="w-3.5 h-3.5 text-[#8892A4] shrink-0" />
                              <span className="font-semibold text-[#0D1117]">{h.dias.join(" · ")}</span>
                              <span className="text-[#8892A4]">·</span>
                              <span>{h.horario}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#8892A4]">
                              <User className="w-3.5 h-3.5 shrink-0" />
                              <span>{h.profesor}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#8892A4]">
                              <MapPin className="w-3.5 h-3.5 shrink-0" />
                              <span>{h.lugar}</span>
                            </div>
                          </div>
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
