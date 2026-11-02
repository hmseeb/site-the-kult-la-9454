ALTER TABLE public.events ADD COLUMN slug text;
CREATE UNIQUE INDEX events_slug_unique ON public.events (slug);
CREATE OR REPLACE FUNCTION public.assign_event_slug()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE stem text;
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.slug IS NOT NULL THEN
    NEW.slug := OLD.slug;
  ELSIF NEW.slug IS NULL THEN
    stem := trim(both '-' from regexp_replace(lower(NEW.title), '[^a-z0-9]+', '-', 'g'));
    NEW.slug := coalesce(nullif(left(stem, 100), ''), 'event') || '-' || NEW.id::text;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER events_assign_slug BEFORE INSERT OR UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.assign_event_slug();
UPDATE public.events SET slug = coalesce(nullif(left(trim(both '-' from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g')), 100), ''), 'event') || '-' || id::text WHERE slug IS NULL;
CREATE POLICY "Public can view event archives" ON public.events FOR SELECT TO anon, authenticated USING (COALESCE(ends_at, starts_at) <= now());
COMMENT ON COLUMN public.events.slug IS 'Stable descriptive public URL; preserved when event title changes.';