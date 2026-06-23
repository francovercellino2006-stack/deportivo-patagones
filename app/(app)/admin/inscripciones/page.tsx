import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/top-bar";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { InscripcionesPanel, type SocioConCuota } from "./InscripcionesPanel";
import type { Profile, Cuota } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Inscripciones" };

const DEMO_SOCIOS: SocioConCuota[] = [
  { id: "demo-1", role: "socio", name: "Martín Rodríguez",   socio_number: "1234", category: "Socio Activo",  sports: ["Fútbol", "Básquet"], cuotaEstado: "pendiente", cuotaMonto: 8500, profe_deporte: null, profe_categorias: null, profe_initials: null, profe_mock_id: null, avatar_url: null, created_at: "" },
  { id: "demo-2", role: "socio", name: "Florencia García",   socio_number: "1235", category: "Socia Activa",  sports: ["Hockey"],            cuotaEstado: "pagado",    profe_deporte: null, profe_categorias: null, profe_initials: null, profe_mock_id: null, avatar_url: null, created_at: "" },
  { id: "demo-3", role: "socio", name: "Lucas Pérez",        socio_number: "1236", category: "Socio Activo",  sports: ["Básquet"],           cuotaEstado: "pendiente", cuotaMonto: 8000, profe_deporte: null, profe_categorias: null, profe_initials: null, profe_mock_id: null, avatar_url: null, created_at: "" },
  { id: "demo-4", role: "socio", name: "Ana Martínez",       socio_number: "1237", category: "Socia Activa",  sports: ["Patín", "Gimnasia"], cuotaEstado: "vencida",   cuotaMonto: 7500, profe_deporte: null, profe_categorias: null, profe_initials: null, profe_mock_id: null, avatar_url: null, created_at: "" },
  { id: "demo-5", role: "socio", name: "Carlos Romero",      socio_number: "1238", category: "Socio Activo",  sports: ["Fútbol"],            cuotaEstado: "pagado",    profe_deporte: null, profe_categorias: null, profe_initials: null, profe_mock_id: null, avatar_url: null, created_at: "" },
  { id: "demo-6", role: "socio", name: "Valentina López",    socio_number: "1239", category: "Socia Activa",  sports: ["Hockey", "Gimnasia"],cuotaEstado: "pagado",    profe_deporte: null, profe_categorias: null, profe_initials: null, profe_mock_id: null, avatar_url: null, created_at: "" },
  { id: "demo-7", role: "socio", name: "Tomás Fernández",    socio_number: "1240", category: "Socio Activo",  sports: [],                    cuotaEstado: "sin-cuota", profe_deporte: null, profe_categorias: null, profe_initials: null, profe_mock_id: null, avatar_url: null, created_at: "" },
];

export default async function InscripcionesPage() {
  let socios: SocioConCuota[] = DEMO_SOCIOS;
  let isDemo = true;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: callerProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (callerProfile?.role === "admin") {
        const admin = createAdminClient();
        const { data } = await admin
          .from("profiles")
          .select("id, role, name, socio_number, category, sports, avatar_url, created_at")
          .eq("role", "socio")
          .order("name") as { data: Profile[] | null };

        if (data && data.length > 0) {
          const now = new Date();
          const mesActual = now.toLocaleDateString("es-AR", { month: "long", year: "numeric" });
          const mesCapitalizado = mesActual.charAt(0).toUpperCase() + mesActual.slice(1);

          const socioIds = data.map(s => s.id);
          const { data: cuotas } = await admin
            .from("cuotas")
            .select("socio_id, estado, monto")
            .in("socio_id", socioIds)
            .eq("mes", mesCapitalizado) as { data: Pick<Cuota, "socio_id" | "estado" | "monto">[] | null };

          const cuotaMap = new Map<string, { estado: string; monto: number }>();
          for (const c of cuotas ?? []) {
            if (!cuotaMap.has(c.socio_id)) cuotaMap.set(c.socio_id, c);
          }

          socios = data.map(s => {
            const cuota = cuotaMap.get(s.id);
            return {
              ...s,
              cuotaEstado: (cuota?.estado as SocioConCuota["cuotaEstado"]) ?? "sin-cuota",
              cuotaMonto: cuota?.monto,
            };
          });
          isDemo = false;
        }
      }
    }
  } catch {
    // Supabase not configured — use demo data
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-1">
        <Link href="/admin" className="text-[#566070] hover:text-[#0D1117] transition-colors">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        </Link>
        <PageHeader
          title="Inscripciones"
          subtitle="Gestionar deportes de cada socio"
        />
      </div>

      {isDemo && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100">
          <p className="text-xs font-semibold text-amber-800">
            Modo demo — los cambios no se guardan
          </p>
          <p className="text-[11px] text-amber-600 mt-0.5">
            Conectá Supabase y logueate como admin para gestionar inscripciones reales.
          </p>
        </div>
      )}

      <InscripcionesPanel socios={socios} />
    </div>
  );
}
