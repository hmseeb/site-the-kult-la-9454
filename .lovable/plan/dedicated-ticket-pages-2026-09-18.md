# Dedicated Ticket Pages

## What will change
- Add a dedicated public page for each ticket at `/events/{ticket-id}`.
- Show the ticket artwork, title, date and time, location, full formatted description, and ticket or inquiry action.
- Make ticket photos and titles clickable on both the homepage and Upcoming Events page.
- Make the homepage banner’s event details link to the same dedicated page while keeping its ticket purchase action.
- Add unique page metadata and a safe not-found state for missing or expired tickets.

## Technical details
- Add a public event lookup server function using the existing event record ID and signed artwork URL flow.
- Create a TanStack dynamic event route and preserve Los Angeles date/time formatting.
- Use typed route links so event links work in preview and on the published domain.
