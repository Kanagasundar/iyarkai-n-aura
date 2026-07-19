import { loadSiteData } from "./data-loader.js";
import { qs } from "./utils/dom.js";

import { renderAnnouncement } from "./components/announcement.js";
import { renderNav } from "./components/nav.js";
import { renderHero } from "./components/hero.js";
import { renderStats } from "./components/stats.js";
import { renderProducts } from "./components/products.js";
import { renderWhyUs } from "./components/whyUs.js";
import { renderBrandStory } from "./components/brandStory.js";
import { renderGallery } from "./components/gallery.js";
import { renderReviews } from "./components/reviews.js";
import { renderFAQ } from "./components/faq.js";
import { renderCTA } from "./components/cta.js";
import { renderFooter } from "./components/footer.js";
import { renderFloatingActions } from "./components/floatingActions.js";

import { initScrollReveal, initParallax, initCountUp } from "./motion.js";
import { initScrollProgress, initHeaderShadow, initBackToTop, initAnnouncementDismiss, initFooterYear } from "./chrome.js";

async function boot() {
  let data;
  try {
    data = await loadSiteData();
  } catch (err) {
    console.error("Iyarkai'n Aura: failed to load site data", err);
    renderLoadError();
    return;
  }

  applySEO(data.site.seo, data.site.brand);

  renderAnnouncement(qs("#announcement"), data.site);
  renderNav(qs("#site-header"), data.site);
  renderHero(qs("#hero"), data.site);
  renderStats(qs("#stats"), data.site);
  renderProducts(qs("#products"), { ...data.site, products: data.products });
  renderWhyUs(qs("#why-us"), data.site);
  renderBrandStory(qs("#story"), data.site);
  renderGallery(qs("#gallery"), { ...data.site, gallery: data.gallery });
  renderReviews(qs("#reviews"), { ...data.site, reviews: data.reviews });
  renderFAQ(qs("#faq"), { ...data.site, faq: data.faq });
  renderCTA(qs("#contact"), data.site);
  renderFooter(qs("#site-footer"), data.site);
  renderFloatingActions(qs("#floating-actions"), data.site);

  // Chrome / page behaviors
  initScrollProgress();
  initHeaderShadow();
  initBackToTop();
  initAnnouncementDismiss();
  initFooterYear();

  // Motion — run after all components are in the DOM
  initScrollReveal();
  initParallax();
  initCountUp();

  document.body.classList.add("is-ready");
}

function applySEO(seo, brand) {
  if (!seo) return;
  if (seo.title) document.title = seo.title;

  const setMeta = (selector, attr, value) => {
    if (!value) return;
    const node = document.querySelector(selector);
    if (node) node.setAttribute(attr, value);
  };

  setMeta('meta[name="description"]', "content", seo.description);
  setMeta('meta[name="keywords"]', "content", (seo.keywords || []).join(", "));
  setMeta('meta[name="theme-color"]', "content", seo.themeColor);
  setMeta('meta[property="og:title"]', "content", seo.title);
  setMeta('meta[property="og:description"]', "content", seo.description);
  setMeta('meta[property="og:image"]', "content", seo.ogImage);
  setMeta('meta[property="og:url"]', "content", seo.siteUrl);
  setMeta('meta[name="twitter:title"]', "content", seo.title);
  setMeta('meta[name="twitter:description"]', "content", seo.description);
  setMeta('meta[name="twitter:image"]', "content", seo.ogImage);

  const schemaNode = document.querySelector("#schema-org");
  if (schemaNode && brand) {
    try {
      const schema = JSON.parse(schemaNode.textContent);
      schema.name = brand.name;
      schemaNode.textContent = JSON.stringify(schema);
    } catch {
      /* leave static schema as-is if parsing fails */
    }
  }
}

function renderLoadError() {
  const main = document.getElementById("main");
  if (!main) return;
  main.innerHTML = `
    <div class="container" style="padding:120px 0; text-align:center; max-width:640px;">
      <h1 style="margin-bottom:16px;">Content couldn't load</h1>
      <p style="color:var(--clr-text-muted); margin-bottom:12px;">
        This site loads its content from local JSON files using <code>fetch()</code>, which browsers block when a
        page is opened directly as a <code>file://</code> path.
      </p>
      <p style="color:var(--clr-text-muted);">
        Serve this folder with a local static server and reload, for example:<br>
        <code>python -m http.server</code> or the VS&nbsp;Code "Live&nbsp;Server" extension.<br>
        On GitHub Pages this works automatically — no server setup needed.
      </p>
    </div>
  `;
}

boot();
