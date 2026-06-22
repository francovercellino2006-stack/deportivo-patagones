"use client";
import { LogOut } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

export function LogoutButton() {
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-[#E8ECF4] bg-white text-[#C8102E] hover:bg-red-50 transition-colors"
    >
      <LogOut aria-hidden="true" className="w-4 h-4" />
      <span className="text-sm font-semibold">Cerrar sesión</span>
    </button>
  );
}
