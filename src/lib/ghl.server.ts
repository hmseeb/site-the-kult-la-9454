const GHL_BASE = "https://services.leadconnectorhq.com";

type Json = Record<string, unknown>;

async function ghlFetch(path: string, init?: RequestInit): Promise<Json> {
  const token = process.env["GHL_API_TOKEN"];
  if (!token) throw new Error("GHL_API_TOKEN is not configured");

  const res = await fetch(`${GHL_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Version: "2021-07-28",
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const text = await res.text();
  if (!res.ok) {
    console.error("GHL API error", path, res.status, text.slice(0, 300));
    throw new Error(`GHL request failed (${res.status})`);
  }
  try {
    return JSON.parse(text) as Json;
  } catch {
    return {};
  }
}

function locationId() {
  const id = process.env["GHL_LOCATION_ID"];
  if (!id) throw new Error("GHL_LOCATION_ID is not configured");
  return id;
}

export async function tagVenueRentalLead(lead: { name: string; email: string; phone: string }) {
  const data = await ghlFetch("/contacts/upsert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      locationId: locationId(),
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      source: "thekultla.com/venue-rental",
    }),
  });
  const contact = data["contact"] as Json | undefined;
  const contactId = contact?.["id"];
  if (typeof contactId !== "string" || !contactId) {
    throw new Error("GHL did not confirm a contact for venue inquiry");
  }
  // Add, rather than replace, tags so existing contact tags are preserved.
  await ghlFetch(`/contacts/${encodeURIComponent(contactId)}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tags: ["Google-Ads"] }),
  });
}

export type GhlContact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  createdAt: string;
  tags: string[];
};

export async function fetchContacts(query?: string): Promise<GhlContact[]> {
  const params = new URLSearchParams({ locationId: locationId(), limit: "50" });
  if (query) params.set("query", query);
  const data = await ghlFetch(`/contacts/?${params.toString()}`);
  const list = (data["contacts"] as Json[] | undefined) ?? [];
  return list.map((c) => ({
    id: String(c["id"] ?? ""),
    name:
      String(c["contactName"] ?? "") ||
      [c["firstName"], c["lastName"]].filter(Boolean).join(" ") ||
      "—",
    email: String(c["email"] ?? ""),
    phone: String(c["phone"] ?? ""),
    source: String(c["source"] ?? ""),
    createdAt: String(c["dateAdded"] ?? c["createdAt"] ?? ""),
    tags: Array.isArray(c["tags"]) ? (c["tags"] as unknown[]).map(String) : [],
  }));
}

export type GhlConversation = {
  id: string;
  contactId: string;
  contactName: string;
  email: string;
  phone: string;
  type: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
};

const TYPE_LABEL: Record<string, string> = {
  TYPE_PHONE: "Call",
  TYPE_CALL: "Call",
  TYPE_EMAIL: "Email",
  TYPE_SMS: "Text",
  TYPE_FB_MESSENGER: "Facebook",
  TYPE_IG: "Instagram",
  TYPE_WEBCHAT: "Website chat",
  TYPE_LIVE_CHAT: "Website chat",
  TYPE_CUSTOM_SMS: "Text",
  TYPE_CUSTOM_EMAIL: "Email",
};

export async function fetchConversations(channel?: string, query?: string): Promise<GhlConversation[]> {
  const params = new URLSearchParams({ locationId: locationId(), limit: "50" });
  if (query) params.set("query", query);
  const data = await ghlFetch(`/conversations/search?${params.toString()}`);
  const list = (data["conversations"] as Json[] | undefined) ?? [];
  const mapped = list.map((c) => {
    const rawType = String(c["lastMessageType"] ?? c["type"] ?? "");
    return {
      id: String(c["id"] ?? ""),
      contactId: String(c["contactId"] ?? ""),
      contactName: String(c["contactName"] ?? c["fullName"] ?? "—"),
      email: String(c["email"] ?? ""),
      phone: String(c["phone"] ?? ""),
      type: TYPE_LABEL[rawType] ?? rawType.replace("TYPE_", "").toLowerCase() ?? "Other",
      lastMessage: String(c["lastMessageBody"] ?? ""),
      lastMessageAt: String(c["lastMessageDate"] ?? c["dateUpdated"] ?? ""),
      unread: Number(c["unreadCount"] ?? 0),
    };
  });
  if (!channel || channel === "all") return mapped;
  return mapped.filter((m) => m.type.toLowerCase() === channel.toLowerCase());
}

export type GhlMessage = {
  id: string;
  body: string;
  type: string;
  direction: "inbound" | "outbound";
  createdAt: string;
  status: string;
  isCall: boolean;
  callDuration: number;
};

