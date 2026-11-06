begin;
set local role anon;
insert into public.regime_shift_submissions (entry_date,case_study_name,main_contributor,regime_shift_types,latitude,longitude)
values ('2026-11-06','Permission test','Test contributor',array['Freshwater eutrophication'],43.1,-89.4);
do $$ begin
  begin
    perform * from public.regime_shift_submissions;
    raise exception 'FAIL: anonymous read was allowed';
  exception when insufficient_privilege then null; end;
  begin
    update public.regime_shift_submissions set review_status='approved';
    raise exception 'FAIL: anonymous update was allowed';
  exception when insufficient_privilege then null; end;
  begin
    delete from public.regime_shift_submissions;
    raise exception 'FAIL: anonymous delete was allowed';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.regime_shift_submissions (review_status) values ('approved');
    raise exception 'FAIL: anonymous approval was allowed';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.regime_shift_submissions (entry_date,case_study_name,main_contributor,regime_shift_types,latitude,longitude)
    values ('2026-11-06','Permission test','Test contributor',array['Invented category'],43.1,-89.4);
    raise exception 'FAIL: invalid category was allowed';
  exception when check_violation then null; end;
end $$;
rollback;
