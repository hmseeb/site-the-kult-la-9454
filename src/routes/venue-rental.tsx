import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Phone,
  MapPin,
  Projector,
  Armchair,
  Mic2,
  DoorOpen,
  Volume2,
  Film,
  Sun,
  Plus,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VenueInquiryForm } from "@/components/site/VenueInquiryForm";
import { realImages, venue, caseStudies } from "@/lib/site";
import { trackVenueConversion, trackPhoneClick } from "@/lib/venue-tracking";
import mark from "@/assets/kult-mark.png.asset.json";

export const Route = createFileRoute("/venue-rental")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Private Event Venue in Downtown Los Angeles | The Kult LA" },
      {
        name: "description",
        content:
          "Rent The Kult LA for weddings, corporate events, private parties and screenings. A private theater, rooftop and lounge in DTLA. Check your date or call (213) 232-7364.",
      },
      {
        property: "og:title",
        content: "The Kult LA — Private Event Venue in Downtown Los Angeles",
      },
      {
        property: "og:description",
        content:
          "Your event. A private theater, rooftop and lounge. Discover The Kult LA at 251 S. Main Street and check date availability.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://thekultla.com/venue-rental" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://thekultla.com/venue-rental" }],
  }),
  component: VenueRental,
});

const occasions = [
  {
    title: "Weddings",
    image: realImages.wedRooftopBalloonLoungeCover,
    copy: "A cinematic indoor space. Rooftop celebrations. A wedding that feels entirely like you.",
  },
  {
    title: "Corporate Events",
    image: realImages.theaterMagentaSeatsConference,
    copy: "Presentations, launches and company celebrations with a stage, cinema screen and professional AV.",
  },
  {
    title: "Film Premieres & Screenings",
    image: realImages.theaterScreenVelvetRows,
    copy: "Your film on a 30-foot cinema screen, with a private theater and space to gather afterward.",
  },
  {
    title: "Private Parties",
    image: realImages.rooftopSwingsDanceFloorDay,
    copy: "Birthdays, anniversaries and celebrations across spaces your guests will remember.",
  },
];
const features = [
  { icon: Film, title: "Private theater", copy: "A cinematic setting for your audience." },
  {
    icon: Projector,
    title: "30-foot cinema screen",
    copy: "Make your film or presentation the centerpiece.",
  },
  { icon: Sun, title: "Rooftop space", copy: "Open-air moments above Downtown LA." },
  { icon: Armchair, title: "Lounge", copy: "A place for cocktails and conversation." },
  { icon: Mic2, title: "Stage", copy: "A focal point for speakers and performances." },
  { icon: DoorOpen, title: "Green room", copy: "Space to prepare before the spotlight." },
  { icon: Volume2, title: "Audio / visual", copy: "Discuss your production needs with our team." },
  { icon: MapPin, title: "Central DTLA location", copy: "251 S. Main Street, Los Angeles." },
];
const photos = [
  { image: realImages.theaterVelvetBlueLedWide, caption: "The private theater" },
  { image: realImages.rooftopDanceFloorDay, caption: "The rooftop in daylight" },
  { image: realImages.proLobbyLoungeConcessionsWide, caption: "The lounge" },
  { image: realImages.theaterQaPanelAudience, caption: "Presentations on stage" },
  { image: realImages.wedLobbyCeremonySetup, caption: "A wedding in the atrium" },
  { image: realImages.proGreenRoomLounge, caption: "The green room" },
];
const wrap = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12";

