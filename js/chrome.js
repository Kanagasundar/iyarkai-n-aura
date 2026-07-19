// Page "chrome" behaviors that aren't tied to a specific JSON-rendered
// component: scroll progress bar, sticky header shadow, back-to-top button,
// announcement bar dismissal, footer year.

import { qs } from "./utils/dom.js";

export function initScrollProgress() {
  const bar = qs(".scroll-progress");
  if (!bar) return;
  let ticking = false;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + "%";
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
  update();
}

export function initHeaderShadow() {
  const header = qs("#site-header");
  if (!header) return;
  function onScroll() {
    header.style.boxShadow = window.scrollY > 8 ? "0 4px 20px rgba(31,54,37,.1)" : "none";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

export function initBackToTop() {
  const btn = qs("#back-to-top");
  if (!btn) return;
  function onScroll() {
    btn.classList.toggle("is-visible", window.scrollY > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  onScroll();
}

const ANNOUNCEMENT_DISMISS_KEY = "iyarkainaura-announcement-dismissed";

export function initAnnouncementDismiss() {
  const bar = qs("#announcement");
  const closeBtn = qs("#announcement-close");
  if (!bar || !closeBtn) return;

  if (sessionStorage.getItem(ANNOUNCEMENT_DISMISS_KEY) === "1") {
    bar.hidden = true;
    return;
  }

  closeBtn.addEventListener("click", () => {
    bar.hidden = true;
    sessionStorage.setItem(ANNOUNCEMENT_DISMISS_KEY, "1");
  });
}

export function initFooterYear() {
  const yearEl = qs("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
