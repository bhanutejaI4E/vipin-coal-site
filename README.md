# Coal trading website — design concepts

Five homepage concepts for Vipin's new coal trading company. Every concept uses the **same placeholder content**, so the comparison is purely about look and feel.

## View

Open `index.html` in a browser (double-click works, no server needed). It links to all five concepts. Inside a concept, the toolbar at the bottom does two things:

- **Switch concepts** with the arrows.
- **Customise the current concept.** The colour dots switch themes instantly; **Aa Customise** opens a panel with 6 colour themes, 6–7 font pairings and 3 text sizes (A, A+, A++). A tip points to it on the first visit.
  - Choices are saved per concept on that device.
  - **Copy my pick** copies a plain-text summary plus a link (`?theme=…&font=…&size=…`) that reopens exactly that combination, so the client can paste their favourite into WhatsApp.
  - **Reset** restores the original design.

Hide the toolbar with `×`, or add `?clean` to the URL (useful for screenshots). The `theme`, `font` and `size` URL options still apply with `?clean`.

Fonts load from Google Fonts, so you need an internet connection.

```
index.html               Gallery / comparison page
concepts/
  01-obsidian.html       Dark editorial: ember on warm black (closest to Verslin)
  02-ledger.html         Swiss industrial, data-first: paper, ink, signal orange
  03-terminal.html       AI-era trading platform: quick-quote widget, route map, ticker
  04-strata.html         Warm and earthy, responsible sourcing: geology hero, FAQ
  05-meridian.html       Corporate navy and brass (Steelmont-like, cleaner)
  mockup-bar.js          Toolbar: concept switcher + Customise panel. Presentation aid only, delete before launch
previews/                Hero screenshots used by the gallery
```

Each concept is one self-contained HTML file with inline CSS and JS. There's no build step and no framework.

### How theming works

All colours in a concept, including the SVG illustrations, come from CSS custom properties defined in that page's `:root`. Each concept also has an inline `window.STYLE_LAB = { themes, fonts }` script just above the `mockup-bar.js` tag:

- **Theme:** a set of `--variable: value` overrides plus a swatch.
- **Font option:** a Google Fonts URL plus `--serif` / `--sans` / `--mono` overrides.

To add an option, copy an entry and change the values. Every theme was checked for WCAG AA contrast with axe, and every font × text size was checked for overflow at 390px and 1440px.

**Once Vipin picks a combination:** move that theme's values into `:root` and that font's `<link>` into `<head>`, then delete the `STYLE_LAB` script and `mockup-bar.js`.

## Placeholder content (replace before launch)

| Placeholder | Where |
|---|---|
| Company name **"Kolvara Resources"** and logo marks | everywhere |
| `+91 90000 00000`, `trade@kolvara.com` | header, contact, footer |
| Mumbai (BKC) and Visakhapatnam addresses | contact, footer |
| Stats: 6 origins, 10+ ports, 100% tested, 24h quotes | heroes |
| "Founded in 2026… deep experience" copy, vision, mission, values | about sections |
| Product spec ranges and origins (indicative only) | products |
| Transit times, sample cargo "KR-0142", vessel status | Ledger, Terminal, Meridian |
| Founder quote and "Founder Name" | Meridian |
| Social links (`href="#"`) | footers |
| **Market ticker prices (sample data)** | Terminal. Live API2/Newcastle/ICI prices need a data licence, so either license a feed or remove it |

## Accessibility

Every page was checked with axe-core (WCAG 2.0/2.1/2.2 A and AA, plus best practices) at desktop (1440px) and phone (390px) widths, with **0 violations**. Built in:

- Skip link, semantic landmarks, one `h1` per page, labelled sections
- Full keyboard support, including the mobile menu (Escape closes it and returns focus) and the Meridian commodity tabs (arrow keys, Home/End)
- Visible focus styles; AA colour contrast on text
- `prefers-reduced-motion` disables animation; the ticker becomes a static list
- Labelled form fields, required-field validation, and status messages announced via `aria-live`
- Decorative graphics hidden from screen readers; meaningful ones have text alternatives

## Before launch (once a concept is chosen)

1. Swap in the real content and logo
2. Connect the enquiry form (Formspree, Web3Forms, or a small serverless function) and add spam protection
3. Self-host fonts, add favicon, Open Graph image, `sitemap.xml` and analytics
4. Add Privacy and Terms pages
5. Deploy as a static site (Cloudflare Pages, Netlify or Vercel) on Vipin's domain
6. Bake in the chosen theme and fonts, then delete `concepts/mockup-bar.js`, its `<script>` tag and the `STYLE_LAB` script
