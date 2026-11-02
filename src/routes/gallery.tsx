import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Cta, Label } from "@/components/site/Cta";
import { Lightbox } from "@/components/site/Lightbox";
import { galleryFilters, galleryItems } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gallery")({
  staticData: { sitemap: true },
  validateSearch: (search: Record<string, unknown>): { filter?: string } => {
    const f = search["filter"];
    return typeof f === "string" ? { filter: f } : {};
  },

  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://thekultla.com/gallery" },
      { title: "Gallery — Events and Spaces at The Kult LA" },
      {
        name: "description",
        content:
          "An editorial look at The Kult LA: screenings, premieres, live music, corporate presentations, weddings, rooftop receptions and the empty venue.",
      },
      { property: "og:title", content: "Gallery — The Kult LA" },
      {
        property: "og:description",
        content: "Screen, stage, lounge and rooftop across every kind of event.",
      },
    ],
    links: [{ rel: "canonical", href: "https://thekultla.com/gallery" }],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const search = Route.useSearch();
  const [filter, setFilter] = useState(
    search.filter && galleryFilters.includes(search.filter) ? search.filter : "All",
  );
  const [lightbox, setLightbox] = useState<number | null>(null);
  const items =
    filter === "All" ? galleryItems : galleryItems.filter((i) => i.tags.includes(filter));

  return (
    <>
      <Lightbox
        items={items.map((i) => ({
          image: i.image,
          caption: i.caption,
          meta: `${i.space} · ${i.tags[0]}`,
        }))}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onIndexChange={setLightbox}
      />
      <section className="mx-auto max-w-[1440px] px-5 pb-12 pt-40 lg:px-10">
        <Label>Gallery</Label>
        <h1 className="mt-5 max-w-3xl text-4xl sm:text-6xl lg:text-7xl">
          The Same Room, Every Kind of Night
        </h1>
        <div className="mt-10 flex flex-wrap gap-2">
          {galleryFilters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setFilter(f);
                setLightbox(null);
              }}
              className={cn(
                "border px-4 py-2 text-[0.65rem] uppercase tracking-[0.16em] transition-colors",
                filter === f
                  ? "border-brass text-brass"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-24 lg:px-10">


        <div className="grid gap-10 sm:grid-cols-2">
          {items.map((item, i) => (
            <figure
              key={item.caption}
              className={cn("group", i % 3 === 0 && "sm:col-span-2")}
            >
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
                  className={cn(
                    "w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]",
                    i % 3 === 0 ? "aspect-21/9" : "aspect-4/3",
                  )}
                />
              </button>
              <figcaption className="mt-3 text-[0.65rem] uppercase tracking-[0.16em] text-concrete">
                {item.tags[0]}
              </figcaption>

            </figure>
          ))}
        </div>
        {items.length === 0 && (
          <p className="py-20 text-sm text-muted-foreground">
            No images in this category yet — ask us for recent event photography.
          </p>
        )}
      </section>

      <section className="border-t border-border bg-charcoal">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-8 px-5 py-20 lg:px-10">
          <h2 className="max-w-xl text-3xl lg:text-5xl">See the room in person.</h2>
          <div className="flex flex-wrap gap-4">
            <Cta to="/contact">Schedule a Tour</Cta>
            <Cta to="/contact" variant="outline">
              Book the Venue
            </Cta>
          </div>
        </div>
      </section>
    </>
  );
}
