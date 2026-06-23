export type UserRole = "socio" | "profe" | "admin";

export interface AuthSession {
  role: UserRole;
  profesorId?: string;
  categoriasActivas?: string[];
}

const KEY = "dp_auth";

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: AuthSession): void {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(KEY);
}
