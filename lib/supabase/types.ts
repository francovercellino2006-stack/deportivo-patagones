export type UserRole = "socio" | "profe" | "admin";
export type CuotaEstado = "pendiente" | "pagado" | "vencida";

export interface Profile {
  id: string;
  role: UserRole;
  name: string;
  socio_number: string | null;
  category: string | null;
  sports: string[] | null;
  profe_deporte: string | null;
  profe_categorias: string[] | null;
  profe_initials: string | null;
  profe_mock_id: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Cuota {
  id: string;
  socio_id: string;
  mes: string;
  monto: number;
  estado: CuotaEstado;
  vencimiento: string | null;
  deporte: string | null;
  comprobante_url: string | null;
  pagado_at: string | null;
  pagado_por: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}
