-- Postgres grants EXECUTE on new functions to PUBLIC by default, which
-- anon/authenticated inherit regardless of the earlier per-role revoke.
revoke execute on function public.handle_new_user() from public;
