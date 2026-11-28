-- JOGA cosmetics foundation: inventory, creator entitlements, and safe equipment RPC.
create table if not exists public.cosmetic_catalog (
  item_key text primary key,
  slot text not null check (slot in ('ring','banner','title')),
  display_name text not null,
  rarity text not null check (rarity in ('common','bronze','silver','gold','diamond','special')),
  animated boolean not null default false,
  css_class text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.cosmetic_inventory (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_key text not null references public.cosmetic_catalog(item_key) on delete restrict,
  granted_at timestamptz not null default now(),
  grant_source text not null default 'starter' check (grant_source in ('starter','achievement','event','purchase','creator')),
  primary key (user_id,item_key)
);
create table if not exists public.cosmetic_equipped (
  user_id uuid not null references auth.users(id) on delete cascade,
  slot text not null check (slot in ('ring','banner','title')),
  item_key text not null references public.cosmetic_catalog(item_key) on delete restrict,
  updated_at timestamptz not null default now(),
  primary key (user_id,slot)
);
create table if not exists public.creator_entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  entitlement text not null check (entitlement in ('creator')),
  granted_at timestamptz not null default now(),
  granted_by text not null default 'owner_setup'
);

insert into public.cosmetic_catalog(item_key,slot,display_name,rarity,animated,css_class)
values
 ('starter_ring','ring','Inicial','common',false,'ring-default'),
 ('bronze_ring','ring','Bronce','bronze',false,'ring-bronze'),
 ('silver_ring','ring','Plata','silver',false,'ring-silver'),
 ('gold_ring','ring','Oro','gold',false,'ring-gold'),
 ('diamond_ring','ring','Diamante','diamond',false,'ring-diamond'),
 ('fire_ring','ring','Fuego','special',true,'ring-fire'),
 ('electric_ring','ring','Eléctrico','special',true,'ring-electric'),
 ('rainbow_ring','ring','Multicolor','special',true,'ring-rainbow'),
 ('neon_ring','ring','Neón','special',true,'ring-neon'),
 ('starter_banner','banner','Inicial','common',false,'banner-default'),
 ('premium_banner','banner','Premium','special',false,'banner-premium'),
 ('elite_banner','banner','Elite','special',true,'banner-elite'),
 ('creator_banner','banner','Creador','special',true,'banner-creator')
on conflict(item_key) do update set
 display_name=excluded.display_name, slot=excluded.slot, rarity=excluded.rarity,
 animated=excluded.animated, css_class=excluded.css_class, active=true;

alter table public.cosmetic_catalog enable row level security;
alter table public.cosmetic_inventory enable row level security;
alter table public.cosmetic_equipped enable row level security;
alter table public.creator_entitlements enable row level security;

revoke all on public.cosmetic_catalog,public.cosmetic_inventory,public.cosmetic_equipped,public.creator_entitlements from anon,authenticated;
grant select on public.cosmetic_catalog to authenticated;
grant select on public.cosmetic_inventory to authenticated;
grant select on public.cosmetic_equipped to authenticated;
grant select on public.creator_entitlements to authenticated;

drop policy if exists "catalog active items readable" on public.cosmetic_catalog;
create policy "catalog active items readable" on public.cosmetic_catalog for select to authenticated using (active);
drop policy if exists "inventory own read" on public.cosmetic_inventory;
create policy "inventory own read" on public.cosmetic_inventory for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "equipped read" on public.cosmetic_equipped;
create policy "equipped read" on public.cosmetic_equipped for select to authenticated using (true);
drop policy if exists "creator entitlement own read" on public.creator_entitlements;
create policy "creator entitlement own read" on public.creator_entitlements for select to authenticated using (user_id = (select auth.uid()));

create or replace function public.equip_cosmetic(p_item_key text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_slot text;
  v_is_creator boolean;
  v_owned boolean;
begin
  if v_uid is null then raise exception 'authentication required'; end if;
  select c.slot into v_slot from public.cosmetic_catalog c
   where c.item_key = p_item_key and c.active = true;
  if v_slot is null then raise exception 'cosmetic unavailable'; end if;
  select exists(select 1 from public.creator_entitlements ce where ce.user_id=v_uid and ce.entitlement='creator') into v_is_creator;
  select exists(select 1 from public.cosmetic_inventory ci where ci.user_id=v_uid and ci.item_key=p_item_key) into v_owned;
  if not (v_is_creator or v_owned) then raise exception 'cosmetic not unlocked'; end if;
  insert into public.cosmetic_equipped(user_id,slot,item_key,updated_at)
  values(v_uid,v_slot,p_item_key,now())
  on conflict(user_id,slot) do update set item_key=excluded.item_key,updated_at=now();
  return v_slot;
end;
$$;
revoke all on function public.equip_cosmetic(text) from public,anon;
grant execute on function public.equip_cosmetic(text) to authenticated;

create or replace function public.seed_cosmetic_starter()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
 insert into public.cosmetic_inventory(user_id,item_key,grant_source) values(new.id,'starter_ring','starter') on conflict do nothing;
 insert into public.cosmetic_equipped(user_id,slot,item_key) values(new.id,'ring','starter_ring') on conflict do nothing;
 insert into public.cosmetic_inventory(user_id,item_key,grant_source) values(new.id,'starter_banner','starter') on conflict do nothing;
 insert into public.cosmetic_equipped(user_id,slot,item_key) values(new.id,'banner','starter_banner') on conflict do nothing;
 return new;
end;
$$;
revoke all on function public.seed_cosmetic_starter() from public,anon,authenticated;
drop trigger if exists profiles_seed_cosmetics on public.profiles;
create trigger profiles_seed_cosmetics after insert on public.profiles
for each row execute function public.seed_cosmetic_starter();

insert into public.cosmetic_inventory(user_id,item_key,grant_source)
select p.id,'starter_ring','starter' from public.profiles p on conflict do nothing;
insert into public.cosmetic_equipped(user_id,slot,item_key)
select p.id,'ring','starter_ring' from public.profiles p on conflict do nothing;
insert into public.cosmetic_inventory(user_id,item_key,grant_source)
select p.id,'starter_banner','starter' from public.profiles p on conflict do nothing;
insert into public.cosmetic_equipped(user_id,slot,item_key)
select p.id,'banner','starter_banner' from public.profiles p on conflict do nothing;
