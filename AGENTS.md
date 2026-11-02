<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep paid-search venue rental at `/venue-rental` with its own header, footer and mobile actions, bypassing the public-site shell; this preserves the general website while minimizing campaign distractions.
- Use the shared venue inquiry schema for campaign client/server validation and a separate GHL submission function that confirms delivery; this prevents false conversion success without changing the existing contact flow.
- Venue rental submissions upsert the GHL contact and use the additive contact-tags endpoint after webhook delivery; this ensures campaign tags are applied without replacing existing tags.
- Push anonymous campaign conversion events to `window.dataLayer` only from user interactions; this allows GTM integration without exposing inquiry details.

- Event-type planning and inquiry headings are explicit data fields, never derived by truncating plural labels; this preserves grammar across categories.
- Keep expired tickets as dated archives without purchase actions, and remove them from upcoming lists and the sitemap; reads must never delete events.
- Public event reads use publishable credentials and narrow artwork SELECT policies; admin writes stay behind server-validated sessions.
- Generate stable descriptive event slugs at insertion and preserve them on edits; legacy UUID links permanently redirect to the same event.
- Mount carousel full-size photos only after selection and keep visited slides for transitions; this avoids downloading every hidden full-size photo immediately.
