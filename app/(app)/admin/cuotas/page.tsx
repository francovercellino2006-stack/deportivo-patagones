import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/top-bar";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { CuotasAdminTable } from "./CuotasAdminTable";
import type { Profile, Cuota } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Control de cuotas" };

export default async function AdminCuotasPage() {
  // 1. Verify the caller is an authenticated admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (callerProfile?.role !== "admin") redirect("/inicio");

  // 2. Fetch all socios using the admin client (bypasses RLS)
  const admin = createAdminClient();

  const { data: socios } = await admin
    .from("profiles")
    .select("id, role, name, socio_number, category, sports, created_at")
    .eq("role", "socio")
    .order("name") as { data: Profile[] | null };

  // 3. Current month label ("Junio 2026")
  const now = new Date();
  const mesActual = now.toLocaleDateString("es-AR", { month: "long", year: "numeric" });
  const mesCapitalizado = mesActual.charAt(0).toUpperCase() + mesActual.slice(1);

  // 4. Fetch cuotas for this month
  const socioIds = (socios ?? []).map(s => s.id);
  let cuotasMes: Cuota[] = [];

  if (socioIds.length > 0) {
    const { data } = await admin
      .from("cuotas")
      .select("*")
      .in("socio_id", socioIds)
      .eq("mes", mesCapitalizado) as { data: Cuota[] | null };
    cuotasMes = data ?? [];
  }

  // 5. Merge: one cuota per socio (first match per socio_id)
  const cuotaMap = new Map<string, Cuota>();
  for (const c of cuotasMes) {
    if (!cuotaMap.has(c.socio_id)) cuotaMap.set(c.socio_id, c);
  }

  const sociosConCuota = (socios ?? []).map(s => ({
    ...s,
    cuota: cuotaMap.get(s.id) ?? null,
  }));

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-1">
        <Link href="/admin" className="text-[#566070] hover:text-[#0D1117] transition-colors">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        </Link>
        <PageHeader
          title="Control de cuotas"
          subtitle={mesCapitalizado}
        />
      </div>

      {sociosConCuota.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-sm font-semibold text-[#0D1117] mb-2">No hay socios registrados aún</p>
          <p className="text-xs text-[#566070] leading-relaxed max-w-xs mx-auto">
            Creá usuarios en el{" "}
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="text-[#15803D] underline underline-offset-2"
            >
              panel de Supabase
            </a>{" "}
            y ejecutá el seed SQL para ver los socios aquí.
          </p>
        </div>
      ) : (
        <CuotasAdminTable socios={sociosConCuota} mesActual={mesCapitalizado} />
      )}
    </div>
  );
}
