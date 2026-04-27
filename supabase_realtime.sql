-- Habilitar Realtime para la tabla estados (para sync entre dispositivos)
-- Ejecuta esto en SQL Editor de Supabase si no lo hiciste antes.

-- Comprobar si ya está añadida
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'estados'
  ) then
    execute 'alter publication supabase_realtime add table public.estados';
  end if;
end $$;
