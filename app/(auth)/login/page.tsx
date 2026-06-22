import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-[#F4F6FA]">
      {/* Top section — brand */}
      <div className="bg-gradient-to-b from-[#15803D] to-[#052E16] pt-safe pb-12 px-5 flex flex-col">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-white/70 mt-4 mb-8 hover:text-white transition-colors self-start"
          aria-label="Volver a la página de inicio"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Volver
        </Link>

        <div className="flex flex-col items-center text-center">
          <div className="relative mb-5">
            <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full scale-150" aria-hidden="true" />
            <Image
              src="/escudo.png"
              alt="Escudo Deportivo Patagones"
              width={90}
              height={88}
              className="relative drop-shadow-2xl"
            />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Deportivo Patagones</h1>
          <p className="text-sm text-white/70 mt-1">Club Atlético · Carmen de Patagones</p>
        </div>
      </div>

      {/* Auth card */}
      <div className="flex-1 -mt-6 bg-[#F4F6FA] rounded-t-3xl px-5 pt-6" id="main-content">
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_0_rgb(0_0_0/0.08)] p-6 mb-4">
          <h2 className="text-lg font-black text-[#0D1117] mb-1">Bienvenido</h2>
          <p className="text-sm text-[#566070] mb-5">Ingresá con tu cuenta de socio</p>
          <LoginForm />
        </div>

        <Link
          href="/inicio"
          className="w-full h-11 border border-[#E8ECF4] bg-white text-[#4A5568] rounded-2xl text-sm font-semibold hover:bg-[#F0F3FA] transition-colors flex items-center justify-center"
          aria-label="Ingresar al modo de demostración"
        >
          Entrar como demo
        </Link>

        <p className="text-center text-[10px] text-[#566070] mt-6">
          Club Atlético Deportivo Patagones · Fundado el{" "}
          <time dateTime="1928-08-02">2 de agosto de 1928</time>
        </p>
      </div>
    </div>
  );
}
