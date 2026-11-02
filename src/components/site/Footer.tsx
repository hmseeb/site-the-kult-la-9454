import { Link } from "@tanstack/react-router";
import { eventsByGroup, groupOrder, groups, venue } from "@/lib/site";
import logoAsset from "@/assets/kult-logo.jpg.asset.json";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-20">
        {/* Event categories, by cluster */}
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {groupOrder.map((g) => (
            <div key={g}>
              <p className="label-xs text-brass">{groups[g].label}</p>
              <ul className="mt-6 space-y-4">
                {eventsByGroup(g).map((e) => (
                  <li key={e.slug}>
                    <Link
                      to="/event-types/$slug"
                      params={{ slug: e.slug }}
                      className="display text-lg text-cream/85 transition-colors hover:text-brass"
                    >
                      {e.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Brand, contact and site links */}
        <div className="hairline mt-16 grid gap-10 pt-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <img
              src={logoAsset.url}
              alt="The Kult LA"
              className="h-20 w-auto mix-blend-screen"
            />
            <address className="mt-4 space-y-1 text-sm not-italic leading-relaxed text-muted-foreground">
              <p>{venue.street}</p>
              <p>{venue.city}</p>
            </address>
            <div className="mt-4 space-y-1 text-sm">
              <p>
                <a href={venue.phoneHref} className="text-foreground hover:text-brass">
                  {venue.phone}
                </a>
              </p>
              <p>
                <a href={venue.emailHref} className="text-foreground hover:text-brass">
                  {venue.email}
                </a>
              </p>
            </div>
          </div>

          <div>
            <p className="label-xs">Venue</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              
              <li><Link to="/the-space" className="hover:text-foreground">The Space</Link></li>
              <li><Link to="/events" className="hover:text-foreground">Events</Link></li>
              <li><Link to="/gallery" className="hover:text-foreground">Gallery</Link></li>
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
              <li>
                <Link to="/event-types" className="text-brass hover:text-amber">
                  All event types
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="label-xs">Follow</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://www.instagram.com/thekultla"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a href={venue.emailHref} className="hover:text-foreground">
                  Email the venue
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-14 flex flex-col gap-4 pt-6 text-xs text-concrete sm:flex-row sm:items-center sm:justify-between">
          <p>The Kult LA © 2026</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-muted-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-muted-foreground">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
