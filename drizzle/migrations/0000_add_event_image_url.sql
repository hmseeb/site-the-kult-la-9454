ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url TEXT;
COMMENT ON COLUMN public.events.image_url IS 'Public URL for the event ticket image uploaded by an administrator.';