import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const listPublicEvents = createServerFn({ method: "GET" }).handler(async () => {
  const { listUpcomingEvents } = await import("./events.server");
  return listUpcomingEvents(50);
});

export const getPublicEvent = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => z.object({ id: z.string().min(1).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) }).parse(data))
  .handler(async ({ data }) => {
    const { getUpcomingEvent } = await import("./events.server");
    return getUpcomingEvent(data.id);
  });
