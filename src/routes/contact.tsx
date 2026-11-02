import { createFileRoute } from "@tanstack/react-router";
import { Cta, Label, SectionHead } from "@/components/site/Cta";
import { InquiryForm } from "@/components/site/InquiryForm";
import { venue } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://thekultla.com/contact" },
      { title: "Contact & Book — The Kult LA, 251 S. Main Street DTLA" },
      {
        name: "description",
        content:
          "Book The Kult LA or schedule a venue tour. Call (310) 995-1070 or email info@thekultla.com — 251 S. Main Street, Los Angeles, CA.",
      },
      { property: "og:title", content: "Contact — The Kult LA" },
      {
        property: "og:description",
        content: "Book the venue, schedule a tour or request technical details.",
      },
    ],
    links: [{ rel: "canonical", href: "https://thekultla.com/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <section className="mx-auto max-w-[1440px] px-5 pb-12 pt-40 lg:px-10">
        <Label>Contact</Label>
        <h1 className="mt-5 max-w-3xl text-4xl sm:text-6xl lg:text-7xl">
          Book the Venue or Tour the Space
        </h1>
        <div className="mt-10 grid gap-px bg-border sm:grid-cols-3">
          <div className="bg-background p-7">
            <p className="label-xs text-concrete">Address</p>
            <address className="mt-3 space-y-1 text-base not-italic text-cream">
              <p>The Kult LA</p>
              <p>{venue.street}</p>
              <p>{venue.city}</p>
            </address>
          </div>
          <div className="bg-background p-7">
            <p className="label-xs text-concrete">Phone</p>
            <a href={venue.phoneHref} className="mt-3 block text-base text-cream hover:text-brass">
              {venue.phone}
            </a>
            <div className="mt-5">
              <Cta href={venue.phoneHref} variant="outline" className="px-5 py-3">
                Call the Venue
              </Cta>
            </div>
          </div>
          <div className="bg-background p-7">
            <p className="label-xs text-concrete">Email</p>
            <a href={venue.emailHref} className="mt-3 block text-base text-cream hover:text-brass">
              {venue.email}
            </a>
            <div className="mt-5">
              <Cta href={venue.emailHref} variant="outline" className="px-5 py-3">
                Email the Venue
              </Cta>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-charcoal">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-28">
          <div>
            <SectionHead number="01" label="Event inquiry" title="Tell Us What You’re Planning" />
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Share the event type, preferred date and expected guest count. The Kult LA team will
              help you explore the right spaces and next steps.
            </p>
            <dl className="mt-10 space-y-5 text-sm">
              {[
                ["Business hours", "Contact the venue for details"],
                ["Parking", "Contact the venue for details"],
                ["Load-in access", "Contact the venue for details"],
              ].map(([t, d]) => (
                <div key={t} className="hairline pt-4">
                  <dt className="label-xs text-concrete">{t}</dt>
                  <dd className="mt-2 text-muted-foreground">{d}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8">
              <p className="label-xs">Follow</p>
              <a
                href="https://www.instagram.com/thekultla"
                target="_blank"
                rel="noreferrer"
                className="mt-3 block text-sm text-cream hover:text-brass"
              >
                Instagram
              </a>
            </div>
          </div>
          <InquiryForm />
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-14 px-5 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
        <div>
          <SectionHead number="02" label="Tour request" title="Schedule a Venue Tour" />
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            Walk the theater, the lounge and the rooftop with our team. Call or email to set a
            time — or send the inquiry form above and note “tour” in the description.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Cta href={venue.phoneHref}>Call {venue.phone}</Cta>
            <Cta href={venue.emailHref} variant="outline">
              Email {venue.email}
            </Cta>
          </div>
          <div className="mt-8">
            <Cta href={venue.directions} variant="text">
              Get Directions
            </Cta>
          </div>
        </div>
        <div className="min-h-[400px] border border-border">
          <iframe
            title="Map of The Kult LA at 251 S. Main Street, Los Angeles"
            src={venue.mapEmbed}
            loading="lazy"
            className="h-full min-h-[400px] w-full grayscale-[0.4] contrast-125"
          />
        </div>
      </section>
    </>
  );
}