export async function fetchMessages(conversationId: string): Promise<GhlMessage[]> {
  const data = await ghlFetch(`/conversations/${encodeURIComponent(conversationId)}/messages?limit=100`);
  const wrapper = (data["messages"] ?? {}) as Json;
  const list = (Array.isArray(wrapper) ? wrapper : ((wrapper["messages"] as Json[] | undefined) ?? [])) as Json[];
  return list
    .map((m) => {
      const rawType = String(m["messageType"] ?? m["type"] ?? "");
      const meta = (m["meta"] ?? {}) as Json;
      const call = (meta["call"] ?? {}) as Json;
      const isCall = rawType.toUpperCase().includes("CALL") || Boolean(call["duration"] ?? call["status"]);
      return {
        id: String(m["id"] ?? ""),
        body: String(m["body"] ?? m["message"] ?? ""),
        type: isCall ? "Call" : (TYPE_LABEL[rawType] ?? rawType.replace("TYPE_", "").toLowerCase() ?? "Message"),
        direction: String(m["direction"] ?? "inbound") === "outbound" ? ("outbound" as const) : ("inbound" as const),
        createdAt: String(m["dateAdded"] ?? m["createdAt"] ?? ""),
        status: String(call["status"] ?? m["status"] ?? ""),
        isCall,
        callDuration: Number(call["duration"] ?? 0),
      };
    })
    .sort((a, b) => Date.parse(a.createdAt || "0") - Date.parse(b.createdAt || "0"));
}

export async function markConversationRead(conversationId: string): Promise<void> {
  await ghlFetch(`/conversations/${encodeURIComponent(conversationId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ locationId: locationId(), unreadCount: 0 }),
  });
}

export async function sendMessage(input: {
  contactId: string;
  channel: "SMS" | "Email";
  message: string;
  subject?: string | undefined;
}): Promise<{ id: string }> {
  const body: Record<string, unknown> = {
    type: input.channel,
    contactId: input.contactId,
    message: input.message,
  };
  if (input.channel === "Email") {
    body["subject"] = input.subject?.trim() || "The Kult LA";
    body["html"] = `<p>${input.message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\n/g, "<br/>")}</p>`;
  }
  const data = await ghlFetch(`/conversations/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { id: String(data["messageId"] ?? data["id"] ?? "") };
}


export type GhlAppointment = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  contactName: string;
  calendar: string;
};

export async function fetchAppointments(): Promise<GhlAppointment[]> {
  const loc = locationId();
  const calendars =
    ((await ghlFetch(`/calendars/?locationId=${loc}`))["calendars"] as Json[] | undefined) ?? [];

  const startTime = String(Date.now() - 1000 * 60 * 60 * 24 * 7);
  const endTime = String(Date.now() + 1000 * 60 * 60 * 24 * 90);

  const results: GhlAppointment[] = [];
  for (const cal of calendars.slice(0, 8)) {
    const calId = String(cal["id"] ?? "");
    if (!calId) continue;
    try {
      const params = new URLSearchParams({
        locationId: loc,
        calendarId: calId,
        startTime,
        endTime,
      });
      const data = await ghlFetch(`/calendars/events?${params.toString()}`);
      const list = (data["events"] as Json[] | undefined) ?? [];
      for (const e of list) {
        results.push({
          id: String(e["id"] ?? ""),
          title: String(e["title"] ?? "Appointment"),
          startTime: String(e["startTime"] ?? ""),
          endTime: String(e["endTime"] ?? ""),
          status: String(e["appointmentStatus"] ?? e["status"] ?? ""),
          contactName: String(e["contactName"] ?? ""),
          calendar: String(cal["name"] ?? ""),
        });
      }
    } catch (err) {
      console.error("Failed to load calendar events", calId, err);
    }
  }
  return results.sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export type GhlSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  formName: string;
  createdAt: string;
  fields: { label: string; value: string }[];
};

const SKIP_KEYS = new Set([
  "id",
  "contactId",
  "locationId",
  "formId",
  "name",
  "email",
  "phone",
  "createdAt",
  "eventData",
  "others",
  "pageDetails",
]);

export async function fetchSubmissions(): Promise<GhlSubmission[]> {
  const params = new URLSearchParams({ locationId: locationId(), limit: "50" });
  const data = await ghlFetch(`/forms/submissions?${params.toString()}`);
  const list = (data["submissions"] as Json[] | undefined) ?? [];
  return list.map((s) => ({
    id: String(s["id"] ?? ""),
    name: String(s["name"] ?? "—"),
    email: String(s["email"] ?? ""),
    phone: String(s["phone"] ?? ""),
    formName: String(s["formName"] ?? s["formId"] ?? "Form"),
    createdAt: String(s["createdAt"] ?? ""),
    fields: Object.entries(s)
      .filter(([k, v]) => !SKIP_KEYS.has(k) && (typeof v === "string" || typeof v === "number"))
      .slice(0, 12)
      .map(([k, v]) => ({ label: k, value: String(v) })),
  }));
}
