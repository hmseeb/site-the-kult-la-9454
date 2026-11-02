import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { venueInquirySchema } from "./venue-inquiry.schema";

const inquiry = {
  name: "Test Host",
  phone: "3105550100",
  email: "host@example.com",
  eventType: "Weddings",
  preferredDate: "2027-01-10",
  guests: "50",
  description: "",
};
describe("private venue inquiries", () => {
  it("requires a phone number", () => {
    assert.equal(venueInquirySchema.safeParse({ ...inquiry, phone: "" }).success, false);
    assert.equal(venueInquirySchema.safeParse(inquiry).success, true);
  });
});
