-- =============================================================
-- Mi PAU 2026 — Schema Supabase
-- =============================================================
-- Ejecuta este SQL completo en: Supabase Dashboard → SQL Editor → New query
-- =============================================================

-- 1) Tabla de perfiles (1 fila por usuario)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text,
  curso text,
  comunidad text default 'MURCIA',
  centro text,
  fecha_pau date,
  plan text default 'gratis',
  ia_uso_mes integer default 0,
  ia_quota_mes integer,
  notif_email boolean default true,
  notif_push boolean default false,
  marketing_ok boolean default false,
  avatar_url text,
  rol text default 'estudiante',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2) Tabla de estados (sync de la app)
create table if not exists public.estados (
  user_id uuid primary key references auth.users(id) on delete cascade,
  schema_version integer default 2,
  data jsonb not null,
  device_id text,
  updated_at timestamptz default now()
);

-- 3) Trigger para crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nombre)
  values (new.id, coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4) Habilitar RLS (Row Level Security)
alter table public.profiles enable row level security;
alter table public.estados  enable row level security;

-- 5) Políticas: cada usuario solo accede a SUS datos
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "estados_all_own" on public.estados;
create policy "estados_all_own" on public.estados
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 6) Habilitar Realtime para sync entre dispositivos
alter publication supabase_realtime add table public.estados;
