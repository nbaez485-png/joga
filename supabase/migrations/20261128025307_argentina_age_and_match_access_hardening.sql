CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated;

DO $$
BEGIN
  IF to_regprocedure('public.can_view_match(uuid,uuid)') IS NOT NULL THEN
    EXECUTE 'ALTER FUNCTION public.can_view_match(uuid, uuid) SET SCHEMA private';
  END IF;
  IF to_regprocedure('public.can_access_match_location(uuid,uuid)') IS NOT NULL THEN
    EXECUTE 'ALTER FUNCTION public.can_access_match_location(uuid, uuid) SET SCHEMA private';
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION private.can_view_match(p_match_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT p_user_id = auth.uid() AND EXISTS (
    SELECT 1
    FROM public.matches m
    WHERE m.id = p_match_id
      AND (
        (m.is_private = false AND m.status IN ('open','full','completed'))
        OR m.organizer_id = auth.uid()
        OR EXISTS (
          SELECT 1
          FROM public.match_participants mp
          WHERE mp.match_id = m.id
            AND mp.user_id = auth.uid()
            AND mp.participant_status IN ('organizer','joined','waitlisted')
        )
      )
  )
$function$;

CREATE OR REPLACE FUNCTION private.can_access_match_location(p_match_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT p_user_id = auth.uid() AND EXISTS (
    SELECT 1
    FROM public.matches m
    WHERE m.id = p_match_id
      AND (
        m.organizer_id = auth.uid()
        OR EXISTS (
          SELECT 1
          FROM public.match_participants mp
          WHERE mp.match_id = m.id
            AND mp.user_id = auth.uid()
            AND mp.participant_status IN ('organizer','joined')
        )
      )
  )
$function$;

REVOKE ALL ON FUNCTION private.can_view_match(uuid, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.can_access_match_location(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.can_view_match(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private.can_access_match_location(uuid, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_username text := lower(btrim(coalesce(new.raw_user_meta_data ->> 'username', '')));
  v_display text := btrim(coalesce(new.raw_user_meta_data ->> 'display_name', ''));
  v_birth date;
  v_today date := timezone('America/Argentina/Buenos_Aires', now())::date;
BEGIN
  BEGIN
    v_birth := (new.raw_user_meta_data ->> 'birth_date')::date;
  EXCEPTION WHEN others THEN
    RAISE EXCEPTION 'birth_date_invalid';
  END;

  IF v_birth IS NULL OR v_birth < DATE '1900-01-01' THEN
    RAISE EXCEPTION 'birth_date_invalid';
  END IF;
  IF v_birth > (v_today - INTERVAL '13 years')::date THEN
    RAISE EXCEPTION 'age_below_minimum';
  END IF;

  IF v_display = '' THEN
    v_display := v_username;
  END IF;

  INSERT INTO public.profiles (id, username, display_name)
    VALUES (new.id, v_username, v_display);
  INSERT INTO public.profile_details (id) VALUES (new.id);
  INSERT INTO public.profile_private (id, birth_date) VALUES (new.id, v_birth);
  INSERT INTO public.profile_protected (id) VALUES (new.id);

  RETURN new;
END
$function$;

CREATE OR REPLACE FUNCTION public.create_match(
  p_title text,
  p_modality text,
  p_custom_modality text,
  p_match_date date,
  p_start_time time without time zone,
  p_area text,
  p_venue_name text,
  p_venue_type text,
  p_max_players integer,
  p_cost_per_player numeric,
  p_level_hint text,
  p_description text,
  p_is_private boolean,
  p_allow_waitlist boolean,
  p_exact_address text,
  p_location_notes text,
  p_min_age integer DEFAULT NULL,
  p_max_age integer DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_uid uuid := auth.uid();
  v_id uuid;
  v_birth date;
  v_is_minor boolean := false;
  v_today date := timezone('America/Argentina/Buenos_Aires', now())::date;
  v_now time := timezone('America/Argentina/Buenos_Aires', now())::time;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'auth_required';
  END IF;

  IF coalesce(p_is_private, false) THEN
    RAISE EXCEPTION 'private_match_unavailable';
  END IF;

  IF p_match_date < v_today OR (p_match_date = v_today AND p_start_time <= v_now) THEN
    RAISE EXCEPTION 'match_must_be_future';
  END IF;
  IF p_modality NOT IN ('3v3','4v4','5v5','6v6','7v7','8v8','9v9','11v11','otro') THEN
    RAISE EXCEPTION 'invalid_modality';
  END IF;
  IF p_modality = 'otro' AND coalesce(trim(p_custom_modality), '') = '' THEN
    RAISE EXCEPTION 'custom_modality_required';
  END IF;
  IF (p_min_age IS NOT NULL AND (p_min_age < 13 OR p_min_age > 99))
     OR (p_max_age IS NOT NULL AND (p_max_age < 13 OR p_max_age > 99))
     OR (p_min_age IS NOT NULL AND p_max_age IS NOT NULL AND p_min_age > p_max_age) THEN
    RAISE EXCEPTION 'invalid_age_range';
  END IF;

  SELECT birth_date INTO v_birth
  FROM public.profile_private
  WHERE id = v_uid;
  IF v_birth IS NOT NULL THEN
    v_is_minor := v_birth > (v_today - INTERVAL '18 years')::date;
  END IF;

  INSERT INTO public.matches (
    organizer_id,title,modality,custom_modality,match_date,start_time,area,venue_name,venue_type,
    max_players,cost_per_player,level_hint,description,is_private,allow_waitlist,min_age,max_age,organizer_is_minor
  )
  VALUES (
    v_uid,trim(p_title),p_modality,nullif(trim(p_custom_modality),''),p_match_date,p_start_time,trim(p_area),
    nullif(trim(p_venue_name),''),nullif(trim(p_venue_type),''),p_max_players,greatest(coalesce(p_cost_per_player,0),0),
    nullif(trim(p_level_hint),''),coalesce(p_description,''),false,coalesce(p_allow_waitlist,true),
    p_min_age,p_max_age,v_is_minor
  )
  RETURNING id INTO v_id;

  INSERT INTO public.match_participants(match_id,user_id,participant_status)
  VALUES(v_id,v_uid,'organizer');

  IF nullif(trim(p_exact_address),'') IS NOT NULL OR nullif(trim(p_location_notes),'') IS NOT NULL THEN
    INSERT INTO public.match_private_location(match_id,exact_address,location_notes)
    VALUES(v_id,nullif(trim(p_exact_address),''),nullif(trim(p_location_notes),''));
  END IF;

  RETURN v_id;
END
$function$;

REVOKE SELECT ON TABLE public.matches, public.match_participants, public.match_private_location FROM anon;
