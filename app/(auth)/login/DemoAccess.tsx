"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, LogIn } from "lucide-react";
import { saveSession } from "@/lib/auth";
import { mockProfesores, mockComunidades } from "@/lib/mock-data";

const deporteEmoji: Record<string, string> = {
  "Fútbol":   "⚽",
  "Básquet":  "🏀",
  "Hockey":   "🏑",
  "Patín":    "⛸️",
  "Gimnasia": "🤸",
};

export function DemoAccess() {
  const [profeOpen, setProfeOpen] = useState(false);

  function loginSocio() {
    saveSession({ role: "socio" });
    window.location.href = "/inicio";
  }

  function loginProfe(profesorId: string) {
    saveSession({ role: "profe", profesorId });
    window.location.href = "/avisos";
  }

  return (
    <div className="space-y-2">
      {/* Socio demo */}
      <button
        type="button"
        onClick={loginSocio}
        className="w-full h-11 border border-[#E8ECF4] bg-white text-[#4A5568] rounded-2xl text-sm font-semibold hover:bg-[#F0F3FA] transition-colors flex items-center justify-center gap-2"
      >
        <LogIn aria-hidden="true" className="w-4 h-4" />
        Entrar como socio (demo)
      </button>

      {/* Profe access */}
      <div className="rounded-2xl border border-[#E8ECF4] overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => setProfeOpen(o => !o)}
          aria-expanded={profeOpen}
          className="w-full h-11 flex items-center justify-between px-4 text-sm font-semibold text-[#0D1117] hover:bg-[#F8FAFB] transition-colors"
        >
          <span className="flex items-center gap-2">
            <span aria-hidden="true">🏅</span> Ingresar como profe
          </span>
          {profeOpen
            ? <ChevronUp aria-hidden="true" className="w-4 h-4 text-[#566070]" />
            : <ChevronDown aria-hidden="true" className="w-4 h-4 text-[#566070]" />}
        </button>

        {profeOpen && (
          <div className="border-t border-[#E8ECF4] p-2 space-y-1">
            {mockProfesores.map(profe => {
              const emoji = deporteEmoji[profe.deporte] ?? "🏃";
              const comunidad = mockComunidades.find(
                c => c.id === profe.deporte.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
              );
              return (
                <button
                  key={profe.id}
                  type="button"
                  onClick={() => loginProfe(profe.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#F4F6FA] transition-colors text-left group"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                    style={{ background: comunidad ? `${comunidad.color}18` : "#F4F6FA" }}
                  >
                    <span role="img" aria-label={profe.deporte}>{emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#0D1117] leading-tight">{profe.name}</p>
                    <p className="text-[11px] text-[#566070] truncate">
                      {profe.deporte} · {profe.categorias.join(", ")}
                    </p>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      color: comunidad?.color ?? "#566070",
                      background: comunidad ? `${comunidad.color}18` : "#F4F6FA",
                    }}
                  >
                    Acceder
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
