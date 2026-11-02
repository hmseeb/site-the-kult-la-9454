import { z } from "zod";

export const venueInquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z.string().trim().min(7, "Enter your phone number").max(30),
  email: z.string().trim().email("Enter a valid email").max(255),
  eventType: z.string().trim().min(1, "Select an event type").max(80),
  preferredDate: z.string().trim().max(40),
  guests: z.string().trim().max(20),
  description: z.string().trim().max(1500),
});
