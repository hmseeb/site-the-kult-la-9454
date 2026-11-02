import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Cta } from "./Cta";
import { eventsByGroup, groupOrder, groups, venue } from "@/lib/site";
import { cn } from "@/lib/utils";
import markAsset from "@/assets/kult-mark.png.asset.json";

const navLinks = [
  { to: "/the-space", label: "The Space" },
  { to: "/events", label: "Events" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        solid || open || mega
          ? "border-b border-border bg-background/95 backdrop-blur"
          : "bg-gradient-to-b from-background/80 to-transparent",
      )}
      onMouseLeave={() => setMega(false)}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-4 lg:px-10">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <img
            src={markAsset.url}
            alt="The Kult LA monogram"
            className="h-9 w-9 mix-blend-screen lg:h-10 lg:w-10"
          />
          <span className="display whitespace-nowrap text-2xl tracking-tight">The Kult LA</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <button
            type="button"
            className="flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            onMouseEnter={() => setMega(true)}
            onClick={() => setMega((v) => !v)}
          >
            Event Types <ChevronDown className="h-3 w-3" />
          </button>
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onMouseEnter={() => setMega(false)}
              className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-brass" }}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex items-center gap-3">
            <Cta to="/contact" variant="outline" className="px-5 py-3">
              Schedule a Tour
            </Cta>
            <Cta to="/contact" className="px-5 py-3">
              Book the Venue
            </Cta>
          </div>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          className="shrink-0 p-2 text-foreground lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mega menu (desktop) */}
      {mega && (
        <div className="hidden border-t border-border bg-background/98 backdrop-blur lg:block">
          <div className="mx-auto grid max-w-[1440px] grid-cols-4 gap-10 px-10 py-10">
            {groupOrder.map((g) => (
              <div key={g}>
                <p className="label-xs">{groups[g].label}</p>
                <ul className="mt-4 space-y-2.5">
                  {eventsByGroup(g).map((e) => (
                    <li key={e.slug}>
                      <Link
                        to="/event-types/$slug"
                        params={{ slug: e.slug }}
                        onClick={() => setMega(false)}
                        className="display text-xl text-foreground/85 transition-colors hover:text-brass"
                      >
                        {e.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="hairline mx-auto max-w-[1440px] px-10 py-5">
            <Link
              to="/event-types"
              onClick={() => setMega(false)}
              className="text-[0.7rem] uppercase tracking-[0.18em] text-brass hover:text-amber"
            >
              View all event types
            </Link>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {open && (
        <div className="max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-border bg-background px-5 pb-28 pt-6 lg:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="display text-3xl text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="mt-8 space-y-6">
            {groupOrder.map((g) => (
              <div key={g}>
                <p className="label-xs">{groups[g].label}</p>
                <ul className="mt-3 space-y-2">
                  {eventsByGroup(g).map((e) => (
                    <li key={e.slug}>
                      <Link
                        to="/event-types/$slug"
                        params={{ slug: e.slug }}
                        onClick={() => setOpen(false)}
                        className="text-sm text-muted-foreground"
                      >
                        {e.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <Cta to="/contact" className="w-full">
              Book the Venue
            </Cta>
            <Cta href={venue.phoneHref} variant="outline" className="w-full">
              Call {venue.phone}
            </Cta>
          </div>
        </div>
      )}
    </header>
  );
}
