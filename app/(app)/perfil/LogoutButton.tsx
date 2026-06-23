"use client";
import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

export function LogoutButton() {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await logout();
    window.location.href = "/login";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-[#E8ECF4] bg-white text-[#C8102E] hover:bg-red-50 transition-colors disabled:opacity-60"
    >
      {loading
        ? <Loader2 aria-hidden="true" className="w-4 h-4 animate-spin" />
        : <LogOut   aria-hidden="true" className="w-4 h-4" />
      }
      <span className="text-sm font-semibold">
        {loading ? "Cerrando sesión..." : "Cerrar sesión"}
      </span>
    </button>
  );
}
