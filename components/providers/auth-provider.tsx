"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { getSession, saveSession, clearSession, type AuthSession, type UserRole } from "@/lib/auth";

interface AuthContextValue {
  session:       AuthSession | null;
  ready:         boolean;
  login:         (session: AuthSession) => void;
  logout:        () => Promise<void>;
  updateSession: (patch: Partial<AuthSession>) => void;
}

const AuthContext = createContext<AuthContextValue>({
  session:       null,
  ready:         false,
  login:         () => {},
  logout:        async () => {},
  updateSession: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady]     = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, supabaseSession) => {
        if (supabaseSession?.user) {
          // Real Supabase session — load profile from DB
          const { data: profile } = await supabase
            .from("profiles")
            .select("role, name, profe_mock_id, profe_categorias")
            .eq("id", supabaseSession.user.id)
            .single();

          if (profile) {
            setSession({
              role: profile.role as UserRole,
              ...(profile.role === "profe" && {
                profesorId:       profile.profe_mock_id ?? undefined,
                categoriasActivas: profile.profe_categorias ?? undefined,
              }),
            });
          } else {
            setSession({ role: "socio" });
          }
        } else {
          // No Supabase session — fall back to localStorage (demo mode)
          setSession(getSession());
        }
        setReady(true);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Used by DemoAccess (localStorage-based demo login)
  function login(s: AuthSession) {
    saveSession(s);
    setSession(s);
  }

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearSession();
    setSession(null);
  }

  function updateSession(patch: Partial<AuthSession>) {
    setSession(prev => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      // If demo session, keep localStorage in sync
      if (!next.role) return prev;
      saveSession(next);
      return next;
    });
  }

  return (
    <AuthContext.Provider value={{ session, ready, login, logout, updateSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
