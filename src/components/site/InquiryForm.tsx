import { useState } from "react";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { Cta, Label } from "./Cta";
import { eventTypes, venue } from "@/lib/site";
import { submitInquiry } from "@/lib/inquiry.functions";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  company: z.string().trim().max(120).optional(),
  phone: z.string().trim().min(7, "Enter a phone number").max(30),
  email: z.string().trim().email("Enter a valid email").max(255),
  eventType: z.string().trim().min(1, "Select an event type"),
  preferredDate: z.string().trim().max(40).optional(),
  altDate: z.string().trim().max(40).optional(),
  guests: z.string().trim().max(20).optional(),
  spaces: z.string().trim().max(120).optional(),
  visibility: z.string().trim().max(40).optional(),
  production: z.string().trim().max(500).optional(),
  rooftop: z.string().trim().max(40).optional(),
  bestTime: z.string().trim().max(60).optional(),
  description: z.string().trim().max(1500).optional(),
});

const field =
  "w-full border-b border-input bg-transparent py-3 text-sm text-foreground outline-none transition-colors placeholder:text-concrete focus:border-brass";

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-6 sm:grid-cols-2">{children}</div>;
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string | undefined;
}) {
  return (
    <label className="block">
      <span className="label-xs text-concrete">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

export function InquiryForm({ defaultEventType = "" }: { defaultEventType?: string }) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submit = useServerFn(submitInquiry);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      setStep(1);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await submit({ data: parsed.data });
      setSent(true);
    } catch {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="border border-border bg-card p-10">
        <Label>Inquiry received</Label>
        <h3 className="mt-4 text-3xl">Thank you — your request is in.</h3>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          The Kult LA team will follow up about dates, spaces and next steps. For anything
          time-sensitive, call or email us directly.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Cta href={venue.phoneHref} variant="outline">
            Call {venue.phone}
          </Cta>
          <Cta href={venue.emailHref} variant="text">
            {venue.email}
          </Cta>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <div className={cn("space-y-6", step === 2 && "hidden sm:block")}>
        <Row>
          <Field label="Full name" error={errors['name']}>
            <input name="name" className={field} placeholder="Your name" autoComplete="name" />
          </Field>
          <Field label="Company or organization">
            <input name="company" className={field} placeholder="Optional" autoComplete="organization" />
          </Field>
        </Row>
        <Row>
          <Field label="Phone" error={errors['phone']}>
            <input name="phone" type="tel" className={field} placeholder="(310) 000-0000" autoComplete="tel" />
          </Field>
          <Field label="Email" error={errors['email']}>
            <input name="email" type="email" className={field} placeholder="you@email.com" autoComplete="email" />
          </Field>
        </Row>
        <Row>
          <Field label="Event type" error={errors['eventType']}>
            <select name="eventType" defaultValue={defaultEventType} className={cn(field, "text-foreground")}>
              <option value="">Select an event type</option>
              {eventTypes.map((e) => (
                <option key={e.slug} value={e.name}>
                  {e.name}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </Field>
          <Field label="Estimated guest count">
            <input name="guests" className={field} placeholder="e.g. 120" />
          </Field>
        </Row>
        <div className="sm:hidden">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full border border-border px-7 py-4 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-foreground"
          >
            Continue — event details
          </button>
        </div>
      </div>

      <div className={cn("space-y-6", step === 1 && "hidden sm:block")}>
        <Row>
          <Field label="Preferred date">
            <input name="preferredDate" type="date" className={field} />
          </Field>
          <Field label="Alternative date">
            <input name="altDate" type="date" className={field} />
          </Field>
        </Row>
        <Row>
          <Field label="Spaces of interest">
            <select name="spaces" className={field} defaultValue="">
              <option value="">Select spaces</option>
              <option>The Theater</option>
              <option>The Lounge</option>
              <option>Rooftop Terrace</option>
              <option>Whole venue</option>
              <option>Not sure yet</option>
            </select>
          </Field>
          <Field label="Public or private event">
            <select name="visibility" className={field} defaultValue="">
              <option value="">Select one</option>
              <option>Private</option>
              <option>Public / ticketed</option>
              <option>Invite only</option>
            </select>
          </Field>
        </Row>
        <Row>
          <Field label="Rooftop interest">
            <select name="rooftop" className={field} defaultValue="">
              <option value="">Select one</option>
              <option>Yes — rooftop component</option>
              <option>No</option>
              <option>Want to discuss</option>
            </select>
          </Field>
          <Field label="Best time to contact">
            <input name="bestTime" className={field} placeholder="e.g. weekday mornings" />
          </Field>
        </Row>
        <Field label="Screening, performance or presentation needs">
          <input name="production" className={field} placeholder="Projection, live sound, stage plot, playback format" />
        </Field>
        <Field label="Event description">
          <textarea
            name="description"
            rows={4}
            className={cn(field, "resize-none")}
            placeholder="Tell us about the event, the audience and the moment you want to create."
          />
        </Field>
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center bg-primary px-8 py-4 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-amber hover:text-accent-foreground disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Request the Venue"}
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground sm:hidden"
          >
            Back
          </button>
        </div>
      </div>
    </form>
  );
}
