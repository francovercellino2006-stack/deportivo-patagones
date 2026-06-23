import type { Metadata } from "next";
import Link from "next/link";
import { Users, DollarSign, Calendar, Activity, TrendingUp, ChevronRight, Newspaper, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/top-bar";
import { mockAdminStats, mockNoticias, mockEventos } from "@/lib/mock-data";
import { formatCurrency, formatShortDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Administración" };

export default function AdminPage() {
  return (
    <div>
      <PageHeader title="Administración" subtitle="Panel del club" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <Card className="bg-gradient-to-br from-vc-blue to-vc-blue/80 border-0">
          <CardContent className="py-4">
            <Users className="w-5 h-5 text-white/70 mb-2" />
            <p className="text-3xl font-bold text-white">{mockAdminStats.sociosActivos.toLocaleString("es-AR")}</p>
            <p className="text-white/70 text-xs mt-0.5">Socios activos</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-600 to-green-500 border-0">
          <CardContent className="py-4">
            <DollarSign className="w-5 h-5 text-white/70 mb-2" />
            <p className="text-2xl font-bold text-white">{formatCurrency(mockAdminStats.montoCobrado)}</p>
            <p className="text-white/70 text-xs mt-0.5">Cobrado este mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-orange-500" />
              <p className="text-xs text-[var(--muted)]">Actividades</p>
            </div>
            <p className="text-2xl font-bold">{mockAdminStats.actividadesActivas}</p>
            <p className="text-xs text-[var(--muted)]">activas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <p className="text-xs text-[var(--muted)]">Cuotas cobradas</p>
            </div>
            <p className="text-2xl font-bold">{mockAdminStats.cuotasEstesMes}</p>
            <p className="text-xs text-[var(--muted)]">este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <h2 className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">Acciones rápidas</h2>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: "Publicar noticia", icon: Newspaper, href: "/admin/noticias/nueva", color: "text-blue-600 bg-blue-100 dark:bg-blue-900/20" },
          { label: "Crear evento", icon: Trophy, href: "/admin/eventos/nuevo", color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20" },
          { label: "Inscripciones", icon: Users, href: "/admin/inscripciones", color: "text-purple-600 bg-purple-100 dark:bg-purple-900/20" },
          { label: "Control de cuotas", icon: DollarSign, href: "/admin/cuotas", color: "text-green-600 bg-green-100 dark:bg-green-900/20" },
        ].map(({ label, icon: Icon, href, color }) => (
          <Link key={label} href={href}>
            <Card className="hover:shadow-[var(--shadow)] transition-shadow cursor-pointer">
              <CardContent className="py-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium leading-tight">{label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent news */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Últimas noticias publicadas</CardTitle>
          <Link href="/admin/noticias" className="text-xs text-vc-blue font-medium">Ver todas</Link>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="divide-y divide-[var(--border)]">
            {mockNoticias.slice(0, 3).map(n => (
              <div key={n.id} className="flex items-center gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{n.title}</p>
                  <p className="text-xs text-[var(--muted)]">{n.category} · {formatShortDate(n.date)}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--muted)] shrink-0" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming events */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos eventos</CardTitle>
          <Link href="/admin/eventos" className="text-xs text-vc-blue font-medium">Ver todos</Link>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="divide-y divide-[var(--border)]">
            {mockEventos.slice(0, 3).map(e => (
              <div key={e.id} className="flex items-center gap-3 py-3">
                <div className="w-10 h-10 rounded-lg bg-vc-blue/10 flex flex-col items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-vc-blue leading-none">{new Date(e.date + "T00:00:00").getDate()}</span>
                  <span className="text-[9px] text-vc-blue uppercase">{new Date(e.date + "T00:00:00").toLocaleDateString("es-AR", { month: "short" })}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{e.title}</p>
                  <p className="text-xs text-[var(--muted)]">{e.location} · {e.time}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--muted)] shrink-0" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
