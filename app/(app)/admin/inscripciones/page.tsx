import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/top-bar";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { InscripcionesPanel } from "./InscripcionesPanel";
import type { Profile } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Inscripciones" };

export default async function InscripcionesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (callerProfile?.role !== "admin") redirect("/inicio");

  const admin = createAdminClient();

  const { data: socios } = await admin
    .from("profiles")
    .select("id, role, name, socio_number, category, sports, avatar_url, created_at")
    .eq("role", "socio")
    .order("name") as { data: Profile[] | null };

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

      <InscripcionesPanel socios={socios ?? []} />
    </div>
  );
}
