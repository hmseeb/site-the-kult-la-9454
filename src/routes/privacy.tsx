import { createFileRoute } from "@tanstack/react-router";
import { Label } from "@/components/site/Cta";
import { venue } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://thekultla.com/privacy" },
      { title: "Privacy — The Kult LA" },
      {
        name: "description",
        content:
          "How The Kult LA handles information submitted through event inquiry and tour request forms.",
      },
      { property: "og:title", content: "Privacy — The Kult LA" },
      { property: "og:description", content: "Privacy practices for The Kult LA website." },
    ],
    links: [{ rel: "canonical", href: "https://thekultla.com/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 pb-24 pt-40 lg:px-10">
      <Label>Privacy</Label>
      <h1 className="mt-5 text-4xl lg:text-6xl">Privacy</h1>
      <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground">
        <p>
          Information you submit through an event inquiry or tour request is used only to respond to
          your request about hosting an event at The Kult LA.
        </p>
        <p>
          We do not sell inquiry information. This page is maintained by The Kult LA and is updated
          as our practices are confirmed.
        </p>
        <p>
          Questions about your information:{" "}
          <a href={venue.emailHref} className="text-brass hover:text-amber">
            {venue.email}
          </a>{" "}
          or{" "}
          <a href={venue.phoneHref} className="text-brass hover:text-amber">
            {venue.phone}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
