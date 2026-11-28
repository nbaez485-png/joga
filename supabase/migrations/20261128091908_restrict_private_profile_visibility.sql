-- Respect private profile visibility, while allowing self and match-context profile display.
DROP POLICY IF EXISTS profiles_select ON public.profiles;

CREATE POLICY profiles_select ON public.profiles
FOR SELECT TO authenticated
USING (
  visibility = 'public'
  OR id = (SELECT auth.uid())
  OR EXISTS (
    SELECT 1
    FROM public.match_participants mp
    WHERE mp.user_id = profiles.id
      AND private.can_view_match(mp.match_id, (SELECT auth.uid()))
  )
);
