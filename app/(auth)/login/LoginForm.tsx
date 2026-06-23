"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { loginAction } from "./actions";
import { saveSession, clearSession, type UserRole } from "@/lib/auth";

type FormErrors = { email?: string; password?: string };

const EMAIL_MAX    = 254;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 128;

function validateEmail(v: string) {
  if (!v) return "El correo es obligatorio";
  if (v.length > EMAIL_MAX) return `Máximo ${EMAIL_MAX} caracteres`;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Ingresá un correo válido";
}

function validatePassword(v: string) {
  if (!v) return "La contraseña es obligatoria";
  if (v.length < PASSWORD_MIN) return `Mínimo ${PASSWORD_MIN} caracteres`;
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [errors, setErrors]         = useState<FormErrors>({});
  const [touched, setTouched]       = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  function handleBlur(field: keyof FormErrors) {
    setTouched(t => ({ ...t, [field]: true }));
    validate(field);
  }

  function validate(field?: keyof FormErrors) {
    const next: FormErrors = {};
    if (!field || field === "email")    next.email    = validateEmail(email);
    if (!field || field === "password") next.password = validatePassword(password);
    setErrors(e => ({ ...e, ...next }));
    return !next.email && !next.password;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!validate()) return;

    setServerError(null);
    startTransition(async () => {
      const result = await loginAction(email, password);
      if (result.error) {
        setServerError(result.error);
        return;
      }
      clearSession();
      saveSession({ role: (result.role ?? "socio") as UserRole });
      const dest = result.role === "admin" ? "/admin"
                 : result.role === "profe" ? "/mi-panel"
                 : "/inicio";
      router.push(dest);
    });
  }

  const emailError    = touched.email    ? errors.email    : undefined;
  const passwordError = touched.password ? errors.password : undefined;

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Formulario de acceso">
      {/* Google OAuth */}
      <button
        type="button"
        onClick={async () => {
          const { createBrowserClient } = await import("@supabase/ssr");
          const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          );
          await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/inicio` },
          });
        }}
        className="w-full h-11 flex items-center justify-center gap-3 border border-[#E8ECF4] rounded-xl text-sm font-semibold hover:bg-[#F4F6FA] transition-colors mb-4 text-[#0D1117]"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continuar con Google
      </button>

      <div className="flex items-center gap-3 my-4" role="separator" aria-label="o con email">
        <hr className="flex-1 border-[#E8ECF4]" />
        <span className="text-xs text-[#566070] font-medium" aria-hidden="true">o con email</span>
        <hr className="flex-1 border-[#E8ECF4]" />
      </div>

      <p className="text-[10px] text-[#566070] bg-[#F4F6FA] rounded-xl px-3 py-2 mb-4 leading-relaxed">
        <strong className="text-[#0D1117]">Privacidad:</strong> tus datos son usados exclusivamente
        para autenticar tu acceso como socio. No se comparten con terceros.
      </p>

      {serverError && (
        <div role="alert" className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-[#C8102E]">
          {serverError}
        </div>
      )}

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {emailError    && <span>Error en correo: {emailError}</span>}
        {passwordError && <span>Error en contraseña: {passwordError}</span>}
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-[#0D1117] mb-1.5">
            Correo electrónico <span aria-hidden="true" className="text-[#C8102E]">*</span>
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            maxLength={EMAIL_MAX}
            aria-required="true"
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "email-error" : undefined}
            value={email}
            onChange={e => setEmail(e.target.value)}
            onBlur={() => handleBlur("email")}
            placeholder="correo@ejemplo.com"
            className={`w-full h-11 px-4 rounded-xl border bg-[#F4F6FA] text-sm text-[#0D1117] placeholder:text-[#566070] focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:border-transparent transition-all ${
              emailError ? "border-[#C8102E]" : "border-[#E8ECF4]"
            }`}
          />
          {emailError && (
            <p id="email-error" role="alert" className="mt-1 text-xs text-[#C8102E] font-medium">
              {emailError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-semibold text-[#0D1117] mb-1.5">
            Contraseña <span aria-hidden="true" className="text-[#C8102E]">*</span>
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            minLength={PASSWORD_MIN}
            maxLength={PASSWORD_MAX}
            aria-required="true"
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? "password-error" : "password-hint"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onBlur={() => handleBlur("password")}
            placeholder="••••••••"
            className={`w-full h-11 px-4 rounded-xl border bg-[#F4F6FA] text-sm text-[#0D1117] placeholder:text-[#566070] focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:border-transparent transition-all ${
              passwordError ? "border-[#C8102E]" : "border-[#E8ECF4]"
            }`}
          />
          {passwordError ? (
            <p id="password-error" role="alert" className="mt-1 text-xs text-[#C8102E] font-medium">
              {passwordError}
            </p>
          ) : (
            <p id="password-hint" className="mt-1 text-[10px] text-[#566070]">
              Mínimo {PASSWORD_MIN} caracteres
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full h-11 bg-[#15803D] text-white rounded-xl text-sm font-bold hover:bg-[#052E16] transition-colors flex items-center justify-center gap-2 mt-1 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <><Loader2 aria-hidden="true" className="w-4 h-4 animate-spin" /> Ingresando...</>
          ) : (
            <>Ingresar <ArrowRight aria-hidden="true" className="w-4 h-4" /></>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-[#566070] mt-4">
        ¿No tenés acceso?{" "}
        <a
          href="mailto:contacto@deportivopatagones.com.ar"
          className="text-[#15803D] font-semibold underline-offset-2 hover:underline"
        >
          Contactá al club
        </a>
      </p>
    </form>
  );
}
