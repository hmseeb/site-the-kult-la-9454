import { createFileRoute } from "@tanstack/react-router";
import { Cta, Label, SectionHead } from "@/components/site/Cta";
import { realImages, spaces, venue } from "@/lib/site";

export const Route = createFileRoute("/venue")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://thekultla.com/venue" },
      { title: "The Venue — Theater, Lounge and Rooftop | The Kult LA" },
      {
        name: "description",
        content:
          "Walk through The Kult LA: a ground-floor theater with stage and projection, an elevated lounge and a rooftop terrace above Downtown Los Angeles.",
      },
      { property: "og:title", content: "The Venue — The Kult LA" },
      {
        property: "og:description",
        content: "Three levels of possibility in the heart of DTLA.",
      },
    ],
    links: [{ rel: "canonical", href: "https://thekultla.com/venue" }],
  }),
  component: VenuePage,
});

const walkthrough = [
  {
    n: "01",
    title: "The Theater",
    image: realImages.theaterRedSofaBlueLed,
    copy: "The ground floor is one continuous cinematic room, built around the screen and the stage.",
    features: ["Open, reconfigurable floor", "Historic architecture", "Seated or standing layouts"],
    best: "Screenings, premieres, concerts, theater, keynotes",
  },
  {
    n: "02",
    title: "The Lounge",
    image: realImages.stairwellArmchair,
    copy: "An elevated lounge off the main floor for arrivals, hospitality, hosting and quieter conversation.",
    features: ["Curved lounge seating", "Raised platform floor", "Warm accent lighting"],
    best: "Receptions, hospitality, VIP hosting, press and content capture",
  },
  {
    n: "03",
    title: "Rooftop Terrace",
    image: realImages.rooftopSwingsDanceFloorDay,
    copy: "Open-air gathering with the Downtown Los Angeles skyline as the backdrop.",
    features: ["DTLA skyline views", "Cocktail-hour setting", "Golden-hour photography"],
    best: "Cocktail hours, wedding moments, mixers",
  },
  {
    n: "04",
    title: "Entry and Arrival",
    image: realImages.lobbyLoungeVioletGlow,
    copy: "Guests arrive directly on Main Street, at the door of a century-old DTLA building.",
    features: ["Street-level arrival", "Historic facade", "Arrival photography"],
    best: "Premieres, launches, weddings",
  },
  {
    n: "05",
    title: "Flexible Layouts",
    image: realImages.theaterVelvetBlueLedWide,
    copy: "Seated cinema, standing show, gallery floor, dinner service or reception flow.",
    features: ["Approx. 20 to 200+ guests", "Multi-level event flow", "Layout planning with our team"],
    best: "Every event type we host",
  },
];

function VenuePage() {
  return (
    <>
      <section className="relative grain min-h-[70vh] overflow-hidden">
        <img
          src={realImages.theaterTealLedSeating}
          alt="The theater house at The Kult LA washed in teal light"
          className="absolute inset-0 h-full w-full object-cover"
          width={1600}
          height={1200}
        />
        <div className="film-veil absolute inset-0" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-[1440px] flex-col justify-end px-5 pb-16 pt-40 lg:px-10">
          <Label>The Venue</Label>
          <h1 className="mt-5 max-w-3xl text-4xl sm:text-6xl lg:text-7xl">
            Three Levels of Possibility in the Heart of DTLA
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-px bg-border sm:grid-cols-3">
          {spaces.map((s) => (
            <div key={s.id} className="bg-background p-7">
              <h2 className="text-2xl">{s.label}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        {walkthrough.map((w, i) => (
          <section
            key={w.title}
            className={`grid gap-10 border-t border-border py-16 lg:grid-cols-2 lg:gap-16 lg:py-24 ${
              i % 2 === 1 ? "lg:[&>figure]:order-2" : ""
            }`}
          >
            <figure className="relative aspect-4/3 overflow-hidden">
              <img
                src={w.image}
                alt={`${w.title} at The Kult LA`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </figure>
            <div className="flex flex-col justify-center">
              <div className="flex items-baseline gap-4">
                <span className="section-number">{w.n}</span>
                <Label>Space</Label>
              </div>
              <h2 className="mt-4 text-3xl lg:text-5xl">{w.title}</h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                {w.copy}
              </p>
              <ul className="mt-7 space-y-2 text-sm text-cream/80">
                {w.features.map((f) => (
                  <li key={f} className="hairline pt-2">
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs uppercase tracking-[0.16em] text-brass">
                Best fit — {w.best}
              </p>
              <div className="mt-8">
                <Cta to="/contact" variant="outline">
                  Inquire About This Space
                </Cta>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="border-t border-border bg-charcoal">
        <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
          <SectionHead
            number="09"
            label="Accessibility and logistics"
            title="Arrival, Load-In and Access"
            copy="We share confirmed logistics directly so your production team plans against real information."
          />
          <dl className="mt-12 grid gap-6 text-sm sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Accessibility details",
              "Load-in and loading access",
              "Parking and rideshare",
              "Seating plans by layout",
            ].map((t) => (
              <div key={t} className="hairline pt-4">
                <dt className="label-xs text-concrete">{t}</dt>
                <dd className="mt-2 text-muted-foreground">Contact the venue for details</dd>
              </div>
            ))}
          </dl>
          <div className="mt-12 flex flex-wrap gap-4">
            <Cta to="/contact">Schedule a Tour</Cta>
            <Cta href={venue.phoneHref} variant="outline">
              Call {venue.phone}
            </Cta>
          </div>
        </div>
      </section>
    </>
  );
}
