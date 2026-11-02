/** An event without an end time expires when its start time passes. */
export function isPastEvent(event: { starts_at: string; ends_at: string | null }, now = Date.now()) {
  return new Date(event.ends_at ?? event.starts_at).getTime() <= now;
}

export function isEventIdentifier(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 180;
}

export function eventSchema(event: {
  title: string; description: string | null; starts_at: string; ends_at: string | null;
  location: string | null;
}, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    ...(event.description ? { description: event.description } : {}),
    url,
    startDate: event.starts_at,
    ...(event.ends_at ? { endDate: event.ends_at } : {}),
    // Past does not mean cancelled: preserve the actual scheduled dates.
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.location || "The Kult LA",
      address: {
        "@type": "PostalAddress",
        streetAddress: "251 S. Main Street",
        addressLocality: "Los Angeles",
        addressRegion: "CA",
        addressCountry: "US",
      },
    },
  };
}