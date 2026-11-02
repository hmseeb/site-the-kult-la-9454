import { test } from "node:test";
import assert from "node:assert/strict";
import { isPastEvent, isEventIdentifier, eventSchema } from "./event-lifecycle";

test("October 18 at 11 AM California time is past on October 27", () => {
  assert.equal(isPastEvent({ starts_at: "2026-10-18T18:00:00Z", ends_at: null }, Date.parse("2026-10-27T16:52:00Z")), true);
});
test("an event remains current until its specified end", () => {
  assert.equal(isPastEvent({ starts_at: "2026-10-18T18:00:00Z", ends_at: "2026-10-18T20:00:00Z" }, Date.parse("2026-10-18T19:00:00Z")), false);
});
test("expired events retain dates and are not falsely marked cancelled", () => {
  const schema = eventSchema({ title: "K-POP", description: null, starts_at: "2026-10-18T18:00:00Z", ends_at: null, location: null }, "https://thekultla.com/events/k-pop");
  assert.equal(schema.startDate, "2026-10-18T18:00:00Z");
  assert.equal(schema.eventStatus, "https://schema.org/EventScheduled");
});
test("both legacy UUIDs and descriptive event URLs are accepted", () => {
  assert.equal(isEventIdentifier("742dfce4-5fe1-48bc-a4bf-37a270eb23b1"), true);
  assert.equal(isEventIdentifier("k-pop-save-the-show-742dfce4-5fe1-48bc-a4bf-37a270eb23b1"), true);
  assert.equal(isEventIdentifier("../k-pop"), false);
  assert.equal(isEventIdentifier("bad'identifier"), false);
});