-- Harden the auth trigger against future search_path/object-shadowing risks.
-- Keep all referenced objects explicit and keep browser roles unable to call it.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  insert into public.profiles (id, nome)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'display_name',
      pg_catalog.split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do update set
    nome = coalesce(excluded.nome, public.profiles.nome),
    atualizado_em = pg_catalog.now();
  return new;
end;
$function$;

revoke all on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.handle_new_user() to service_role;