function VenueRental() {
  const [eventType, setEventType] = useState("");
  const [tour, setTour] = useState(false);
  const [photo, setPhoto] = useState<number | null>(null);
  useEffect(() => {
    document.documentElement.dataset['venueRental'] = "true";
    const win = window as Window & {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };
    if (!document.getElementById("gtag-aw-17041487909")) {
      const script = document.createElement("script");
      script.id = "gtag-aw-17041487909";
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtag/js?id=AW-17041487909";
      document.head.appendChild(script);
    }
    win.dataLayer ??= [];
    win.gtag ??= function gtag() {
      // eslint-disable-next-line prefer-rest-params -- gtag.js needs the Arguments object
      win.dataLayer?.push(arguments);
    };
    win.gtag("js", new Date());
    win.gtag("config", "AW-17041487909");
    return () => {
      delete document.documentElement.dataset['venueRental'];
    };
  }, []);
  const availability = (placement: string, type = "", isTour = false) => {
    setEventType(type);
    setTour(isTour);
    trackVenueConversion(isTour ? "schedule_tour_click" : "primary_cta_click", placement);
  };
  function Availability({
    placement,
    label = "Check Availability",
    type = "",
    isTour = false,
    outline = false,
  }: {
    placement: string;
    label?: string;
    type?: string;
    isTour?: boolean;
    outline?: boolean;
  }) {
    return (
      <Button
        asChild
        variant={outline ? "outline" : "default"}
        className="h-12 rounded-sm px-5 text-sm shadow-none"
      >
        <a href="#availability" onClick={() => availability(placement, type, isTour)}>
          {label}
          <ArrowUpRight />
        </a>
      </Button>
    );
  }
  function Call({
    placement,
    label = venue.rentalPhone,
    outline = true,
  }: {
    placement: string;
    label?: string;
    outline?: boolean;
  }) {
    return (
      <Button
        asChild
        variant={outline ? "outline" : "default"}
        className="h-12 rounded-sm px-5 text-sm shadow-none"
      >
        <a href={venue.rentalPhoneHref} onClick={trackPhoneClick(placement, venue.rentalPhoneHref)}>
          <Phone />
          {label}
        </a>
      </Button>
    );
  }
  return (
    <div className="rental-page pb-20 md:pb-0">
      <header className="border-b border-border bg-background">
        <div className={`${wrap} flex min-h-20 items-center justify-between gap-3 py-3`}>
          <a href="#" aria-label="The Kult LA" className="flex shrink-0 items-center gap-3">
            <img src={mark.url} alt="" className="size-12 object-contain" />
            <span className="display text-xl sm:text-2xl">The Kult LA</span>
          </a>
          <div className="flex items-center gap-5">
            <a
              href={venue.rentalPhoneHref}
              onClick={trackPhoneClick("header", venue.rentalPhoneHref)}
              className="hidden items-center gap-2 text-sm sm:flex"
            >
              <Phone className="size-4 text-brass" />
              {venue.rentalPhone}
            </a>
            <Availability placement="header" />
          </div>
        </div>
      </header>
      <main>
        <section className="relative isolate overflow-hidden">
          <img
            src={realImages.theaterScreenVelvetRows}
            alt="The Kult LA private theater with velvet seating, illuminated aisles and a cinema screen"
            fetchPriority="high"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="rental-hero-veil absolute inset-0 -z-10" />
          <div
            className={`${wrap} flex min-h-[570px] flex-col justify-end pb-8 pt-14 sm:min-h-[690px] sm:pb-16 sm:pt-24`}
          >
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.16em] text-brass">
              PRIVATE VENUE RENTAL · 251 S. MAIN ST, DTLA
            </p>
            <h1 className="max-w-3xl text-[2.625rem] leading-[1.02] sm:text-6xl lg:text-7xl">
              Host Your Event in
              <br className="hidden sm:block" /> Downtown Los Angeles
              <span className="text-brass">.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-cream">
              A private theater, rooftop & lounge. One unforgettable setting for weddings, corporate
              events, private parties and film premieres.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Availability placement="hero" label="Check Date Availability" />
              <Call placement="hero" label="Call The Venue" />
            </div>
            <a
              href={venue.rentalPhoneHref}
              onClick={trackPhoneClick("hero_number", venue.rentalPhoneHref)}
              className="mt-4 w-fit text-sm text-cream"
            >
              {venue.rentalPhone}
            </a>
            <p className="mt-8 text-xs uppercase tracking-[0.12em] text-cream">
              THEATER / ROOFTOP / LOUNGE
            </p>
          </div>
        </section>
        <section aria-label="Venue at a glance" className="border-y border-border bg-charcoal">
          <div
            className={`${wrap} grid grid-cols-2 gap-x-5 gap-y-5 py-7 sm:grid-cols-3 lg:grid-cols-6`}
          >
            {[
              "Downtown Los Angeles",
              "Private Theater",
              "Rooftop",
              "30-Foot Screen",
              "Stage + Green Room",
              "Private Event Rental",
            ].map((label, index) => (
              <p key={label} className="flex items-center gap-3 text-xs">
                <span className="text-brass">0{index + 1}</span>
                {label}
              </p>
            ))}
          </div>
        </section>
        <section className={`${wrap} py-16 sm:py-24`}>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="label-xs">A different kind of LA venue</p>
              <h2 className="mt-5 text-4xl sm:text-5xl">
                Not Another
                <br />
                Hotel Ballroom.
              </h2>
              <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
                Start with a moment on the big screen. Move to the lounge for conversation. Take the
                celebration up to the rooftop.
              </p>
              <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
                The Kult brings distinct spaces together at one Downtown LA address. A private event
                venue with character, not a blank ballroom.
              </p>
              <div className="mt-7">
                <Availability
                  placement="intro_tour"
                  label="Schedule a Private Tour"
                  isTour
                  outline
                />
              </div>
            </div>
            <figure>
              <img
                src={realImages.rooftopSwingsDanceFloorDay}
                alt="The Kult rooftop with swing chairs, lounge seating and marble dance floor"
                loading="lazy"
                className="aspect-4/3 w-full object-cover"
              />
              <figcaption className="mt-3 flex justify-between text-xs text-muted-foreground">
                <span>The rooftop</span>
                <span>Downtown Los Angeles</span>
              </figcaption>
            </figure>
          </div>
        </section>
        <section className="border-y border-border bg-charcoal">
          <div className={`${wrap} py-16 sm:py-24`}>
            <p className="label-xs">Made for your occasion</p>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
              <h2 className="max-w-xl text-4xl sm:text-5xl">
                Your event.
                <br />
                Anything but ordinary.
              </h2>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                A Downtown Los Angeles event venue for the moments worth bringing people together.
              </p>
            </div>
            <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {occasions.map((occasion, index) => (
                <article key={occasion.title}>
                  <img
                    src={occasion.image}
                    alt={
                      occasion.title === "Weddings"
                        ? "Rooftop wedding lounge with white balloon arches"
                        : `${occasion.title} at The Kult LA`
                    }
                    loading="lazy"
                    className="aspect-4/5 w-full object-cover"
                  />
                  <p className="mt-5 text-xs text-brass">0{index + 1}</p>
                  <h3 className="mt-3 min-h-16 text-3xl leading-tight">{occasion.title}</h3>
                  <p className="mt-3 min-h-24 text-sm leading-relaxed text-muted-foreground">
                    {occasion.copy}
                  </p>
                  <div className="mt-5">
                    <Availability placement="event_type" type={occasion.title} outline />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className={`${wrap} py-16 sm:py-24`}>
          <p className="label-xs">The spaces. The possibilities.</p>
          <h2 className="mt-5 max-w-2xl text-4xl sm:text-5xl">
            Everything You Need in
            <br className="hidden sm:block" /> One Downtown LA Venue.
          </h2>
          <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="border-t border-border pt-6">
                <feature.icon className="size-6 text-brass" strokeWidth={1.3} />
                <h3 className="mt-5 text-2xl">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{feature.copy}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Availability placement="features" />
          </div>
        </section>
        <section className="border-y border-border">
          <div className={`${wrap} py-16 sm:py-24`}>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="label-xs">Inside The Kult</p>
                <h2 className="mt-5 text-4xl sm:text-5xl">Picture your event here.</h2>
              </div>
              <Availability
                placement="gallery_tour"
                label="Schedule a Private Tour"
                isTour
                outline
              />
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-3">
              {photos.map((item, index) => (
                <Button
                  key={item.caption}
                  variant="ghost"
                  onClick={() => setPhoto(index)}
                  aria-label={`View ${item.caption}`}
                  className="group relative block h-auto overflow-hidden rounded-none p-0"
                >
                  <img
                    src={item.image}
                    alt={item.caption}
                    loading="lazy"
                    className="aspect-4/3 w-full object-cover"
                  />
                  <span className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-background/85 px-3 py-3 text-left text-xs sm:text-sm">
                    {item.caption}
                    <Plus className="size-4" />
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </section>
        <section className={`${wrap} py-16 sm:py-24`}>
          <p className="label-xs">Real events. A distinctive setting.</p>
          <h2 className="mt-5 text-4xl sm:text-5xl">See Why Hosts Choose The Kult.</h2>
          <p className="mt-5 max-w-xl text-muted-foreground">
            From film festivals to creative gatherings, these events have made The Kult their
            setting.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {caseStudies.slice(0, 3).map((item) => (
              <article key={item.name} className="border-t border-border pt-5">
                <p className="text-xs uppercase tracking-[0.1em] text-brass">{item.type}</p>
                <h3 className="mt-4 text-2xl leading-tight">{item.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="border-y border-border bg-charcoal">
          <div className={`${wrap} grid gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:gap-20`}>
            <div>
              <p className="label-xs">251 S. Main Street</p>
              <h2 className="mt-5 text-4xl leading-tight sm:text-5xl">
                An Event Venue in the Heart of Downtown Los Angeles.
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                Bring your guests together at a central DTLA address, with a theater, lounge and
                rooftop all in one venue.
              </p>
              <address className="mt-6 text-sm not-italic leading-7">
                The Kult LA
                <br />
                251 S. Main Street
                <br />
                Los Angeles, CA
              </address>
              <div className="mt-6">
                <Call placement="location" />
              </div>
            </div>
            <iframe
              title="The Kult LA location at 251 S. Main Street"
              src={venue.mapEmbed}
              loading="lazy"
              className="min-h-80 w-full border border-border lg:h-full"
            />
          </div>
        </section>
        <section id="availability" className={`${wrap} scroll-mt-8 py-16 sm:py-24`}>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-24">
            <div>
              <p className="label-xs">Let’s make it happen</p>
              <h2 className="mt-5 text-5xl sm:text-6xl">
                Check Your Date<span className="text-brass">.</span>
              </h2>
              <p className="mt-6 max-w-sm leading-relaxed text-muted-foreground">
                Tell us what you’re planning. Our team will follow up about availability, your event
                needs and a private tour.
              </p>
              <div className="mt-8 border-t border-border pt-6">
                <p className="mb-3 text-sm text-muted-foreground">Prefer to talk it through?</p>
                <a
                  href={venue.rentalPhoneHref}
                  onClick={trackPhoneClick("form_sidebar", venue.rentalPhoneHref)}
                  className="flex w-fit items-center gap-3 text-2xl"
                >
                  <Phone className="size-5 text-brass" />
                  {venue.rentalPhone}
                </a>
                <a
                  href={venue.emailHref}
                  className="mt-4 block w-fit text-sm text-muted-foreground underline underline-offset-4"
                >
                  {venue.email}
                </a>
              </div>
            </div>
            <VenueInquiryForm eventType={eventType} tour={tour} />
          </div>
        </section>
        <section className="border-t border-border bg-charcoal">
          <div className={`${wrap} py-14 text-center sm:py-20`}>
            <p className="label-xs">Your next great gathering starts here</p>
            <h2 className="mt-5 text-4xl sm:text-5xl">Planning an Event in Los Angeles?</h2>
            <p className="mx-auto mt-5 max-w-lg leading-relaxed text-muted-foreground">
              Check your date, schedule a tour, or call us to see if The Kult is the right fit.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Availability placement="final" />
              <Call placement="final" label="Call Now" />
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-border">
        <div className={`${wrap} flex flex-wrap items-center justify-between gap-6 py-8`}>
          <div>
            <p className="display text-2xl">The Kult LA</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Downtown Los Angeles · Private event rental
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
            <a href={venue.rentalPhoneHref} onClick={trackPhoneClick("footer", venue.rentalPhoneHref)}>
              {venue.rentalPhone}
            </a>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </footer>
      <div className="rental-mobile-bar fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-border bg-background p-3 md:hidden">
        <Call placement="mobile_bar" label="Call Now" />
        <Availability placement="mobile_bar" />
      </div>
      <Dialog
        open={photo !== null}
        onOpenChange={(open) => {
          if (!open) setPhoto(null);
        }}
      >
        <DialogContent className="z-[100] max-w-5xl border-border p-5 pt-12">
          <DialogTitle className="text-2xl">
            {photo !== null ? photos[photo]?.caption : "Venue photo"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Approved photography of The Kult LA event venue.
          </DialogDescription>
          {photo !== null && (
            <img
              src={photos[photo]?.image}
              alt={photos[photo]?.caption}
              className="max-h-[65vh] w-full object-contain"
            />
          )}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous photo"
              onClick={() =>
                setPhoto((current) =>
                  current === null ? 0 : (current + photos.length - 1) % photos.length,
                )
              }
            >
              <ArrowLeft />
            </Button>
            <span className="text-xs text-muted-foreground">
              {photo === null ? 0 : photo + 1} / {photos.length}
            </span>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next photo"
              onClick={() =>
                setPhoto((current) => (current === null ? 0 : (current + 1) % photos.length))
              }
            >
              <ArrowRight />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
