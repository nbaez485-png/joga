-- Add covering indexes for cosmetic item_key foreign keys.
-- The tables are small today; these indexes keep catalog item delete/update
-- checks and future inventory lookups efficient as cosmetic inventory grows.
CREATE INDEX IF NOT EXISTS cosmetic_inventory_item_key_idx
  ON public.cosmetic_inventory (item_key);

CREATE INDEX IF NOT EXISTS cosmetic_equipped_item_key_idx
  ON public.cosmetic_equipped (item_key);
