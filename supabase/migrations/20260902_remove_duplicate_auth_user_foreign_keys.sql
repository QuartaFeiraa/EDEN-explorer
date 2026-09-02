-- Remove only the duplicate constraints introduced by the 2026-09-02 ownership audit.
-- The original *_user_id_fkey / profiles_id_fkey constraints already enforce
-- the same CASCADE / SET NULL behavior and remain in place.

alter table public.profiles drop constraint if exists profiles_auth_user_fk;
alter table public.ai_usage drop constraint if exists ai_usage_auth_user_fk;
alter table public.caderno_erros drop constraint if exists caderno_erros_auth_user_fk;
alter table public.contest_watchlist drop constraint if exists contest_watchlist_auth_user_fk;
alter table public.course_progress drop constraint if exists course_progress_auth_user_fk;
alter table public.edital_imports drop constraint if exists edital_imports_auth_user_fk;
alter table public.payment_events drop constraint if exists payment_events_auth_user_fk;
alter table public.plano_tarefas drop constraint if exists plano_tarefas_auth_user_fk;
alter table public.product_events drop constraint if exists product_events_auth_user_fk;
alter table public.push_subscriptions drop constraint if exists push_subscriptions_auth_user_fk;
alter table public.sessoes_estudo drop constraint if exists sessoes_estudo_auth_user_fk;
alter table public.study_sessions drop constraint if exists study_sessions_auth_user_fk;
alter table public.subscriptions drop constraint if exists subscriptions_auth_user_fk;
alter table public.user_concursos drop constraint if exists user_concursos_auth_user_fk;
alter table public.user_consents drop constraint if exists user_consents_auth_user_fk;
alter table public.user_goals drop constraint if exists user_goals_auth_user_fk;
alter table public.user_preferences drop constraint if exists user_preferences_auth_user_fk;
