import { useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUpRight, Check, LoaderCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { venueInquirySchema } from "@/lib/venue-inquiry.schema";
import { submitVenueInquiry } from "@/lib/inquiry.functions";
import { trackVenueConversion } from "@/lib/venue-tracking";
import { venue } from "@/lib/site";

export function VenueInquiryForm({ eventType, tour }: { eventType: string; tour: boolean }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const started = useRef(false);
  const submit = useServerFn(submitVenueInquiry);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const parsed = venueInquirySchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message]),
        ),
      );
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      const result = await submit({
        data: {
          ...parsed.data,
          description: `${tour ? "Private tour requested.\n" : ""}${parsed.data.description}`,
        },
      });
      if (!result.ok) throw new Error("Delivery failed");
      setSent(true);
      trackVenueConversion("form_submit", "availability_form");
    } catch {
      setErrors({
        submit: "Your request couldn’t be sent. Please try again or call (213) 232-7364.",
      });
    } finally {
      setBusy(false);
    }
  }
  if (sent)
    return (
      <div role="status" className="py-10">
        <Check className="mb-5 size-8 text-brass" />
        <h3 className="text-4xl">Your request is in.</h3>
        <p className="mt-5 text-muted-foreground">
          Our team will follow up about your date and next steps. If your event is urgent, call us
          directly.
        </p>
        <Button asChild className="mt-7 h-12">
          <a
            href={venue.rentalPhoneHref}
            onClick={() => trackVenueConversion("phone_click", "confirmation")}
          >
            <Phone />
            {venue.rentalPhone}
          </a>
        </Button>
      </div>
    );
  const inputClass = "mt-2 h-12 rounded-sm bg-background text-base";
  return (
    <form
      noValidate
      onSubmit={onSubmit}
      onFocus={() => {
        if (!started.current) {
          started.current = true;
          trackVenueConversion("form_start", "availability_form");
        }
      }}
      className="grid gap-5 sm:grid-cols-2"
    >
      {(
        [
          ["name", "Name", "text", "name", true],
          ["phone", "Phone", "tel", "tel", true],
          ["email", "Email", "email", "email", true],
        ] as const
      ).map(([name, label, type, autocomplete, required]) => (
        <label key={name} className={name === "name" ? "sm:col-span-2" : ""}>
          <span className="text-sm">
            {label} <span className="text-brass">*</span>
          </span>
          <Input
            name={name}
            type={type}
            autoComplete={autocomplete}
            required={required}
            maxLength={name === "phone" ? 30 : name === "name" ? 100 : 255}
            className={inputClass}
            aria-invalid={Boolean(errors[name])}
            aria-describedby={errors[name] ? `${name}-error` : undefined}
          />
          {errors[name] && (
            <span id={`${name}-error`} className="mt-1 block text-sm text-destructive">
              {errors[name]}
            </span>
          )}
        </label>
      ))}
      <label>
        <span className="text-sm">
          Event type <span className="text-brass">*</span>
        </span>
        <select
          key={eventType}
          name="eventType"
          required
          defaultValue={eventType}
          className={`${inputClass} w-full border border-input px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`}
          aria-invalid={Boolean(errors['eventType'])}
        >
          <option value="">Select event type</option>
          {[
            "Weddings",
            "Corporate Events",
            "Film Premieres & Screenings",
            "Private Parties",
            "Other",
          ].map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
        {errors['eventType'] && (
          <span className="mt-1 block text-sm text-destructive">{errors['eventType']}</span>
        )}
      </label>
      <label>
        <span className="text-sm">Preferred event date</span>
        <Input name="preferredDate" type="date" className={inputClass} />
      </label>
      <label className="sm:col-span-2">
        <span className="text-sm">Estimated guest count</span>
        <Input name="guests" type="number" min="1" inputMode="numeric" className={inputClass} />
      </label>
      <label className="sm:col-span-2">
        <span className="text-sm">
          Message <span className="text-muted-foreground">(optional)</span>
        </span>
        <textarea
          name="description"
          maxLength={1500}
          rows={3}
          className="mt-2 w-full resize-y rounded-sm border border-input bg-background p-3 text-base focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder={
            tour
              ? "Tell us when you’d like to tour the venue."
              : "Tell us a little about your event."
          }
        />
      </label>
      {errors['submit'] && (
        <p role="alert" className="text-sm text-destructive sm:col-span-2">
          {errors['submit']}
        </p>
      )}
      <Button disabled={busy} type="submit" className="h-14 rounded-sm text-base sm:col-span-2">
        {busy ? <LoaderCircle className="animate-spin" /> : <ArrowUpRight />}
        {busy ? "Sending…" : "Check Availability"}
      </Button>
      <p className="text-xs leading-relaxed text-muted-foreground sm:col-span-2">
        No obligation. Tell us about your event and our team will follow up. By submitting, you
        agree to our{" "}
        <a href="/privacy" className="underline underline-offset-4">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
