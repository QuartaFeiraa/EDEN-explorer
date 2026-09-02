-- EDEN RUMO: least-privilege Data API grants.
-- RLS remains the row-level boundary; these grants constrain which operations
-- client roles can reach at all. Service-role/server permissions are unchanged.

revoke all privileges on table public.ai_usage from anon, authenticated;
grant select, insert on table public.ai_usage to authenticated;

revoke all privileges on table public.caderno_erros from anon, authenticated;
grant select, insert, update, delete on table public.caderno_erros to authenticated;

revoke all privileges on table public.concursos from anon, authenticated;
grant select on table public.concursos to anon, authenticated;

revoke all privileges on table public.content_assets from anon, authenticated;
revoke all privileges on table public.content_imports from anon, authenticated;

revoke all privileges on table public.content_courses from anon, authenticated;
grant select on table public.content_courses to anon, authenticated;
revoke all privileges on table public.content_modules from anon, authenticated;
grant select on table public.content_modules to anon, authenticated;
revoke all privileges on table public.content_lessons from anon, authenticated;
grant select on table public.content_lessons to anon, authenticated;
revoke all privileges on table public.content_questions from anon, authenticated;
grant select on table public.content_questions to anon, authenticated;
revoke all privileges on table public.content_sources from anon, authenticated;
grant select on table public.content_sources to anon, authenticated;
revoke all privileges on table public.contest_content_map from anon, authenticated;
grant select on table public.contest_content_map to anon, authenticated;

revoke all privileges on table public.contest_watchlist from anon, authenticated;
grant select, insert, delete on table public.contest_watchlist to authenticated;

revoke all privileges on table public.course_progress from anon, authenticated;
grant select, insert, update on table public.course_progress to authenticated;

revoke all privileges on table public.edital_imports from anon, authenticated;
grant select, insert, update, delete on table public.edital_imports to authenticated;

revoke all privileges on table public.materias from anon, authenticated;
grant select, insert, update, delete on table public.materias to authenticated;

revoke all privileges on table public.payment_events from anon, authenticated;

revoke all privileges on table public.plano_tarefas from anon, authenticated;
grant select, insert, update, delete on table public.plano_tarefas to authenticated;

revoke all privileges on table public.product_events from anon, authenticated;
grant select, insert on table public.product_events to authenticated;

revoke all privileges on table public.profiles from anon, authenticated;
grant select, insert, update on table public.profiles to authenticated;

revoke all privileges on table public.push_subscriptions from anon, authenticated;
grant select, insert, update, delete on table public.push_subscriptions to authenticated;

revoke all privileges on table public.radar_refresh_runs from anon, authenticated;
revoke all privileges on table public.radar_sources from anon, authenticated;

revoke all privileges on table public.sessoes_estudo from anon, authenticated;
grant select, insert, update, delete on table public.sessoes_estudo to authenticated;

revoke all privileges on table public.study_resources from anon, authenticated;
grant select on table public.study_resources to anon, authenticated;

revoke all privileges on table public.study_sessions from anon, authenticated;
grant select, insert, update, delete on table public.study_sessions to authenticated;

revoke all privileges on table public.subscriptions from anon, authenticated;
grant select on table public.subscriptions to authenticated;

revoke all privileges on table public.topicos from anon, authenticated;
grant select, insert, update, delete on table public.topicos to authenticated;

revoke all privileges on table public.user_concursos from anon, authenticated;
grant select, insert, update, delete on table public.user_concursos to authenticated;

revoke all privileges on table public.user_consents from anon, authenticated;
grant select, insert, update, delete on table public.user_consents to authenticated;

revoke all privileges on table public.user_goals from anon, authenticated;
grant select, insert, update, delete on table public.user_goals to authenticated;

revoke all privileges on table public.user_preferences from anon, authenticated;
grant select, insert, update, delete on table public.user_preferences to authenticated;

-- Secure-by-default for future objects. Every new exposed table/function must
-- receive deliberate grants in its migration instead of inheriting broad API access.
alter default privileges for role postgres in schema public
  revoke select, insert, update, delete, truncate, references, trigger on tables from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated;
