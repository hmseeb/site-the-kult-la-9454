import { isPastEvent } from "./event-lifecycle";

export type SiteEvent = {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  payment_url: string | null;
  image_url: string | null;
  image_path: string | null;
};

// Events are managed in the website admin on LeadrVision and read from its public endpoint.
const EVENTS_URL = "https://vision.leadrai.com/api/forms/20b4ddfcb5b19681843dfc18c63f4ee0/events";

type RemoteEvent = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  cta_url: string | null;
  image_url: string | null;
  updated_at: string;
};

function toSiteEvent(e: RemoteEvent): SiteEvent {
  return {
    id: e.id,
    slug: e.slug,
    title: e.title,
    description: e.description,
    starts_at: e.starts_at,
    ends_at: e.ends_at,
    location: e.location,
    payment_url: e.cta_url,
    image_url: e.image_url,
    image_path: null,
  };
}

async function fetchEvents(failure: string): Promise<RemoteEvent[]> {
  const res = await fetch(EVENTS_URL, { signal: AbortSignal.timeout(8000) }).catch(() => null);
  if (!res?.ok) throw new Error(failure);
  return ((await res.json()) as { events: RemoteEvent[] }).events;
}

/** Same rule as before: still running, or not started yet when it has no end time. */
function isUpcoming(e: Pick<RemoteEvent, "starts_at" | "ends_at">, now: number): boolean {
  return e.ends_at ? new Date(e.ends_at).getTime() > now : new Date(e.starts_at).getTime() > now;
}

export async function listUpcomingEvents(limit = 50): Promise<SiteEvent[]> {
  const now = Date.now();
  // An unreachable events service hides the list; it must never take the page down with it.
  const events = await fetchEvents("Events are temporarily unavailable").catch((err) => {
    console.error(err);
    return [];
  });
  return events.filter((e) => isUpcoming(e, now)).slice(0, limit).map(toSiteEvent);
}

export async function getUpcomingEvent(identifier: string): Promise<SiteEvent | null> {
  const res = await fetch(`${EVENTS_URL}/${encodeURIComponent(identifier)}`, { signal: AbortSignal.timeout(8000) }).catch(() => null);
  if (res?.status === 404) return null;
  if (!res?.ok) throw new Error("This event is temporarily unavailable");
  return toSiteEvent(((await res.json()) as { event: RemoteEvent }).event);
}

/** Sitemap inventory: upcoming events only, with actual content timestamps. */
export async function listSitemapEvents() {
  const now = Date.now();
  const events = await fetchEvents("Event sitemap is temporarily unavailable").catch((err) => {
    console.error(err);
    return [];
  });
  return events
    .filter((e) => !isPastEvent(e, now))
    .map(({ id, slug, updated_at }) => ({ id, slug, updated_at }));
}
