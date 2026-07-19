import { qs, qsa } from "../utils/dom.js";

export function renderNav(container, { brand, nav }) {
  if (!container) return;

  const links = nav.links
    .map((link) => `<li><a href="${link.href}">${link.label}</a></li>`)
    .join("");

  container.innerHTML = `
    <div class="container header-inner">
      <a href="#top" class="brand" aria-label="${brand.name} — home">
        <span class="brand-mark"><img src="${brand.logoMark}" alt="" width="44" height="44" loading="eager"></span>
        <span class="brand-name">
          <span class="brand-name-main">${brand.name}</span>
          <span class="brand-name-sub">${brand.tagline}</span>
        </span>
      </a>

      <nav class="main-nav" id="main-nav" aria-label="Primary">
        <ul>${links}</ul>
        <a class="btn btn-primary header-cta-mobile" href="${nav.ctaHref}">${nav.ctaLabel}</a>
      </nav>

      <div class="header-cta">
        <a class="btn btn-primary btn-sm" href="${nav.ctaHref}">${nav.ctaLabel}</a>
      </div>

      <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;

  setupMobileToggle();
  setupScrollSpy();
}

function setupMobileToggle() {
  const toggle = qs("#nav-toggle");
  const nav = qs("#main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  qsa("a", nav).forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
}

function setupScrollSpy() {
  const navLinks = qsa('#main-nav a[href^="#"]');
  if (!navLinks.length) return;

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = navLinks.find((a) => a.getAttribute("href") === `#${entry.target.id}`);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((a) => a.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}
