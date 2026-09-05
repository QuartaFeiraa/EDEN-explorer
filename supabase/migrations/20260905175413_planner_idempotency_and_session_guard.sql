-- RUMO: make adaptive plan generation idempotent across retries/tabs and
-- require a real Supabase Auth session for destructive account deletion.

do $$
begin
  if not exists (
    select 1
    from pg_catalog.pg_constraint
    where conrelid = 'public.plano_tarefas'::pg_catalog.regclass
      and conname = 'plano_tarefas_unique_plan_slot'
  ) then
    alter table public.plano_tarefas
      add constraint plano_tarefas_unique_plan_slot
      unique (user_id, data, topico_id, tipo);
  end if;
end
$$;

create or replace function public.rumo_session_active(
  p_user_id uuid,
  p_session_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.sessions as s
    where s.user_id = p_user_id
      and s.id = p_session_id
  );
$$;

revoke all on function public.rumo_session_active(uuid, uuid) from public;
revoke all on function public.rumo_session_active(uuid, uuid) from anon, authenticated;
grant execute on function public.rumo_session_active(uuid, uuid) to service_role;

create or replace function public.rumo_user_owns_storage_objects(
  p_user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from storage.objects as o
    where o.owner = p_user_id
       or o.owner_id = p_user_id::pg_catalog.text
  );
$$;

revoke all on function public.rumo_user_owns_storage_objects(uuid) from public;
revoke all on function public.rumo_user_owns_storage_objects(uuid) from anon, authenticated;
grant execute on function public.rumo_user_owns_storage_objects(uuid) to service_role;
