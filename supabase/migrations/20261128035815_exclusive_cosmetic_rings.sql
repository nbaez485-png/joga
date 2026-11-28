insert into public.cosmetic_catalog(item_key,slot,display_name,rarity,animated,css_class,active)
values ('elite_ring','ring','Elite','special',true,'ring-elite',true),
       ('creator_ring','ring','Creador','special',true,'ring-creator',true)
on conflict(item_key) do update set display_name=excluded.display_name,slot=excluded.slot,rarity=excluded.rarity,animated=excluded.animated,css_class=excluded.css_class,active=true;
