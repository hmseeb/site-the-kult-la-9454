import { createFileRoute, Link } from "@tanstack/react-router";
import { Cta, Label, SectionHead } from "@/components/site/Cta";
import { HeroCarousel, HeroBackdrop, HeroDots } from "@/components/site/HeroCarousel";
import { SpaceCarousel } from "@/components/site/SpaceCarousel";
import { listPublicEvents } from "@/lib/events.functions";

import {
  caseStudies,
  
  eventsByGroup,
  featureStrip,
  groupOrder,
  groups,
  realImages,
  venue,
} from "@/lib/site";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  loader: () => listPublicEvents(),
  head: () => ({
    meta: [
      { property: "og:url", content: "https://thekultla.com/" },
      { title: "Event Venue Rental in Downtown Los Angeles | The Kult LA" },
      {
        name: "description",
        content:
          "Rent The Kult LA in Downtown Los Angeles: a private theater, lounge and rooftop for weddings, corporate events, screenings and celebrations. Check your date.",
      },
      { property: "og:title", content: "Event Venue Rental in Downtown Los Angeles | The Kult LA" },
      {
        property: "og:description",
        content:
          "Rent The Kult LA in Downtown Los Angeles: a private theater, lounge and rooftop for weddings, corporate events, screenings and celebrations. Check your date.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://thekultla.com/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EventVenue",
          "@id": "https://thekultla.com/#venue",
          name: "The Kult LA",
          url: "https://thekultla.com/",
          image: "https://kult-space-reimagined.lovable.app/og-preview.png",
          description:
            "A cinematic event venue in Downtown Los Angeles with a theater, lounge and rooftop terrace for screenings, premieres, concerts, corporate events and weddings.",
          telephone: "+1-310-995-1070",
          email: "info@thekultla.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "251 S. Main Street",
            addressLocality: "Los Angeles",
            addressRegion: "CA",
            addressCountry: "US",
          },
          amenityFeature: ["Theater", "Lounge", "Rooftop terrace"].map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* 00 — NEXT EVENT BANNER */}
      <NextEventBanner />

      {/* 01 — HERO */}
      <HeroCarousel>
        <section className="relative grain min-h-[88vh] w-full overflow-hidden">
          <HeroBackdrop />

          <div className="relative mx-auto flex min-h-[88vh] max-w-[1440px] flex-col justify-end px-5 pb-12 pt-32 sm:pb-16 sm:pt-36 lg:px-10 lg:pb-20">
            <div className="rise max-w-4xl">
              <p className="display text-xs uppercase tracking-[0.42em] text-brass sm:text-sm">
                THEATER · LOUNGE · ROOFTOP — 251 S. MAIN ST, DTLA
              </p>
              <h1 className="mt-5 text-[2.5rem] leading-[0.95] sm:text-[3.75rem] sm:leading-[0.95] lg:text-[5.5rem] lg:leading-[0.95]">
                Where DTLA Comes to Celebrate.
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-cream/80 sm:mt-7 sm:text-base">
                Premieres, weddings, concerts and everything in between — across a theater, lounge and rooftop.
              </p>

              <div className="mt-7 flex flex-col items-stretch gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
                <Cta to="/contact">Book the Venue</Cta>
                <Cta to="/contact" variant="outline">
                  Schedule a Tour
                </Cta>
              </div>
              <HeroDots className="mt-8" />
            </div>
          </div>
          <div className="relative border-t border-border bg-background/70 backdrop-blur">
            <ul className="mx-auto flex max-w-[1440px] flex-wrap gap-x-10 gap-y-3 px-5 py-5 text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground lg:px-10">
              {featureStrip.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="h-1 w-1 shrink-0 bg-brass" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </HeroCarousel>

      {/* 02 — THE EMPTY SPACE CAROUSEL */}
      <section className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Label>The space itself</Label>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl">
              Walk Through the Empty Venue
            </h2>
          </div>
          <Cta to="/the-space" variant="text">
            See every zone
          </Cta>
        </div>
        <div className="mt-8">
          <SpaceCarousel />
        </div>
      </section>


      {/* 03 — UPCOMING EVENTS */}
      <UpcomingEventsStrip />


      {/* 04 — EVENT TYPES */}
      <section className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
        <SectionHead number="02" label="Event types" title="What Are You Creating?" />
        <div className="mt-12 grid gap-px bg-border sm:grid-cols-2">
          {groupOrder.map((g) => (
            <Link
              key={g}
              to="/event-types"
              className="group relative min-h-[320px] overflow-hidden bg-background"
            >
              <img
                src={groups[g].image}
                alt={groups[g].title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-55 transition-all duration-[1200ms] group-hover:scale-105 group-hover:opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="relative flex h-full flex-col justify-end p-7">
                <Label>{groups[g].label}</Label>
                <h3 className="mt-3 text-2xl lg:text-4xl">{groups[g].title}</h3>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[0.65rem] uppercase tracking-[0.16em] text-brass">
                  {eventsByGroup(g).slice(0, 5).map((e) => (
                    <li key={e.slug}>{e.name}</li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Cta to="/event-types" variant="outline">
            View All Event Types
          </Cta>
        </div>
      </section>




      {/* 06 — WEDDINGS */}
      <section className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="flex flex-col justify-center">
            <Label>Weddings</Label>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-6xl">
              Vows on the Rooftop.
              <br />
              <span className="text-brass">Reception in the Theater.</span>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
              Ceremony under a floral arch above Downtown Los Angeles, cocktails at golden hour,
              then dinner and dancing inside. Decor, styling and layout planned with you.
            </p>
            <ul className="mt-7 grid gap-2 text-sm text-cream/80 sm:grid-cols-2">
              {[
                "Floral arch and aisle styling",
                "Rooftop cocktail hour",
                "Wardrobe and styling room",
                "Big-screen slideshows",
              ].map((f) => (
                <li key={f} className="hairline pt-2">
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <Cta to="/event-types/weddings">Explore Weddings</Cta>

              <Cta to="/gallery" search={{ filter: "Weddings" }} variant="outline">
                Wedding Photos
              </Cta>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <img
              src={realImages.wedRooftopBalloonLoungeCover}
              alt="A rooftop wedding lounge at night under white balloon arches and string lights"
              loading="lazy"
              className="col-span-2 aspect-16/10 w-full object-cover"
            />
            <img
              src={realImages.wedRooftopGuestsChampagne}
              alt="Guests with champagne in the rooftop lounge beneath a shade umbrella"
              loading="lazy"
              className="aspect-4/5 w-full object-cover"
            />
            <img
              src={realImages.wedLobbyCeremonySetup}
              alt="The lobby styled for a ceremony with florals, candles and gold seating"
              loading="lazy"
              className="aspect-4/5 w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 07 — PAST EVENTS */}
      <section className="border-y border-border bg-charcoal">
        <div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
          <SectionHead number="04" label="Past events" title="Hosted at The Kult LA" />
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
            {caseStudies.map((c) => (
              <article key={c.name} className="flex flex-col">

                <div
                  className={
                    "relative aspect-4/3 overflow-hidden " +
                    (c.tone === "light" ? "bg-cream" : "bg-background")
                  }
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className={
                      "h-full w-full " +
                      (c.fit === "cover"
                        ? "object-cover"
                        : c.fit === "poster"
                          ? "object-contain"
                          : "object-contain p-5")
                    }
                  />
                </div>
                <div className="mt-4">
                  <Label>{c.type}</Label>
                  <h3 className="mt-2 text-xl">{c.name}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 08 — LOCATION */}
      <section className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <SectionHead number="05" label="Location" title="In the Center of Downtown LA" />
            <address className="mt-8 space-y-1 text-lg not-italic text-cream">
              <p>The Kult LA</p>
              <p>{venue.street}</p>
              <p>{venue.city}</p>
            </address>
            <div className="mt-6 flex flex-wrap gap-6 text-sm">
              <a href={venue.phoneHref} className="text-cream hover:text-brass">
                {venue.phone}
              </a>
              <a href={venue.emailHref} className="text-cream hover:text-brass">
                {venue.email}
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Cta href={venue.directions}>Get Directions</Cta>
              <Cta to="/contact" variant="outline">
                Parking and Load-In
              </Cta>
            </div>
          </div>
          <div className="min-h-[360px] border border-border">
            <iframe
              title="Map of The Kult LA at 251 S. Main Street, Los Angeles"
              src={venue.mapEmbed}
              loading="lazy"
              className="h-full min-h-[360px] w-full grayscale-[0.4] contrast-125"
            />
          </div>
        </div>
      </section>
    </>
  );
}

function NextEventBanner() {
  const events = Route.useLoaderData();
  const next = events?.[0];
  if (!next) return null;

  const when = new Date(next.starts_at).toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="border-b border-border bg-dark-brass px-5 pb-4 pt-24 text-cream lg:px-10">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-8 gap-y-2">
        <p className="min-w-0 text-[0.7rem] font-medium uppercase tracking-[0.18em]">
          <span>Next up · {when} PT — </span>
          <Link to="/events/$eventId" params={{ eventId: next.slug ?? next.id }} className="normal-case tracking-normal transition-opacity hover:opacity-70">
            {next.title}
          </Link>
          {next.location && <span className="hidden sm:inline"> · {next.location}</span>}
        </p>
        {next.payment_url ? (
          <a
            href={next.payment_url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-[0.7rem] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-70"
          >
            Get Tickets →
          </a>
        ) : (
          <Link
            to="/events/$eventId"
            params={{ eventId: next.slug ?? next.id }}
            className="shrink-0 text-[0.7rem] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-70"
          >
            Details →
          </Link>
        )}
      </div>
    </div>
  );
}

function UpcomingEventsStrip() {
  const events = Route.useLoaderData();
  if (!events || events.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Label>What's on</Label>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl">Upcoming Events</h2>
        </div>
        <Cta to="/events" variant="text">
          See all events
        </Cta>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.slice(0, 3).map((ev) => (
          <article key={ev.id} className="border border-border bg-background p-7">
            {ev.image_url && (
              <Link to="/events/$eventId" params={{ eventId: ev.slug ?? ev.id }} aria-label={`View ${ev.title}`}>
                <img
                  src={ev.image_url}
                  alt={`${ev.title} ticket artwork`}
                  loading="lazy"
                  className="mb-6 h-[320px] w-full bg-charcoal object-contain p-2 transition-opacity hover:opacity-80"
                />
              </Link>
            )}
            <p className="text-[0.7rem] uppercase tracking-[0.18em] text-brass">
              {new Date(ev.starts_at).toLocaleString("en-US", {
                timeZone: "America/Los_Angeles",
                month: "short",
                day: "numeric",
                hour: "numeric",
                 minute: "2-digit",
              })} PT
            </p>
            <h3 className="display mt-3 text-2xl tracking-tight">
              <Link to="/events/$eventId" params={{ eventId: ev.slug ?? ev.id }} className="transition-colors hover:text-brass">
                {ev.title}
              </Link>
            </h3>
            {ev.location && <p className="mt-2 text-sm text-muted-foreground">{ev.location}</p>}
            {ev.description && (
              <p className="mt-3 line-clamp-6 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {ev.description}
              </p>
            )}
            <div className="mt-5">
              {ev.payment_url ? (
                <Cta href={ev.payment_url} variant="text">
                  Get tickets
                </Cta>
              ) : (
                <Link to="/events/$eventId" params={{ eventId: ev.slug ?? ev.id }} className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-brass underline-offset-8 transition-all duration-300 hover:text-amber hover:underline">
                  Details
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

