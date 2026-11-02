import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { Cta } from "@/components/site/Cta";
import { getPublicEvent } from "@/lib/events.functions";
import { isEventIdentifier, isPastEvent, eventSchema } from "@/lib/event-lifecycle";

export const Route = createFileRoute("/events/$eventId")({
  staticData: { sitemap: true },
  loader: async ({ params }) => {
    if (!isEventIdentifier(params.eventId)) throw notFound();
    const event = await getPublicEvent({ data: { id: params.eventId } });
    if (!event) throw notFound();
    if (event.slug && params.eventId !== event.slug) throw redirect({ to: "/events/$eventId", params: { eventId: event.slug }, statusCode: 301 });
    return { ...event, past: isPastEvent(event) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Event not found — The Kult LA" },
          { name: "description", content: "This event is no longer available." },
          { name: "robots", content: "noindex" },
          { property: "og:title", content: "Event not found — The Kult LA" },
          { property: "og:description", content: "This event is no longer available." },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
        ],
      };
    }
    const canonical = `https://thekultla.com/events/${loaderData.slug ?? loaderData.id}`;
    const description = loaderData.description?.replace(/\s+/g, " ").trim() ||
      `${formatWhen(loaderData.starts_at, loaderData.ends_at)} at The Kult LA in Downtown Los Angeles.`;
    const meta = [
      { title: `${loaderData.title}${loaderData.past ? " — Past Event" : ""} — The Kult LA` },
      { name: "description", content: description.slice(0, 160) },
      { property: "og:title", content: `${loaderData.title}${loaderData.past ? " — Past Event" : ""} — The Kult LA` },
      { property: "og:description", content: description.slice(0, 200) },
      { property: "og:url", content: canonical },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    return { meta, links: [{ rel: "canonical", href: canonical }], scripts: [{ type: "application/ld+json", children: JSON.stringify(eventSchema(loaderData, canonical)) }] };
  },
  notFoundComponent: EventNotFound,
  component: EventDetailPage,
});

function formatWhen(startsAt: string, endsAt: string | null) {
  const start = new Date(startsAt);
  const date = start.toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const time = start.toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit",
  });
  const end = endsAt
    ? new Date(endsAt).toLocaleTimeString("en-US", {
        timeZone: "America/Los_Angeles",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;
  return `${date} · ${time}${end ? `–${end}` : ""} PT`;
}

function EventDetailPage() {
  const event = Route.useLoaderData();
  return (
    <main className="mx-auto max-w-[1200px] px-5 pb-32 pt-32 lg:px-10 lg:pt-40">
      <Link to="/events" className="label-xs text-brass transition-colors hover:text-amber">
        ← All Upcoming Events
      </Link>
      <article className={`mt-10 grid gap-10 lg:gap-16 ${event.image_url ? "lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]" : ""}`}>
        {event.image_url && (
          <div className="bg-charcoal p-3">
            <img src={event.image_url} alt={`${event.title} ticket artwork`} className="max-h-[760px] w-full object-contain" />
          </div>
        )}
        <div className="self-center">
          <p className="text-[0.7rem] uppercase tracking-[0.18em] text-brass">{formatWhen(event.starts_at, event.ends_at)}</p>
          {event.past && <p className="label-xs mt-4 text-brass">Past event · Ticket sales closed</p>}
          <h1 className="display mt-5 text-4xl tracking-tight sm:text-5xl lg:text-7xl">{event.title}</h1>
          {event.location && <p className="mt-5 text-sm text-muted-foreground">{event.location}</p>}
          {event.description && <p className="mt-8 whitespace-pre-line text-base leading-relaxed text-muted-foreground">{event.description}</p>}
          <div className="mt-10 flex flex-wrap gap-3">
            {event.past ? <Cta to="/events">View Upcoming Events</Cta> : event.payment_url ? <Cta href={event.payment_url}>Get Tickets</Cta> : <Cta to="/contact">Inquire</Cta>}
            <Cta to="/events" variant="outline">All Events</Cta>
          </div>
        </div>
      </article>
    </main>
  );
}

function EventNotFound() {
  return (
    <main className="mx-auto max-w-[900px] px-5 py-40 text-center lg:px-10">
      <p className="label-xs">Event unavailable</p>
      <h1 className="display mt-4 text-4xl">This event is no longer available.</h1>
      <p className="mt-4 text-muted-foreground">See the current lineup at The Kult LA.</p>
      <div className="mt-8"><Cta to="/events">View Upcoming Events</Cta></div>
    </main>
  );
}