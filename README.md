# Iyarkai'n Aura — Landing Page

A premium, front-end-only, JSON-driven landing page for **Iyarkai'n Aura**
(handmade natural skincare & hair care, by MK Handicrafts). Built for
visitors scanning a QR code on a flex banner — fast, mobile-first, light
theme only.

**Stack:** HTML5 + CSS3 + vanilla JavaScript (ES modules). No build step,
no framework, no backend, no database.

---

## Editing content — the only thing you should ever touch

Everything visible on the page — brand name, hero copy, nav links,
products, "Why Us" features, brand story, gallery photos, testimonials,
FAQ, contact details, footer, even SEO metadata — is loaded at runtime
from the JSON files in [`data/`](data/). **You should not need to edit
`index.html`, `css/*` or `js/*` for routine content updates.**

Workflow:

1. Edit the relevant file in `data/`.
2. Save.
3. `git add -A && git commit -m "Update products"` and `git push`.
4. GitHub Pages rebuilds automatically (nothing to run) and the live site
   reflects your change within a minute or two.

### `data/site.json`

The "everything else" file — one object per section:

| Key | Drives |
|---|---|
| `brand` | Name, tagline, logo images used in the header/footer |
| `seo` | `<title>`, meta description, keywords, Open Graph/Twitter image, theme color |
| `announcement` | The dismissible bar above the header (set `"enabled": false` to hide it) |
| `nav` | Header nav links + the "Shop Now" button |
| `hero` | Headline, subheading, CTA buttons, hero image, trust badges |
| `stats` | The count-up number strip under the hero |
| `productsSection` | Heading/lead text above the product grid + category filter chips |
| `whyUs` | "Why Choose Us" heading + the 6 feature cards |
| `brandStory` | "Our Story" section copy + image |
| `gallerySection` | Heading/lead above the photo gallery |
| `reviewsSection` | Heading/lead above the testimonial slider |
| `faqSection` | Heading/lead above the FAQ accordion |
| `cta` | The dark "Ready to unpack..." call-to-action block |
| `contact` | Phone, WhatsApp number, email, address, Instagram/Facebook — used by the CTA section, footer **and** the floating WhatsApp button |
| `footer` | Footer blurb, tagline, copyright name/credit line |

**WhatsApp number:** update `contact.whatsappNumber` (digits only, with
country code, e.g. `919876543210`) and `contact.phoneHref` /
`contact.phoneDisplay` — every WhatsApp/call link on the page (hero,
product cards, CTA section, footer, floating button) is generated from
these two fields, so you only edit them once.

### `data/products.json`

An array — one object per product card. Copy an existing entry to add a
new product:

```json
{
  "id": "rose-face-cream",
  "name": "Rose Face Cream",
  "category": "face-creams",
  "image": "assets/img/rose-cream.jpg",
  "imageAlt": "Iyarkai'n Aura Rose Face Cream, 50g jar",
  "description": "Deep hydration, softness & glow...",
  "size": "50g",
  "meta": "Suits all skin types",
  "price": 180,
  "mrp": 200,
  "tag": "Bestseller"
}
```

- `category` must match one of the `id`s in `site.json → productsSection.categories`
  (or add a new category there first).
- `tag` is optional — set to `null` to hide the ribbon badge.
- `mrp` is optional — omit it (or make it equal to `price`) to hide the
  strikethrough price.
- Product images live in `assets/img/` — drop a new photo in there and
  point `image` at it (ideally a square-ish crop, ~900px wide, under
  300KB for fast loading).

### `data/reviews.json`

An array of testimonials: `name`, `rating` (1–5), `text`, `product`.
Shown in the auto-playing review slider.

### `data/faq.json`

An array of `{ "question": "...", "answer": "..." }` objects, rendered
as an accordion.

### `data/gallery.json`

An array of gallery photos: `image`, `alt`, `caption`, `category`. Shown
in the masonry gallery with a click-to-zoom lightbox.

---

## Project structure

```
index.html            Page shell — mount points only, no hardcoded content
README.md
data/                  ← edit these for content updates
  site.json
  products.json
  reviews.json
  faq.json
  gallery.json
assets/
  img/                 Product photos, logo, gallery images (all real photography)
css/
  tokens.css           Design tokens (colors, spacing, type, shadows)
  base.css             Reset, typography, buttons, layout utilities
  animations.css       Scroll-reveal, parallax, floating blobs, reduced-motion rules
  components.css       Every section's styles (nav, hero, products, gallery, FAQ, etc.)
js/
  main.js              Orchestrator — loads data, calls each renderer, boots motion/chrome
  data-loader.js        fetch()es every data/*.json file
  seo.js                 Builds meta tags + JSON-LD structured data from JSON (see below)
  motion.js             Scroll-reveal / parallax / count-up engine
  chrome.js              Scroll progress bar, sticky header shadow, back-to-top, announcement dismiss
  utils/
    dom.js               Small DOM/formatting helpers (₹ formatting, wa.me link builder, escaping)
    icons.js              Inline SVG icon registry (no icon-font/network request)
  components/            One file per page section — each exports a `render*(container, data)` function
    nav.js, hero.js, stats.js, products.js, whyUs.js, brandStory.js,
    gallery.js, reviews.js, faq.js, cta.js, footer.js, announcement.js,
    floatingActions.js
robots.txt             Crawler access + sitemap pointer
sitemap.xml             Single-page sitemap (update <lastmod> after major content changes)
```

