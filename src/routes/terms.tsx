import { createFileRoute } from "@tanstack/react-router";
import { Label } from "@/components/site/Cta";
import { venue } from "@/lib/site";

export const Route = createFileRoute("/terms")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://thekultla.com/terms" },
      { title: "Terms — The Kult LA" },
      {
        name: "description",
        content:
          "Terms of use for The Kult LA website. Event terms, availability and pricing are confirmed directly with the venue.",
      },
      { property: "og:title", content: "Terms — The Kult LA" },
      { property: "og:description", content: "Website terms of use for The Kult LA." },
    ],
    links: [{ rel: "canonical", href: "https://thekultla.com/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 pb-24 pt-40 lg:px-10">
      <Label>Terms</Label>
      <h1 className="mt-5 text-4xl lg:text-6xl">Terms of Use</h1>
      <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground">
        <p>
          Information on this website describes The Kult LA and its spaces. Availability, pricing,
          capacities and technical specifications are confirmed directly by the venue in writing.
        </p>
        <p>
          Submitting an inquiry does not reserve a date. A date is held only once confirmed by The
          Kult LA team.
        </p>
        <p>
          For event terms and agreements, contact{" "}
          <a href={venue.emailHref} className="text-brass hover:text-amber">
            {venue.email}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
