import { createFileRoute } from "@tanstack/react-router";
import { Cta, Label, SectionHead } from "@/components/site/Cta";
import { realImages, venue } from "@/lib/site";

export const Route = createFileRoute("/about")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://thekultla.com/about" },
      { title: "About The Kult LA — A Venue Built for Creators in DTLA" },
      {
        name: "description",
        content:
          "The Kult LA opened in 2024 inside a historic Downtown Los Angeles building as a venue where cinema, performance, art, business and celebration coexist.",
      },
      { property: "og:title", content: "About — The Kult LA" },
      { property: "og:description", content: "Born in DTLA. Built for creators." },
    ],
    links: [{ rel: "canonical", href: "https://thekultla.com/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="relative grain min-h-[65vh] overflow-hidden">
        <img
          src={realImages.stairwellArmchair}
          alt="A sculptural white armchair on the stair landing at The Kult LA"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="film-veil absolute inset-0" />
        <div className="relative mx-auto flex min-h-[65vh] max-w-[1440px] flex-col justify-end px-5 pb-16 pt-40 lg:px-10">
          <Label>About</Label>
          <h1 className="mt-5 text-4xl sm:text-6xl lg:text-7xl">Born in DTLA. Built for Creators.</h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr]">
          <SectionHead
            number="01"
            label="The origin"
            title="A Venue for Work That Does Not Fit Anywhere Else"
          />
          <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
            <p>
              The Kult LA opened in 2024 inside a historic Downtown Los Angeles building with one
              goal: create a venue where cinema, performance, art, business and celebration could
              coexist.
            </p>
            <p>
              The result is a multi-level space at 251 S. Main Street — a theater on the ground
              floor, an elevated lounge beside it and a rooftop terrace over Downtown.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        {[
          {
            n: "02",
            label: "The building",
            title: "Roughly a Century of Downtown",
            copy: "The venue occupies a historic building approximately 100 years old. Its architecture, textures and proportions are part of every event held inside it.",
            image: realImages.facadeMainStreetDay,
          },
          {
            n: "03",
            label: "The creative mission",
            title: "Independent Energy, Professional Room",
            copy: "Filmmakers, performers, curators and brand teams get a room with real technical capability — projection, THX-certified audio, a stage and a green room — without the rigidity of a traditional venue.",
            image: realImages.theaterMagentaSeatsConference,
          },
          {
            n: "04",
            label: "The spaces",
            title: "Theater, Lounge, Rooftop",
            copy: "Three levels that can operate as one continuous event or as distinct environments across a single evening.",
            image: realImages.rooftopEyePurple,
          },
        ].map((s, i) => (
          <section
            key={s.n}
            className={`grid gap-10 border-t border-border py-16 lg:grid-cols-2 lg:gap-16 lg:py-24 ${
              i % 2 === 1 ? "lg:[&>figure]:order-2" : ""
            }`}
          >
            <figure className="aspect-4/3 overflow-hidden">
              <img src={s.image} alt={s.title} loading="lazy" className="h-full w-full object-cover" />
            </figure>
            <div className="flex flex-col justify-center">
              <div className="flex items-baseline gap-4">
                <span className="section-number">{s.n}</span>
                <Label>{s.label}</Label>
              </div>
              <h2 className="mt-4 text-3xl lg:text-5xl">{s.title}</h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">{s.copy}</p>
            </div>
          </section>
        ))}
      </div>

      <section className="border-y border-border bg-charcoal">
        <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
          <div className="flex flex-wrap gap-4">
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
