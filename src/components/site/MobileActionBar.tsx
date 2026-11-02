import { Link } from "@tanstack/react-router";
import { Phone, CalendarClock, Ticket } from "lucide-react";
import { venue } from "@/lib/site";

export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-border bg-background/95 backdrop-blur lg:hidden">
      <a
        href={venue.phoneHref}
        className="flex flex-col items-center gap-1 py-3 text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground"
      >
        <Phone className="h-4 w-4" />
        Call
      </a>
      <Link
        to="/contact"
        className="flex flex-col items-center gap-1 border-x border-border py-3 text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground"
      >
        <CalendarClock className="h-4 w-4" />
        Tour the Venue
      </Link>
      <Link
        to="/contact"
        className="flex flex-col items-center gap-1 bg-primary py-3 text-[0.6rem] uppercase tracking-[0.16em] text-primary-foreground"
      >
        <Ticket className="h-4 w-4" />
        Book an Event
      </Link>
    </div>
  );
}
