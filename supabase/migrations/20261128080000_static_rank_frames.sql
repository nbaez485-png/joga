-- JOGA: static PNG rank frames only. Effects/creator/elite cosmetics postponed for later.
ALTER TABLE public.cosmetic_catalog DROP CONSTRAINT IF EXISTS cosmetic_catalog_rarity_check;
ALTER TABLE public.cosmetic_catalog ADD CONSTRAINT cosmetic_catalog_rarity_check CHECK (rarity IN ('common','bronze','silver','gold','platinum','diamond','special'));
UPDATE public.cosmetic_catalog SET active=false WHERE slot='ring' AND item_key NOT IN ('bronze_ring','silver_ring','gold_ring','platinum_ring','diamond_ring');
INSERT INTO public.cosmetic_catalog(item_key,slot,display_name,rarity,animated,css_class,active) VALUES
 ('bronze_ring','ring','Bronce','bronze',false,'ring-bronze',true),
 ('silver_ring','ring','Plata','silver',false,'ring-silver',true),
 ('gold_ring','ring','Oro','gold',false,'ring-gold',true),
 ('platinum_ring','ring','Platino','platinum',false,'ring-platinum',true),
 ('diamond_ring','ring','Diamante','diamond',false,'ring-diamond',true)
ON CONFLICT(item_key) DO UPDATE SET display_name=excluded.display_name,slot=excluded.slot,rarity=excluded.rarity,animated=false,css_class=excluded.css_class,active=true;
-- Grant Bronze as the initial rank to existing profiles and equip it by default.
INSERT INTO public.cosmetic_inventory(user_id,item_key,grant_source) SELECT id,'bronze_ring','starter' FROM public.profiles ON CONFLICT DO NOTHING;
UPDATE public.cosmetic_equipped SET item_key='bronze_ring',updated_at=now() WHERE slot='ring';
INSERT INTO public.cosmetic_equipped(user_id,slot,item_key) SELECT id,'ring','bronze_ring' FROM public.profiles ON CONFLICT(user_id,slot) DO NOTHING;
CREATE OR REPLACE FUNCTION public.seed_cosmetic_starter() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 INSERT INTO public.cosmetic_inventory(user_id,item_key,grant_source) VALUES(new.id,'bronze_ring','starter') ON CONFLICT DO NOTHING;
 INSERT INTO public.cosmetic_equipped(user_id,slot,item_key) VALUES(new.id,'ring','bronze_ring') ON CONFLICT DO NOTHING;
 INSERT INTO public.cosmetic_inventory(user_id,item_key,grant_source) VALUES(new.id,'starter_banner','starter') ON CONFLICT DO NOTHING;
 INSERT INTO public.cosmetic_equipped(user_id,slot,item_key) VALUES(new.id,'banner','starter_banner') ON CONFLICT DO NOTHING;
 RETURN new;
END; $$;
