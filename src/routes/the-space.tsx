import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Cta, Label } from "@/components/site/Cta";
import { Lightbox } from "@/components/site/Lightbox";
import { realImages, venue, venueSpaceItems } from "@/lib/site";

export const Route = createFileRoute("/the-space")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { property: "og:url", content: "https://thekultla.com/the-space" },
      { title: "The Space — Rooms, Rooftop and Lounges | The Kult LA" },
      {
        name: "description",
        content:
          "Photographs of The Kult LA as you would walk it on a tour: lobby lounge, theater, green room, rooftop terrace and rooftop bar in Downtown Los Angeles.",
      },
      { property: "og:title", content: "The Space — The Kult LA" },
      {
        property: "og:description",
        content: "The raw rooms of The Kult LA, unstyled and empty.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://thekultla.com/the-space" }],
  }),
  component: TheSpacePage,
});

function TheSpacePage() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      <Lightbox
        items={venueSpaceItems.map((i) => ({ image: i.image, caption: i.caption }))}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onIndexChange={setLightbox}
      />
      <section className="relative grain min-h-[70vh] overflow-hidden">
        <img
          src={realImages.lobbyLoungeVioletGlow}
          alt="The lobby lounge at The Kult LA washed in violet light"
          className="absolute inset-0 h-full w-full object-cover"
          width={1600}
          height={1200}
        />
        <div className="film-veil absolute inset-0" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-[1440px] flex-col justify-end px-5 pb-16 pt-40 lg:px-10">
          <Label>The Space</Label>
          <h1 className="mt-5 max-w-3xl text-4xl sm:text-6xl lg:text-7xl">
            The Raw Space, Unstyled
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/80">
            No events, no build-out — just the rooms as you would walk them on a tour.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {venueSpaceItems.map((item, i) => (
            <figure key={item.caption} className="group">
              <button
                type="button"
                onClick={() => setLightbox(i)}
                aria-label={`View larger: ${item.caption}`}
                className="block w-full cursor-zoom-in overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.caption}
                  loading="lazy"
                  className="aspect-4/3 w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                />
              </button>
            </figure>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-charcoal">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-8 px-5 py-20 lg:px-10">
          <h2 className="max-w-xl text-3xl lg:text-5xl">See the rooms in person.</h2>
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
