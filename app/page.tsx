import Link from "next/link";
import { Smartphone, Bell, CreditCard, Calendar, Trophy, Users, ArrowRight } from "lucide-react";
import { VCShield, VCLogoCircle } from "@/components/vc-logo";

const features = [
  { icon: Bell,        title: "Novedades al instante",   desc: "Notificaciones sobre noticias, cambios de horario y comunicados importantes." },
  { icon: CreditCard,  title: "Cuotas online",           desc: "Consultá el estado de tu cuota y pagá con Mercado Pago sin ir al club." },
  { icon: Calendar,    title: "Agenda centralizada",     desc: "Partidos, entrenamientos, eventos y torneos en un solo lugar." },
  { icon: Trophy,      title: "Eventos del club",        desc: "Confirmá asistencia a torneos, cenas y actividades especiales." },
  { icon: Users,       title: "Tu perfil de socio",      desc: "Carnet digital, historial de pagos y deportes asociados." },
  { icon: Smartphone,  title: "Instalable en tu celular",desc: "Funciona como app nativa en iOS y Android sin necesidad de tienda." },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh" style={{ background: "#0d0d0d" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <VCLogoCircle size={34} />
            <div className="leading-none">
              <p className="text-white font-black text-sm tracking-tight">Deportivo Patagones</p>
              <p className="text-white/50 text-[10px]">Club Atlético · Patagones</p>
            </div>
          </div>
          <Link
            href="/login"
            className="flex items-center gap-1.5 bg-vc-red text-white text-sm font-semibold px-4 h-9 rounded-full hover:bg-vc-red-hover transition-colors"
          >
            Ingresar <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-5 pt-16 pb-20 text-center">
        {/* Big shield */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-vc-red/30 blur-3xl rounded-full scale-150" />
            <VCShield size={120} className="relative drop-shadow-2xl" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
          <span className="w-1.5 h-1.5 bg-vc-red rounded-full animate-pulse" />
          Club Atlético Deportivo Patagones · Carmen de Patagones · Carmen de Patagones, Bs.As.
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none mb-5 text-white">
          Tu club,<br />en el bolsillo
        </h1>
        <p className="text-lg text-white/60 max-w-xl mx-auto leading-relaxed mb-8">
          Toda la información del club en una sola plataforma. Noticias, horarios, cuotas, eventos y más.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-2 bg-vc-red text-white font-semibold px-6 h-12 rounded-full text-base hover:bg-vc-red-hover transition-colors w-full sm:w-auto justify-center"
          >
            Acceder al club <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/inicio"
            className="flex items-center gap-2 border border-white/20 text-white font-medium px-6 h-12 rounded-full text-base hover:bg-white/10 transition-colors w-full sm:w-auto justify-center"
          >
            Ver demo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-white/10 bg-white/5">
        <div className="max-w-5xl mx-auto px-5 py-16">
          <h2 className="text-2xl font-bold text-center text-white mb-10">Todo lo que necesitás</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 p-5 rounded-2xl border border-white/10 hover:border-vc-red/50 hover:bg-vc-red/5 transition-all">
                <div className="w-10 h-10 rounded-xl bg-vc-red/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-vc-red" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1 text-white">{title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-5 py-16 text-center">
        <VCLogoCircle size={56} className="mx-auto mb-5" />
        <h2 className="text-2xl font-bold mb-3 text-white">¿Ya sos socio?</h2>
        <p className="text-white/50 mb-6">Accedé con tu correo o cuenta de Google.</p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-vc-red text-white font-semibold px-8 h-12 rounded-full hover:bg-vc-red-hover transition-colors"
        >
          Ingresar ahora <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/30">
        <p>© 2026 Club Atlético Deportivo Patagones · Carmen de Patagones · C. de Patagones, Buenos Aires</p>
      </footer>
    </div>
  );
}
