"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function getAdminOrThrow() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Sin permisos de administrador");
  return user;
}

export async function actualizarDeportes(socioId: string, deportes: string[]) {
  const user = await getAdminOrThrow();
  const admin = createAdminClient();

  const { data: antes } = await admin
    .from("profiles")
    .select("sports, name")
    .eq("id", socioId)
    .single();

  const { error } = await admin
    .from("profiles")
    .update({ sports: deportes })
    .eq("id", socioId);

  if (error) throw error;

  await admin.from("audit_log").insert({
    user_id: user.id,
    action: "DEPORTES_ACTUALIZADOS",
    entity: "profiles",
    entity_id: socioId,
    metadata: {
      socio_name: antes?.name,
      antes: antes?.sports ?? [],
      despues: deportes,
    },
  });

  revalidatePath("/admin/inscripciones");
}

export async function darDeBaja(socioId: string) {
  const user = await getAdminOrThrow();
  const admin = createAdminClient();

  const { data: socio } = await admin
    .from("profiles")
    .select("name, sports, role")
    .eq("id", socioId)
    .single();

  const { error } = await admin
    .from("profiles")
    .update({ role: "baja", sports: [] })
    .eq("id", socioId);

  if (error) throw error;

  await admin.from("audit_log").insert({
    user_id: user.id,
    action: "SOCIO_DADO_DE_BAJA",
    entity: "profiles",
    entity_id: socioId,
    metadata: {
      socio_name: socio?.name,
      deportes_previos: socio?.sports ?? [],
    },
  });

  revalidatePath("/admin/inscripciones");
}
