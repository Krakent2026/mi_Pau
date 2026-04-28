-- =============================================================
-- Mi PAU 2026 — Panel de administrador (Supabase)
-- =============================================================
-- Ejecuta este SQL en Supabase Dashboard → SQL Editor → New query.
-- Solo hay que ejecutarlo una vez. Idempotente.
-- =============================================================

-- 1) Helper: ¿soy admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1 from public.profiles
    where id = auth.uid() and rol = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- 2) Políticas RLS extra: admin puede LEER todos los perfiles y estados
drop policy if exists "profiles_admin_select_all" on public.profiles;
create policy "profiles_admin_select_all" on public.profiles
  for select using (public.is_admin());

drop policy if exists "estados_admin_select_all" on public.estados;
create policy "estados_admin_select_all" on public.estados
  for select using (public.is_admin());

-- 3) Borrar usuario (cascade) — solo admins
create or replace function public.admin_delete_user(target uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then
    raise exception 'No autorizado';
  end if;
  if target = auth.uid() then
    raise exception 'No puedes borrarte a ti mismo';
  end if;
  delete from auth.users where id = target;
end;
$$;
revoke all on function public.admin_delete_user(uuid) from public;
grant execute on function public.admin_delete_user(uuid) to authenticated;

-- 4) Cambiar rol de un usuario — solo admins
create or replace function public.admin_set_role(target uuid, nuevo_rol text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'No autorizado';
  end if;
  if nuevo_rol not in ('estudiante','admin','tutor','padre') then
    raise exception 'Rol no válido';
  end if;
  update public.profiles set rol = nuevo_rol, updated_at = now()
    where id = target;
end;
$$;
revoke all on function public.admin_set_role(uuid, text) from public;
grant execute on function public.admin_set_role(uuid, text) to authenticated;

-- 5) Listado de usuarios con estadísticas (solo admins)
create or replace function public.admin_listar_usuarios()
returns table (
  id uuid,
  email text,
  nombre text,
  curso text,
  plan text,
  rol text,
  alta timestamptz,
  ultimo_login timestamptz,
  ultima_sync timestamptz,
  num_sesiones integer,
  minutos_totales integer,
  email_confirmado boolean
)
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    p.id,
    u.email::text,
    p.nombre,
    p.curso,
    p.plan,
    p.rol,
    u.created_at as alta,
    u.last_sign_in_at as ultimo_login,
    e.updated_at as ultima_sync,
    coalesce(jsonb_array_length(e.data->'sesiones'), 0)::integer as num_sesiones,
    coalesce((
      select sum((s->>'minutos')::int)::int
      from jsonb_array_elements(coalesce(e.data->'sesiones','[]'::jsonb)) s
    ), 0)::integer as minutos_totales,
    (u.email_confirmed_at is not null) as email_confirmado
  from public.profiles p
  join auth.users u on u.id = p.id
  left join public.estados e on e.user_id = p.id
  where public.is_admin();
$$;
revoke all on function public.admin_listar_usuarios() from public;
grant execute on function public.admin_listar_usuarios() to authenticated;

-- 6) Garantizar que el usuario actual tiene fila en profiles (auto-reparación)
--    Útil para usuarios registrados antes de que existiera el trigger.
create or replace function public.ensure_my_profile()
returns public.profiles
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  uid uuid := auth.uid();
  email_user text;
  fila public.profiles;
begin
  if uid is null then
    raise exception 'No autenticado';
  end if;
  select email into email_user from auth.users where id = uid;
  insert into public.profiles (id, email, nombre)
    values (uid, email_user, split_part(coalesce(email_user, ''), '@', 1))
    on conflict (id) do nothing;
  select * into fila from public.profiles where id = uid;
  return fila;
end;
$$;
revoke all on function public.ensure_my_profile() from public;
grant execute on function public.ensure_my_profile() to authenticated;

-- 7) Backfill: crear perfil a TODOS los usuarios huérfanos (registrados antes del trigger)
--    Ejecuta una sola vez al actualizar el schema.
insert into public.profiles (id, email, nombre)
select u.id, u.email, coalesce(u.raw_user_meta_data->>'nombre', split_part(u.email, '@', 1))
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- =============================================================
-- INSTRUCCIONES
-- =============================================================
-- 1) Ejecuta TODO este script en SQL Editor de Supabase.
-- 2) Hazte admin a ti misma. Sustituye TU_EMAIL:
--      update public.profiles
--      set rol = 'admin'
--      where id = (select id from auth.users where email = 'TU_EMAIL');
--
--    O por UUID:
--      update public.profiles set rol = 'admin' where id = '<UUID>';
--
-- 3) Recarga la app. Verás una pestaña "👑 Admin" con el panel.
--
-- =============================================================
-- CONSULTAS ÚTILES (para SQL Editor)
-- =============================================================
-- Listar todos:
--   select * from admin_listar_usuarios() order by ultimo_login desc nulls last;
--
-- Top 10 horas estudiadas:
--   select nombre, email, round(minutos_totales/60.0, 1) as horas, num_sesiones
--   from admin_listar_usuarios()
--   order by minutos_totales desc limit 10;
--
-- Activos en los últimos 7 días:
--   select nombre, email, ultimo_login
--   from admin_listar_usuarios()
--   where ultimo_login > now() - interval '7 days'
--   order by ultimo_login desc;
--
-- Inactivos > 30 días:
--   select nombre, email, ultimo_login
--   from admin_listar_usuarios()
--   where ultimo_login is null or ultimo_login < now() - interval '30 days';
--
-- Sin email confirmado:
--   select nombre, email, alta from admin_listar_usuarios()
--   where email_confirmado = false;
-- =============================================================
