import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/events")({
  staticData: { sitemap: false },
  component: EventsLayout,
});

function EventsLayout() {
  return <Outlet />;
}