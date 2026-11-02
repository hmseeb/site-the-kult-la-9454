import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { venueInquirySchema } from "./venue-inquiry.schema";
import { tagVenueRentalLead } from "./ghl.server";

const GHL_WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/PkdMCggAN3lerFXTcCCW/webhook-trigger/0b476344-b8dc-455a-98e2-5f44fa1bee54";

const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(255),
  eventType: z.string().trim().min(1).max(80),
  preferredDate: z.string().trim().max(40).optional().or(z.literal("")),
  altDate: z.string().trim().max(40).optional().or(z.literal("")),
  guests: z.string().trim().max(20).optional().or(z.literal("")),
  spaces: z.string().trim().max(120).optional().or(z.literal("")),
  visibility: z.string().trim().max(40).optional().or(z.literal("")),
  production: z.string().trim().max(500).optional().or(z.literal("")),
  rooftop: z.string().trim().max(40).optional().or(z.literal("")),
  bestTime: z.string().trim().max(60).optional().or(z.literal("")),
  description: z.string().trim().max(1500).optional().or(z.literal("")),
});

export type InquiryPayload = z.infer<typeof inquirySchema>;

export const submitVenueInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: z.infer<typeof venueInquirySchema>) => venueInquirySchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const result = await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          visibility: "Private",
          source: "thekultla.com/venue-rental",
          tags: ["Google-Ads"],
          submittedAt: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (!result.ok) return { ok: false };
      await tagVenueRentalLead(data);
      return { ok: true };
    } catch {
      return { ok: false };
    }
  });

export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: InquiryPayload) => inquirySchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const res = await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source: "thekultla.com",
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) {
        console.error("GHL webhook returned non-OK status", res.status);
      }
    } catch (err) {
      console.error("Failed to forward inquiry to GHL webhook", err);
    }
    return { ok: true };
  });
