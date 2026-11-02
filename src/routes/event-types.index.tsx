import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Cta, Label, SectionHead } from "@/components/site/Cta";
import { eventsByGroup, groupOrder, groups } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/event-types/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://thekultla.com/event-types" },
      { title: "Event Types — 21 Ways to Use The Kult LA" },
      {
        name: "description",
        content:
          "Weddings, corporate events, screenings and premieres, concerts, DJ nights, fashion shows, shoots, pop-ups, exhibitions, festivals, award shows and private celebrations in DTLA.",
      },
      { property: "og:title", content: "Event Types — The Kult LA" },
      {
        property: "og:description",
        content: "Twenty-one ways to transform a cinematic Downtown Los Angeles venue.",
      },
    ],
    links: [{ rel: "canonical", href: "https://thekultla.com/event-types" }],
  }),
  component: EventTypesPage,
});

function EventTypesPage() {
  const [active, setActive] = useState<"all" | (typeof groupOrder)[number]>("all");
  const visible = active === "all" ? groupOrder : [active];

  return (
    <>
      <section className="mx-auto max-w-[1440px] px-5 pb-16 pt-40 lg:px-10">
        <Label>Event Types</Label>
        <h1 className="mt-5 max-w-3xl text-4xl sm:text-6xl lg:text-7xl">
          Every Way to Transform The Kult LA
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          One historic room, one elevated lounge and one rooftop — programmed around whatever you
          are building.
        </p>
        <div className="mt-10 flex flex-wrap gap-2">
          {(["all", ...groupOrder] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setActive(g)}
              className={cn(
                "border px-5 py-2.5 text-[0.65rem] uppercase tracking-[0.18em] transition-colors",
                active === g
                  ? "border-brass text-brass"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {g === "all" ? "All" : groups[g].label}
            </button>
          ))}
        </div>
      </section>

      {visible.map((g) => (
        <section key={g} className="mx-auto max-w-[1440px] px-5 pb-16 lg:px-10">
          <SectionHead label={groups[g].label} title={groups[g].title} copy={groups[g].blurb} />
          <div className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {eventsByGroup(g).map((e) => (
              <Link
                key={e.slug}
                to="/event-types/$slug"
                params={{ slug: e.slug }}
                className="group relative min-h-[320px] overflow-hidden bg-background"
              >
                <img
                  src={e.image}
                  alt={`${e.name} at The Kult LA`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-[1200ms] group-hover:scale-105 group-hover:opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
                <div className="relative flex h-full flex-col justify-end p-7">
                  <h3 className="text-3xl">{e.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream/75">{e.intro}</p>
                  <span className="mt-5 text-[0.65rem] uppercase tracking-[0.18em] text-brass">
                    Plan this event →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="border-t border-border bg-charcoal">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-8 px-5 py-20 lg:px-10">
          <h2 className="max-w-xl text-3xl lg:text-5xl">Not sure which format fits your event?</h2>
          <div className="flex flex-wrap gap-4">
            <Cta to="/contact">Book the Venue</Cta>
            <Cta to="/contact" variant="outline">
              Schedule a Tour
            </Cta>
          </div>
        </div>
      </section>
    </>
  );
}