Adding a brand-new section (rare — most changes only need JSON edits):
create `js/components/yourSection.js` exporting a `renderYourSection(container, data)`
function, add a matching empty `<section id="your-section">` in
`index.html`, and call it from `js/main.js`.

---

## Running locally

Browsers block `fetch()` of local files opened via `file://`, so
double-clicking `index.html` will show a "content couldn't load" message.
Serve the folder instead — any of these work:

```bash
# Python (built into most systems)
python -m http.server

# Node
npx serve .
```

Then open `http://localhost:8000` (or whatever port it prints). Or use
the VS Code **Live Server** extension and click "Go Live".

GitHub Pages serves everything over HTTPS automatically, so this
limitation does not apply once deployed — no server setup needed there.

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository.
2. Repo **Settings → Pages → Source**: select the branch (e.g. `main`)
   and root folder (`/`).
3. Save — GitHub gives you a `https://<username>.github.io/<repo>/` URL
   within a minute.
4. Every future `git push` to that branch redeploys automatically.

If you're using a custom domain, update `data/site.json → seo.siteUrl` to
match — `js/seo.js` reads that one value and propagates it everywhere
(canonical link, Open Graph/Twitter tags, and every JSON-LD `url`/`@id`).
The static tags in `index.html`'s `<head>` are a no-JS fallback for the
same values and should be updated too if you change domains.

---

## SEO

Almost everything search-engine-facing is generated at runtime by
`js/seo.js`, straight from the same JSON that drives the page, so there's
nothing extra to maintain:

- **Meta tags** — title, description, keywords, canonical URL, Open Graph
  and Twitter Card tags, all sourced from `data/site.json → seo`.
- **JSON-LD structured data** — injected fresh on every page load:
  - `Organization` + `HealthAndBeautyBusiness` — name, description, logo,
    phone, email, postal address and social links, straight from
    `site.json → brand` and `contact`, plus an `AggregateRating` computed
    live from `data/reviews.json`.
  - One `Product` entry per item in `data/products.json` (name, image,
    price, currency, availability) — eligible for Google's product rich
    results.
  - `FAQPage` built from every entry in `data/faq.json` — eligible for
    FAQ rich results.
- **`robots.txt`** and **`sitemap.xml`** at the site root for crawler
  discovery. Bump `<lastmod>` in `sitemap.xml` after a significant content
  update (optional — it's a single-page site, so this mostly matters for
  re-crawl timing, not ranking).

Because this all comes from `data/*.json`, adding a product or an FAQ
automatically adds a matching rich-result-eligible entry — no separate
"SEO" step required.

To sanity-check the generated structured data any time, open the live
(or locally-served) page, view source of the rendered DOM (not the raw
HTML file — it's injected by JS), and paste the contents of each
`<script type="application/ld+json">` tag into
[Google's Rich Results Test](https://search.google.com/test/rich-results).

## Design notes

- **Light theme only** — there is no dark mode toggle and no
  `prefers-color-scheme` switch; the palette is intentionally fixed.
- **Motion** respects `prefers-reduced-motion: reduce` — all
  scroll-reveal, parallax and floating-blob animation is skipped/frozen
  for users who request it, and content is shown immediately instead.
- **Performance** — images are pre-compressed real photography (not
  stock), fonts load with `display=swap`, below-the-fold images use
  `loading="lazy"`, the hero image is preloaded with
  `fetchpriority="high"`, and there are no external JS dependencies at
  all (the only third-party request is the Google Fonts stylesheet).
- **Accessibility** — semantic landmarks, skip-to-content link, visible
  focus states, `aria-expanded`/`aria-controls` on the mobile nav and FAQ
  accordion, alt text on every image, and a lightbox that's fully
  keyboard-operable (Esc to close, arrow keys to navigate).
- A `<noscript>` message is shown if JavaScript is disabled, since this
  page is 100% client-rendered by design (per the JSON-driven requirement).

## Editable placeholders still in `data/site.json`

Contact details and the site URL have been filled in with real values.
One thing worth double-checking: `contact.instagram.url` and
`contact.facebook.url` currently point to the **same** Instagram link —
if you have a separate Facebook page, update `contact.facebook.url` to
that URL (or remove the Facebook icon by clearing the footer social link
in `js/components/footer.js` if you don't have one).
