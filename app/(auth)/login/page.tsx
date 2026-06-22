import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-[#F4F6FA]">
      {/* Top section — brand */}
      <div className="bg-gradient-to-b from-[#15803D] to-[#052E16] pt-safe pb-12 px-5 flex flex-col">
        <Link href="/" className="flex items-center gap-1.5 text-sm text-white/60 mt-4 mb-8 hover:text-white transition-colors self-start">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>

        <div className="flex flex-col items-center text-center">
          <div className="relative mb-5">
            <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full scale-150" />
            <Image src="/escudo.png" alt="Deportivo Patagones" width={90} height={88} className="relative drop-shadow-2xl" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Deportivo Patagones</h1>
          <p className="text-sm text-white/60 mt-1">Club Atlético · Carmen de Patagones</p>
        </div>
      </div>

      {/* Auth card — overlaps top section */}
      <div className="flex-1 -mt-6 bg-[#F4F6FA] rounded-t-3xl px-5 pt-6">
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_0_rgb(0_0_0/0.08)] p-6 mb-4">
          <h2 className="text-lg font-black text-[#0D1117] mb-1">Bienvenido</h2>
          <p className="text-sm text-[#8892A4] mb-5">Ingresá con tu cuenta de socio</p>

          {/* Google */}
          <button className="w-full h-11 flex items-center justify-center gap-3 border border-[#E8ECF4] rounded-xl text-sm font-semibold hover:bg-[#F4F6FA] transition-colors mb-4 text-[#0D1117]">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>

          <div className="flex items-center gap-3 my-4">
            <hr className="flex-1 border-[#E8ECF4]" />
            <span className="text-xs text-[#8892A4] font-medium">o con email</span>
            <hr className="flex-1 border-[#E8ECF4]" />
          </div>

          <div className="space-y-3">
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              className="w-full h-11 px-4 rounded-xl border border-[#E8ECF4] bg-[#F4F6FA] text-sm text-[#0D1117] placeholder:text-[#8892A4] focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:border-transparent transition-all"
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full h-11 px-4 rounded-xl border border-[#E8ECF4] bg-[#F4F6FA] text-sm text-[#0D1117] placeholder:text-[#8892A4] focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:border-transparent transition-all"
            />
            <Link href="/inicio">
              <button className="w-full h-11 bg-[#15803D] text-white rounded-xl text-sm font-bold hover:bg-[#052E16] transition-colors flex items-center justify-center gap-2 mt-1 shadow-sm">
                Ingresar <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          <p className="text-center text-xs text-[#8892A4] mt-4">
            ¿No tenés acceso?{" "}
            <a href="#" className="text-[#15803D] font-semibold">Contactá al club</a>
          </p>
        </div>

        <Link href="/inicio" className="block">
          <button className="w-full h-11 border border-[#E8ECF4] bg-white text-[#4A5568] rounded-2xl text-sm font-semibold hover:bg-[#F0F3FA] transition-colors">
            Entrar como demo
          </button>
        </Link>

        <p className="text-center text-[10px] text-[#8892A4] mt-6">
          Club Atlético Deportivo Patagones · Fundado el 2 de agosto de 1928
        </p>
      </div>
    </div>
  );
}
