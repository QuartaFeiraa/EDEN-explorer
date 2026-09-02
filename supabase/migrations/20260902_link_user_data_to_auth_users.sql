-- EDEN RUMO: enforce ownership integrity at the database boundary.
-- User-owned product data is removed with the Auth user. Payment event history
-- keeps its provider/audit record while dropping the direct user identifier.

alter table public.profiles
  add constraint profiles_auth_user_fk foreign key (id) references auth.users(id) on delete cascade;

alter table public.ai_usage
  add constraint ai_usage_auth_user_fk foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.caderno_erros
  add constraint caderno_erros_auth_user_fk foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.contest_watchlist
  add constraint contest_watchlist_auth_user_fk foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.course_progress
  add constraint course_progress_auth_user_fk foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.edital_imports
  add constraint edital_imports_auth_user_fk foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.plano_tarefas
  add constraint plano_tarefas_auth_user_fk foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.product_events
  add constraint product_events_auth_user_fk foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.push_subscriptions
  add constraint push_subscriptions_auth_user_fk foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.sessoes_estudo
  add constraint sessoes_estudo_auth_user_fk foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.study_sessions
  add constraint study_sessions_auth_user_fk foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.subscriptions
  add constraint subscriptions_auth_user_fk foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.user_concursos
  add constraint user_concursos_auth_user_fk foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.user_consents
  add constraint user_consents_auth_user_fk foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.user_goals
  add constraint user_goals_auth_user_fk foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.user_preferences
  add constraint user_preferences_auth_user_fk foreign key (user_id) references auth.users(id) on delete cascade;

alter table public.payment_events
  add constraint payment_events_auth_user_fk foreign key (user_id) references auth.users(id) on delete set null;
