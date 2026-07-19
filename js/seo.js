// Builds and injects all SEO metadata + JSON-LD structured data at runtime,
// entirely from the loaded JSON (data/site.json, products.json, reviews.json,
// faq.json). Nothing here is hardcoded content — only the mechanics of
// wiring data → <meta>/<script type="application/ld+json"> tags.
//
// Search engines that execute JavaScript (Google, Bing) see the full,
// enriched output below. The static tags already present in index.html's
// <head> are the no-JS / first-paint fallback and only cover the basics
// (title, description, brand) — see README.md for that trade-off.

import { toPlainText, absoluteUrl } from "./utils/dom.js";

export function applySEO({ site, products, reviews, faq }) {
  const { seo, brand, contact } = site;
  if (!seo) return;

  document.title = seo.title || document.title;
  document.documentElement.lang = "en";

  const siteUrl = seo.siteUrl || "";
  const absOgImage = absoluteUrl(seo.ogImage, siteUrl);
  const description = seo.description || "";

  setMetaContent('meta[name="description"]', description);
  setMetaContent('meta[name="keywords"]', (seo.keywords || []).join(", "));
  setMetaContent('meta[name="robots"]', "index, follow, max-image-preview:large");
  setMetaContent('meta[name="author"]', brand?.name || "");
  setMetaContent('meta[name="theme-color"]', seo.themeColor || "");

  setLinkHref('link[rel="canonical"]', siteUrl);

  setMetaContent('meta[property="og:type"]', "website");
  setMetaContent('meta[property="og:site_name"]', brand?.name || "");
  setMetaContent('meta[property="og:locale"]', "en_IN");
  setMetaContent('meta[property="og:title"]', seo.title || "");
  setMetaContent('meta[property="og:description"]', description);
  setMetaContent('meta[property="og:image"]', absOgImage);
  setMetaContent('meta[property="og:image:width"]', "1200");
  setMetaContent('meta[property="og:image:height"]', "630");
  setMetaContent('meta[property="og:image:alt"]', seo.title || "");
  setMetaContent('meta[property="og:url"]', siteUrl);

  setMetaContent('meta[name="twitter:card"]', "summary_large_image");
  setMetaContent('meta[name="twitter:title"]', seo.title || "");
  setMetaContent('meta[name="twitter:description"]', description);
  setMetaContent('meta[name="twitter:image"]', absOgImage);

  injectStructuredData(buildStructuredData({ site, products, reviews, faq, siteUrl, absOgImage }));
}

function setMetaContent(selector, value) {
  if (!value) return;
  const node = document.querySelector(selector);
  if (node) node.setAttribute("content", value);
}

function setLinkHref(selector, value) {
  if (!value) return;
  const node = document.querySelector(selector);
  if (node) node.setAttribute("href", value);
}

/**
 * Builds every JSON-LD graph node from the site's data. Returns an array of
 * plain objects — one per <script type="application/ld+json"> tag.
 */
function buildStructuredData({ site, products, reviews, faq, siteUrl, absOgImage }) {
  const { brand, seo, contact } = site;
  const graphs = [];

  // --- Organization / LocalBusiness -------------------------------------
  const org = {
    "@context": "https://schema.org",
    "@type": ["Organization", "HealthAndBeautyBusiness"],
    "@id": siteUrl ? `${siteUrl}#organization` : undefined,
    name: brand?.name,
    description: toPlainText(seo?.description),
    url: siteUrl || undefined,
    image: absOgImage || undefined,
    logo: absoluteUrl(brand?.logoFull || brand?.logoMark, siteUrl) || undefined,
  };
  if (contact?.phoneHref) org.telephone = contact.phoneHref;
  if (contact?.email) org.email = contact.email;
  if (contact?.addressLines?.length) {
    org.address = {
      "@type": "PostalAddress",
      streetAddress: contact.addressLines
        .map((line) => line.replace(/,\s*$/, "").trim())
        .join(", "),
      addressCountry: "IN",
    };
  }
  const sameAs = [contact?.instagram?.url, contact?.facebook?.url].filter(Boolean);
  // Avoid listing the same profile URL twice under different labels.
  org.sameAs = Array.from(new Set(sameAs));
  if (Array.isArray(reviews) && reviews.length) {
    org.aggregateRating = buildAggregateRating(reviews);
  }
  graphs.push(prune(org));

  // --- Products -----------------------------------------------------------
  if (Array.isArray(products) && products.length) {
    products.forEach((product) => {
      graphs.push(
        prune({
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: toPlainText(product.description),
          image: absoluteUrl(product.image, siteUrl) || undefined,
          brand: brand?.name ? { "@type": "Brand", name: brand.name } : undefined,
          sku: product.id,
          offers: {
            "@type": "Offer",
            url: siteUrl ? `${siteUrl}#products` : undefined,
            priceCurrency: "INR",
            price: product.price,
            availability: "https://schema.org/InStock",
          },
        })
      );
    });
  }

  // --- FAQ Page -------------------------------------------------------------
  if (Array.isArray(faq) && faq.length) {
    graphs.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: toPlainText(item.question),
        acceptedAnswer: {
          "@type": "Answer",
          text: toPlainText(item.answer),
        },
      })),
    });
  }

  return graphs;
}

function buildAggregateRating(reviews) {
  const total = reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
  const average = total / reviews.length;
  return {
    "@type": "AggregateRating",
    ratingValue: Math.round(average * 10) / 10,
    reviewCount: reviews.length,
    bestRating: 5,
    worstRating: 1,
  };
}

/** Remove undefined/empty values so the JSON-LD output stays clean. */
function prune(obj) {
  const out = Array.isArray(obj) ? [] : {};
  for (const [key, value] of Object.entries(obj)) {
    if (value == null || value === "") continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out[key] = value && typeof value === "object" && !Array.isArray(value) ? prune(value) : value;
  }
  return out;
}

function injectStructuredData(graphs) {
  // Remove any structured data we injected on a previous render pass
  // (not expected in this single-render app, but keeps this idempotent).
  document.querySelectorAll('script[data-seo="generated"]').forEach((node) => node.remove());

  // Replace the minimal static fallback (for no-JS crawlers) with the full,
  // data-driven set below — avoids two conflicting Organization schemas.
  document.querySelector("#schema-org")?.remove();

  graphs.forEach((graph) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seo = "generated";
    script.textContent = JSON.stringify(graph);
    document.head.appendChild(script);
  });
}
