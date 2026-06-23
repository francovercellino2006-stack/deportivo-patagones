-- ============================================================
-- Club Atlético Deportivo Patagones — Database Schema
-- Pegar y ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── 1. Profiles ─────────────────────────────────────────────
create table if not exists profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  role           text not null default 'socio'
                   check (role in ('socio', 'profe', 'admin', 'baja')),
  name           text not null,
  socio_number   text,
  category       text,
  sports         text[],
  profe_deporte  text,
  profe_categorias text[],
  profe_initials text,
  profe_mock_id  text,          -- maps to mock data IDs during migration
  avatar_url     text,
  created_at     timestamptz not null default now()
);

alter table profiles enable row level security;

-- Users can read their own profile
create policy "profiles: read own"
  on profiles for select
  using (id = auth.uid());

-- Admins can read all profiles (uses service role in admin panel, RLS bypassed)
-- Regular queries via anon key are limited to own profile


-- ── 2. Cuotas ───────────────────────────────────────────────
create table if not exists cuotas (
  id             uuid primary key default gen_random_uuid(),
  socio_id       uuid not null references profiles(id) on delete cascade,
  mes            text not null,           -- e.g. "Junio 2026"
  monto          integer not null,
  estado         text not null default 'pendiente'
                   check (estado in ('pendiente', 'pagado', 'vencida')),
  vencimiento    date,
  deporte        text,
  comprobante_url text,
  pagado_at      timestamptz,
  pagado_por     uuid references profiles(id),
  created_at     timestamptz not null default now()
);

alter table cuotas enable row level security;

-- Socios can read their own cuotas
create policy "cuotas: read own"
  on cuotas for select
  using (socio_id = auth.uid());

-- Service role (admin panel) bypasses RLS automatically


-- ── 3. Audit Log ────────────────────────────────────────────
create table if not exists audit_log (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references profiles(id),
  action     text not null,
  entity     text not null,
  entity_id  text,
  metadata   jsonb,
  created_at timestamptz not null default now()
);

alter table audit_log enable row level security;

-- Only admins (service role) can read audit log
-- No public policies needed — service role bypasses RLS


-- ── 4. Trigger: auto-create profile on signup ───────────────
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, role, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'socio'),
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
