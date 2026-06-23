import { createClient } from "@supabase/supabase-js";

// Server-only client that bypasses Row Level Security.
// Only import this in Server Components or Server Actions — never in client code.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
