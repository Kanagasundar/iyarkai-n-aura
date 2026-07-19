import { icon } from "../utils/icons.js";
import { whatsappLink } from "../utils/dom.js";

export function renderHero(container, { hero, contact }) {
  if (!container) return;

  const secondaryHref =
    hero.secondaryCta.href === "whatsapp"
      ? whatsappLink(contact.whatsappNumber, contact.whatsappDefaultText)
      : hero.secondaryCta.href;

  const badges = hero.trustBadges
    .map((b) => `<li>${icon(b.icon)} ${b.label}</li>`)
    .join("");

  container.innerHTML = `
    <div class="blob-field" aria-hidden="true">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>
    <div class="container hero-inner">
      <div class="hero-copy">
        <p class="eyebrow" data-animate="fade-up">${icon("leaf")} ${hero.eyebrow}</p>
        <h1 data-animate="fade-up" style="transition-delay:80ms">
          ${hero.headingLine1}<br>
          <span class="accent">${hero.headingLine2}</span>
        </h1>
        <p class="hero-sub" data-animate="fade-up" style="transition-delay:160ms">${hero.subheading}</p>

        <div class="hero-actions" data-animate="fade-up" style="transition-delay:220ms">
          <a href="${hero.primaryCta.href}" class="btn btn-primary">${hero.primaryCta.label}</a>
          <a href="${secondaryHref}" class="btn btn-outline is-whatsapp" target="_blank" rel="noopener">
            ${icon("whatsapp")} ${hero.secondaryCta.label}
          </a>
        </div>

        <ul class="trust-badges" data-stagger style="transition-delay:280ms">
          ${badges}
        </ul>
      </div>

      <div class="hero-media" data-animate="fade-left">
        <div class="hero-media-frame zoom-on-hover">
          <img src="${hero.image}" alt="${hero.imageAlt}" width="1400" height="933" loading="eager" fetchpriority="high">
        </div>
        <span class="hero-media-badge">
          <strong>${hero.badgeValue}</strong>
          ${hero.badgeLabel}
        </span>
      </div>
    </div>
  `;
}
