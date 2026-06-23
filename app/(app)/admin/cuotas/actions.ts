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

export async function marcarPagado(cuotaId: string) {
  const user = await getAdminOrThrow();
  const admin = createAdminClient();

  const { error } = await admin
    .from("cuotas")
    .update({
      estado:    "pagado",
      pagado_at: new Date().toISOString(),
      pagado_por: user.id,
    })
    .eq("id", cuotaId);

  if (error) throw error;

  await admin.from("audit_log").insert({
    user_id:   user.id,
    action:    "CUOTA_MARCADA_PAGADO",
    entity:    "cuotas",
    entity_id: cuotaId,
    metadata:  { timestamp: new Date().toISOString() },
  });

  revalidatePath("/admin/cuotas");
}

export async function marcarPendiente(cuotaId: string) {
  const user = await getAdminOrThrow();
  const admin = createAdminClient();

  const { error } = await admin
    .from("cuotas")
    .update({ estado: "pendiente", pagado_at: null, pagado_por: null })
    .eq("id", cuotaId);

  if (error) throw error;

  await admin.from("audit_log").insert({
    user_id:   user.id,
    action:    "CUOTA_REVERTIDA_A_PENDIENTE",
    entity:    "cuotas",
    entity_id: cuotaId,
  });

  revalidatePath("/admin/cuotas");
}

export async function crearCuota(socioId: string, deporte: string, monto: number) {
  const user = await getAdminOrThrow();
  const admin = createAdminClient();

  const mesActual = new Date().toLocaleDateString("es-AR", {
    month: "long", year: "numeric",
  });
  const mesCapitalizado = mesActual.charAt(0).toUpperCase() + mesActual.slice(1);

  const venc = new Date();
  venc.setDate(15);
  const vencimiento = venc.toISOString().split("T")[0];

  const { error } = await admin.from("cuotas").insert({
    socio_id:   socioId,
    mes:        mesCapitalizado,
    monto,
    estado:     "pendiente",
    vencimiento,
    deporte,
  });

  if (error) throw error;

  await admin.from("audit_log").insert({
    user_id:   user.id,
    action:    "CUOTA_CREADA",
    entity:    "cuotas",
    metadata:  { socio_id: socioId, mes: mesCapitalizado, deporte, monto },
  });

  revalidatePath("/admin/cuotas");
}
