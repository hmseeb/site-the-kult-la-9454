import { createFileRoute } from "@tanstack/react-router";
import { getRouterInstance } from "@tanstack/react-start";
import {
  isSitemapRouteIncluded,
  sitemapPathForLocation,
  sitemapStaticPaths,
  sitemapXML,
  type SitemapEntry,
} from "@/lib/sitemap";
import { eventTypes } from "@/lib/site";

const BASE_URL = "https://thekultla.com";

export const Route = createFileRoute("/sitemap.xml")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () => {
        const router = await getRouterInstance();
        const entries: SitemapEntry[] = sitemapStaticPaths(router).map((path) => ({ path }));

        const eventTypeRouteId = "/event-types/$slug";
        if (isSitemapRouteIncluded(router.routesById[eventTypeRouteId])) {
          for (const eventType of eventTypes) {
            const location = router.buildLocation({
              to: "/event-types/$slug",
              params: { slug: eventType.slug },
              search: () => ({}),
              hash: "",
            });
            const path = sitemapPathForLocation(router, location, eventTypeRouteId);
            if (path) entries.push({ path });
          }
        }

        const eventRouteId = "/events/$eventId";
        if (isSitemapRouteIncluded(router.routesById[eventRouteId])) {
          const { listSitemapEvents } = await import("@/lib/events.server");
          for (const event of await listSitemapEvents()) {
            const location = router.buildLocation({ to: "/events/$eventId", params: { eventId: event.slug ?? event.id }, search: () => ({}), hash: "" });
            const path = sitemapPathForLocation(router, location, eventRouteId);
            if (path) entries.push({ path, lastmod: event.updated_at });
          }
        }

        if (entries.length === 0) {
          return new Response(
            'No pages are included in this sitemap. Check route decisions and ancestor exclusions. Setting "exclude-subtree" on the root excludes the entire site.',
            { status: 404, headers: { "Cache-Control": "no-store" } },
          );
        }

        return new Response(sitemapXML(BASE_URL, entries), {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
