const LA_TZ = "America/Los_Angeles";

function zonedPartsAsUtc(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: LA_TZ,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? "0");
  const hour = get("hour") % 24;
  return Date.UTC(get("year"), get("month") - 1, get("day"), hour, get("minute"), get("second"));
}

/** Offset in ms between Los Angeles wall time and UTC at the given instant. */
function laOffsetMs(date: Date) {
  return zonedPartsAsUtc(date) - date.getTime();
}

/** Converts a "YYYY-MM-DDTHH:mm" value entered as Los Angeles wall time into a UTC ISO string. */
export function laInputToUtcIso(localInput: string) {
  const match = localInput.trim().match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/);
  if (!match) return new Date(localInput).toISOString();
  const [, y, mo, d, h, mi] = match;
  const guessMs = Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi));
  let utcMs = guessMs - laOffsetMs(new Date(guessMs));
  // Refine once for DST boundaries.
  utcMs = guessMs - laOffsetMs(new Date(utcMs));
  return new Date(utcMs).toISOString();
}

/** Formats a UTC ISO string as a "YYYY-MM-DDTHH:mm" Los Angeles wall-time value. */
export function utcIsoToLaInput(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(zonedPartsAsUtc(date)).toISOString().slice(0, 16);
}
