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
├── favicon.svg          # placeholder mark — swap for real brand favicon
├── robots.txt
└── sitemap.xml
```

## Features

- Responsive, mobile-first dark editorial design
- Sticky header with accessible mobile nav, plus a sticky click-to-call bar on phones
- Click-to-call links on every page (`tel:+14243554446`)
- Quote form with client-side validation, honeypot spam trap, and a pre-filled
  `mailto:` handoff (static hosting, so there is no server-side handler)
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
3. Optional: point the quote form at a form backend instead of the `mailto:` handoff
   (see `initForm()` in `js/main.js`).
