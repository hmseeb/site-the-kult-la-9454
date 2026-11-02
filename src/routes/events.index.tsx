import { createFileRoute, Link } from "@tanstack/react-router";
import { listPublicEvents } from "@/lib/events.functions";
import { Cta } from "@/components/site/Cta";

export const Route = createFileRoute("/events/")({
  staticData: { sitemap: true },
  loader: () => listPublicEvents(),
  head: () => ({
    meta: [
      { property: "og:url", content: "https://thekultla.com/events" },
      { title: "Upcoming Events at The Kult LA — DTLA Theater, Lounge & Rooftop" },
      {
        name: "description",
        content:
          "Screenings, concerts, parties and celebrations coming up at The Kult LA, 251 S. Main Street in Downtown Los Angeles.",
      },
      { property: "og:title", content: "Upcoming Events at The Kult LA" },
      {
        property: "og:description",
        content:
          "See what's coming up at The Kult LA — screenings, concerts and celebrations in Downtown Los Angeles.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://thekultla.com/events" }],
  }),
  errorComponent: () => (
    <div className="mx-auto max-w-[900px] px-5 py-40 text-center lg:px-10">
      <h1 className="display text-4xl">Events are unavailable right now</h1>
      <p className="mt-4 text-muted-foreground">Please try again in a moment.</p>
    </div>
  ),
  component: EventsPage,
});

function formatWhen(startsAt: string, endsAt: string | null) {
  const start = new Date(startsAt);
  const date = start.toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "long",
    month: "long",
    day: "numeric",
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

function EventsPage() {
  const events = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-[1200px] px-5 pb-32 pt-32 lg:px-10 lg:pt-40">
      <p className="label-xs">What's On</p>
      <h1 className="display mt-4 text-5xl tracking-tight lg:text-7xl">Upcoming Events</h1>
      <p className="mt-6 max-w-2xl text-muted-foreground">
        Screenings, concerts and celebrations at 251 S. Main Street, Downtown Los Angeles.
      </p>

      {events.length === 0 ? (
        <div className="mt-16 border border-border bg-secondary/30 p-10">
          <p className="display text-2xl">No public events on the calendar right now.</p>
          <p className="mt-3 text-muted-foreground">
            Private bookings run all week — tell us what you're planning.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Cta to="/contact">Book the Venue</Cta>
            <Cta to="/contact" variant="outline">
              Schedule a Tour
            </Cta>
          </div>
        </div>
      ) : (
        <div className="mt-16 divide-y divide-border border-t border-border">
          {events.map((ev) => (
            <article
              key={ev.id}
              className={`grid gap-6 py-10 md:items-start ${
                ev.image_url
                  ? "md:grid-cols-[minmax(0,240px)_1fr_auto]"
                  : "md:grid-cols-[1fr_auto]"
              }`}
            >
              {ev.image_url && (
                <Link to="/events/$eventId" params={{ eventId: ev.slug ?? ev.id }} aria-label={`View ${ev.title}`}>
                  <img
                    src={ev.image_url}
                    alt={`${ev.title} ticket artwork`}
                    className="max-h-[440px] w-full bg-charcoal object-contain p-2 transition-opacity hover:opacity-80 md:max-h-none"
                  />
                </Link>
              )}
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.18em] text-brass">
                  {formatWhen(ev.starts_at, ev.ends_at)}
                </p>
                <h2 className="display mt-3 text-3xl tracking-tight lg:text-4xl">
                  <Link to="/events/$eventId" params={{ eventId: ev.slug ?? ev.id }} className="transition-colors hover:text-brass">
                    {ev.title}
                  </Link>
                </h2>
                {ev.location && (
                  <p className="mt-2 text-sm text-muted-foreground">{ev.location}</p>
                )}
                {ev.description && (
                  <p className="mt-4 max-w-2xl whitespace-pre-line leading-relaxed text-muted-foreground">
                    {ev.description}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {ev.payment_url ? (
                  <Cta href={ev.payment_url}>Get Tickets</Cta>
                ) : (
                  <Cta to="/contact" variant="outline">
                    Inquire
                  </Cta>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="mt-20 text-sm text-muted-foreground">
        Looking to host your own?{" "}
        <Link to="/contact" className="text-brass hover:text-amber">
          Start an inquiry
        </Link>
        .
      </p>
    </div>
  );
}
