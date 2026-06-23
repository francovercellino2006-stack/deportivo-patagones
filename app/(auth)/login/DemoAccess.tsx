"use client";
import { useState, useTransition } from "react";
import { ChevronDown, ChevronUp, LogIn, Shield, Loader2 } from "lucide-react";
import { loginAction } from "./actions";

export function DemoAccess() {
  const [profeOpen, setProfeOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState<string | null>(null);

  function demoLogin(email: string, password: string, dest: string, label: string) {
    setLoading(label);
    startTransition(async () => {
      const result = await loginAction(email, password);
      if (result.error) {
        alert(`Error: ${result.error}`);
        setLoading(null);
        return;
      }
      window.location.href = dest;
    });
  }

  return (
    <div className="space-y-2">
      {/* Socio demo */}
      <button
        type="button"
        disabled={isPending}
        onClick={() => demoLogin("socio1@dp.ar", "Demo1234!", "/inicio", "socio")}
        className="w-full h-11 border border-[#E8ECF4] bg-white text-[#4A5568] rounded-2xl text-sm font-semibold hover:bg-[#F0F3FA] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading === "socio"
          ? <><Loader2 aria-hidden="true" className="w-4 h-4 animate-spin" /> Ingresando...</>
          : <><LogIn aria-hidden="true" className="w-4 h-4" /> Entrar como socio (demo)</>
        }
      </button>

      {/* Admin demo */}
      <button
        type="button"
        disabled={isPending}
        onClick={() => demoLogin("admin@dp.ar", "Admin1234!", "/admin", "admin")}
        className="w-full h-11 border border-[#E8ECF4] bg-white text-[#4A5568] rounded-2xl text-sm font-semibold hover:bg-[#F0F3FA] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading === "admin"
          ? <><Loader2 aria-hidden="true" className="w-4 h-4 animate-spin" /> Ingresando...</>
          : <><Shield aria-hidden="true" className="w-4 h-4" /> Entrar como administrador (demo)</>
        }
      </button>

      {/* Profe demo */}
      <button
        type="button"
        disabled={isPending}
        onClick={() => demoLogin("profe1@dp.ar", "Demo1234!", "/mi-panel", "profe")}
        className="w-full h-11 border border-[#E8ECF4] bg-white text-[#4A5568] rounded-2xl text-sm font-semibold hover:bg-[#F0F3FA] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading === "profe"
          ? <><Loader2 aria-hidden="true" className="w-4 h-4 animate-spin" /> Ingresando...</>
          : <><span aria-hidden="true">🏅</span> Entrar como profe (demo)</>
        }
      </button>
    </div>
  );
}
