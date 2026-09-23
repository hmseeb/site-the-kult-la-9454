# The Kult LA — Website

Production-ready marketing site for **The Kult LA**, a Los Angeles creative studio
(brand identity, web design, social content, packaging/print and merch design).

- **Phone:** [(424) 355-4446](tel:+14243554446)
- **Email:** [vikvdesign@gmail.com](mailto:vikvdesign@gmail.com)
- **Location:** Los Angeles, California (by appointment)

## Stack

Vanilla HTML, CSS and JavaScript — no build step, no dependencies, no external APIs.
Open `index.html` in a browser, or serve the folder statically:

```bash
python3 -m http.server 8000
```

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Hero + CTA, services overview, process, stats, reviews, FAQ, contact |
| `services.html` | Full service detail and flat-rate pricing |
| `about.html` | Studio story, working principles, industries, reviews |
| `faq.html` | Full FAQ grouped by pricing, process and logistics |
| `contact.html` | Contact details and the quote request form |

## Structure

```
.
├── index.html
├── services.html
├── about.html
├── faq.html
├── contact.html
├── css/styles.css
├── js/main.js
├── api/ghl-lead.js      # GoHighLevel form handler (serverless function)
├── favicon.svg          # placeholder mark — swap for real brand favicon
├── robots.txt
└── sitemap.xml
```

## Features

- Responsive, mobile-first dark editorial design
- Sticky header with accessible mobile nav, plus a sticky click-to-call bar on phones
- Click-to-call links on every page (`tel:+14243554446`)
- Quote form with client-side validation, honeypot spam trap, an inline thank-you
  message, and a GoHighLevel handoff (`api/ghl-lead.js`) that creates or updates the
  contact in sub-account `PkdMCggAN3lerFXTcCCW` with first/last name, phone, email and
  the message (saved as a note), sets the "Lead Source" (Website) and "Website Form"
  custom fields, and adds the `website-lead` tag
- Service cards deep-link to the form with the service pre-selected
  (e.g. `contact.html?service=Web%20Design%20%26%20Development`)
- Semantic HTML, skip link, ARIA labelling, visible focus states
- Meta/Open Graph/Twitter tags, canonical URLs, JSON-LD (`ProfessionalService`,
  `FAQPage`, `ContactPage`), `robots.txt` and `sitemap.xml`
- Scroll-reveal animations that respect `prefers-reduced-motion`

## Before going live

1. Replace `favicon.svg` with the real brand favicon.
2. Update the `https://thekultla.com/` canonical, Open Graph and sitemap URLs if the
   production domain differs.
3. Set the `GHL_API_KEY` environment variable in the hosting dashboard to a
   GoHighLevel Private Integration token for sub-account `PkdMCggAN3lerFXTcCCW`
   (scopes: `contacts.write`, `contacts.readonly`, `locations/customFields.readonly`).
   Until it is set, form submissions fall back to the pre-filled `mailto:` handoff.
   Optionally override the sub-account with `GHL_LOCATION_ID`.
