import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Cta, Label, SectionHead } from "@/components/site/Cta";
import { InquiryForm } from "@/components/site/InquiryForm";
import { eventTypes, groups, venue } from "@/lib/site";

export const Route = createFileRoute("/event-types/$slug")({
  staticData: { sitemap: true },
  loader: ({ params }) => {
    const event = eventTypes.find((e) => e.slug === params.slug);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Event type not found — The Kult LA" }, { name: "robots", content: "noindex" }],
      };
    }
    const { event } = loaderData;
    const canonical = `https://thekultla.com/event-types/${event.slug}`;
    return {
      meta: [
        { title: `${event.name} at The Kult LA — DTLA Venue` },
        { name: "description", content: event.intro },
        { property: "og:title", content: `${event.name} — The Kult LA` },
        { property: "og:description", content: event.intro },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: EventTypeDetail,
});

function EventTypeDetail() {
  const { slug } = Route.useParams();
  const { event } = Route.useLoaderData();
  const related = eventTypes.filter((e) => e.group === event.group && e.slug !== event.slug);
  const light = slug === "weddings";

  return (
    <div className={light ? "weddings-light" : undefined}>
      <section className="hero-dark relative grain min-h-[75vh] overflow-hidden">
        <img
          src={event.image}
          alt={`${event.name} at The Kult LA`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="film-veil absolute inset-0" />
        <div className="relative mx-auto flex min-h-[75vh] max-w-[1440px] flex-col justify-end px-5 pb-16 pt-40 lg:px-10">
          <Label>
            {groups[event.group].label} — {event.name}
          </Label>
          <h1 className="mt-5 max-w-4xl text-4xl sm:text-6xl lg:text-7xl">{event.hero}</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/80">{event.intro}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Cta to="/contact">Book the Venue</Cta>
            <Cta to="/the-space" variant="outline">
              See The Space
            </Cta>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-14 px-5 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
        <div>
          <SectionHead number="01" label="Why here" title="Why the Venue Fits" />
          <ul className="mt-8 space-y-4">
            {event.fit.map((f) => (
              <li key={f} className="hairline pt-4 text-base leading-relaxed text-muted-foreground">
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-12">
          <div>
            <Label>Recommended spaces</Label>
            <ul className="mt-4 flex flex-wrap gap-2">
              {event.spaces.map((s) => (
                <li key={s} className="border border-border px-4 py-2 text-xs text-cream/85">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Label>Relevant technical features</Label>
            <ul className="mt-4 flex flex-wrap gap-2">
              {event.tech.map((s) => (
                <li key={s} className="border border-border px-4 py-2 text-xs text-cream/85">
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-concrete">
              Specific models, inventories and capacities: contact the venue for details.
            </p>
          </div>
          <div>
            <Label>Sample event flow</Label>
            <ol className="mt-4 space-y-3">
              {event.flow.map((f, i) => (
                <li key={f} className="flex gap-4 text-sm text-muted-foreground">
                  <span className="section-number">{String(i + 1).padStart(2, "0")}</span>
                  {f}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {event.offerings && (
        <section className="border-t border-border bg-charcoal">
          <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
            <SectionHead number="02" label="What we offer" title={event.planningHeading} />
            <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
              {event.offerings.map((o) => (
                <div key={o.title} className="bg-charcoal p-7">
                  <h3 className="text-2xl">{o.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{o.copy}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-2xl text-xs text-concrete">
              Decor, floral and rental options are arranged per event — share your vision and we
              will confirm what is possible for your date.
            </p>
          </div>
        </section>
      )}

      {event.gallery && (
        <section className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
          <SectionHead
            number="03"
            label="Photography"
            title={`${event.name} at The Kult LA`}
          />
          <div className="mt-12 grid gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {event.gallery.map((g, i) => (
              <img
                key={g.image}
                src={g.image}
                alt={g.alt}
                loading="lazy"
                className={
                  "w-full object-cover " + (i % 5 === 0 ? "aspect-4/3 sm:col-span-2" : "aspect-4/3")
                }
              />
            ))}
          </div>
          <div className="mt-10">
            <Cta to="/gallery" search={{ filter: "Weddings" }} variant="outline">
              View the Full Gallery
            </Cta>
          </div>
        </section>
      )}


      <section className="border-y border-border bg-charcoal">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-28">
          <div>
            <SectionHead label="Inquiry" title={event.inquiryHeading} />
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Share the date, guest count and format. We will walk you through the right spaces.
            </p>
            <div className="mt-8 space-y-2 text-sm">
              <a href={venue.phoneHref} className="block text-cream hover:text-brass">
                {venue.phone}
              </a>
              <a href={venue.emailHref} className="block text-cream hover:text-brass">
                {venue.email}
              </a>
            </div>
          </div>
          <InquiryForm defaultEventType={event.name} />
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10">
        <Label>Related event types</Label>
        <div className="mt-8 grid gap-px bg-border sm:grid-cols-3">
          {related.map((r) => (
            <Link
              key={r.slug}
              to="/event-types/$slug"
              params={{ slug: r.slug }}
              className="bg-background p-7 transition-colors hover:bg-charcoal"
            >
              <h3 className="text-2xl">{r.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.intro}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
