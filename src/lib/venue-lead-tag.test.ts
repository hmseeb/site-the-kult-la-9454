import { it } from "node:test";
import assert from "node:assert/strict";
import { tagVenueRentalLead } from "./ghl.server";

it("adds the exact Google-Ads tag to the venue lead without replacing existing tags", async () => {
  const originalFetch = globalThis.fetch;
  const originalToken = process.env["GHL_API_TOKEN"];
  const originalLocation = process.env["GHL_LOCATION_ID"];
  const requests: { url: string; method: string | undefined; body: Record<string, unknown> }[] = [];
  process.env["GHL_API_TOKEN"] = "test-token";
  process.env["GHL_LOCATION_ID"] = "test-location";
  globalThis.fetch = (async (url, init) => {
    requests.push({ url: String(url), method: init?.method, body: JSON.parse(String(init?.body)) });
    return new Response(JSON.stringify({ contact: { id: "test-contact", tags: ["Existing"] } }), { status: 200 });
  }) as typeof fetch;
  try {
    await tagVenueRentalLead({ name: "Test Host", email: "host@example.com", phone: "+12135550100" });
    assert.equal(requests.length, 2);
    assert.equal(requests[0]?.body["source"], "thekultla.com/venue-rental");
    assert.equal(requests[0]?.body["tags"], undefined);
    assert.equal(requests[1]?.url, "https://services.leadconnectorhq.com/contacts/test-contact/tags");
    assert.equal(requests[1]?.method, "POST");
    assert.deepEqual(requests[1]?.body, { tags: ["Google-Ads"] });
  } finally {
    globalThis.fetch = originalFetch;
    if (originalToken === undefined) delete process.env["GHL_API_TOKEN"];
    else process.env["GHL_API_TOKEN"] = originalToken;
    if (originalLocation === undefined) delete process.env["GHL_LOCATION_ID"];
    else process.env["GHL_LOCATION_ID"] = originalLocation;
  }
});