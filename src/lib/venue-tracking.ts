export type VenueConversion =
  "phone_click" | "primary_cta_click" | "form_start" | "form_submit" | "schedule_tour_click";

type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

function fireAdsConversion(callback?: () => void) {
  if (typeof window === "undefined") return;
  const win = window as GtagWindow;
  if (typeof win.gtag !== "function") {
    callback?.();
    return;
  }
  win.gtag("event", "ads_conversion_Contact_Us_1", {
    event_callback: callback,
    event_timeout: 2000,
  });
}

export function trackVenueConversion(event: VenueConversion, placement: string) {
  if (typeof window === "undefined") return;
  const target = window as Window & { dataLayer?: Record<string, string>[] };
  target.dataLayer ??= [];
  target.dataLayer.push({ event, page_type: "private_venue_rental", placement });
  // form_start is not a lead yet; only fire the Google Ads conversion on real contact actions.
  if (event !== "form_start") {
    fireAdsConversion();
  }
}

/**
 * Click handler for tel: links — sends the Google Ads conversion first,
 * then navigates (delayed-navigation helper pattern from Google).
 */
export function trackPhoneClick(placement: string, href: string) {
  return (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (typeof window === "undefined") return;
    const target = window as Window & { dataLayer?: Record<string, string>[] };
    target.dataLayer ??= [];
    target.dataLayer.push({ event: "phone_click", page_type: "private_venue_rental", placement });
    fireAdsConversion(() => {
      window.location.href = href;
    });
  };
}
