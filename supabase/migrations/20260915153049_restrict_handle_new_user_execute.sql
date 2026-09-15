-- handle_new_user() should only ever run via the on_auth_user_created
-- trigger, never callable directly by clients over PostgREST.
revoke execute on function public.handle_new_user() from anon, authenticated;
