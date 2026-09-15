create or replace function public.rumo_check_answer(p_question_id uuid, p_selected_answer text, p_elapsed_seconds integer default null)
returns table(is_correct boolean, correct_answer text, explanation text)
language plpgsql security definer set search_path=''
as $$
declare v_correct text; v_explanation text; v_user uuid;
begin
  if p_selected_answer is null or char_length(trim(p_selected_answer)) > 8 then raise exception 'invalid_answer'; end if;
  select s.correct_answer,s.explanation into v_correct,v_explanation
  from public.question_solutions s join public.question_bank q on q.id=s.question_id
  where q.id=p_question_id and q.active=true and q.verified=true;
  if not found then raise exception 'question_not_available'; end if;
  is_correct:=upper(trim(p_selected_answer))=upper(trim(v_correct));
  correct_answer:=v_correct; explanation:=v_explanation; v_user:=auth.uid();
  if v_user is not null then
    insert into public.question_attempts(user_id,question_id,selected_answer,correct,elapsed_seconds)
    values(v_user,p_question_id,upper(trim(p_selected_answer)),is_correct,p_elapsed_seconds);
  end if;
  return next;
end;
$$;
revoke all on function public.rumo_check_answer(uuid,text,integer) from public;
grant execute on function public.rumo_check_answer(uuid,text,integer) to anon, authenticated;
