import { qs, qsa } from "../utils/dom.js";
import { icon } from "../utils/icons.js";

const AUTOPLAY_MS = 5000;

export function renderReviews(container, { reviewsSection, reviews }) {
  if (!container) return;

  container.innerHTML = `
    <div class="container">
      <div class="section-head" data-animate="fade-up">
        <p class="eyebrow center">${reviewsSection.eyebrow}</p>
        <h2>${reviewsSection.heading}</h2>
        <p class="section-lead">${reviewsSection.lead}</p>
      </div>

      <div class="reviews-viewport" id="reviews-viewport" data-animate="fade-up">
        ${reviews.map(reviewCard).join("")}
      </div>

      <div class="reviews-controls">
        <button type="button" class="reviews-arrow" id="reviews-prev" aria-label="Previous review">${icon("arrowLeft")}</button>
        <div class="reviews-dots" id="reviews-dots">
          ${reviews.map((_, i) => `<button type="button" aria-label="Go to review ${i + 1}" data-dot="${i}"></button>`).join("")}
        </div>
        <button type="button" class="reviews-arrow" id="reviews-next" aria-label="Next review">${icon("arrowRight")}</button>
      </div>
    </div>
  `;

  setupSlider(container, reviews.length);
}

function reviewCard(review) {
  const stars = "&#9733;".repeat(review.rating) + "&#9734;".repeat(5 - review.rating);
  const initial = review.name.trim().charAt(0).toUpperCase();
  return `
    <article class="review-card">
      <div class="review-stars" aria-label="${review.rating} out of 5 stars">${stars}</div>
      <p class="review-text">&ldquo;${review.text}&rdquo;</p>
      <div class="review-author-row">
        <span class="review-avatar" aria-hidden="true">${initial}</span>
        <span>
          <p class="review-author">${review.name}</p>
          ${review.product ? `<p class="review-product">${review.product}</p>` : ""}
        </span>
      </div>
    </article>
  `;
}

function setupSlider(container, count) {
  const viewport = qs("#reviews-viewport", container);
  const dots = qsa("#reviews-dots button", container);
  const prevBtn = qs("#reviews-prev", container);
  const nextBtn = qs("#reviews-next", container);
  const cards = qsa(".review-card", viewport);
  if (!viewport || !cards.length) return;

  let index = 0;
  let autoplayTimer = null;

  function goTo(i) {
    index = (i + count) % count;
    const card = cards[index];
    // Scroll only the horizontal card strip — never scrollIntoView(), which
    // can also scroll the whole page vertically if the card isn't fully
    // visible top-to-bottom (e.g. while the user is elsewhere on the page).
    const delta = card.getBoundingClientRect().left - viewport.getBoundingClientRect().left;
    viewport.scrollTo({ left: viewport.scrollLeft + delta, behavior: "smooth" });
  }

  function updateActiveDot() {
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
  }

  // Sync dots/index to whichever card is most visible (covers drag/swipe too)
  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          index = cards.indexOf(entry.target);
          updateActiveDot();
        }
      });
    },
    { root: viewport, threshold: [0.6] }
  );
  cards.forEach((card) => spyObserver.observe(card));

  prevBtn?.addEventListener("click", () => {
    goTo(index - 1);
    restartAutoplay();
  });
  nextBtn?.addEventListener("click", () => {
    goTo(index + 1);
    restartAutoplay();
  });
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goTo(Number(dot.dataset.dot));
      restartAutoplay();
    });
  });

  let isHovered = false;
  let isVisible = false;

  function startAutoplay() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    stopAutoplay();
    autoplayTimer = window.setInterval(() => goTo(index + 1), AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (autoplayTimer) window.clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
  function refreshAutoplay() {
    // Only ever autoplay while the slider is actually on screen and the
    // user isn't interacting with it — otherwise leave it stopped.
    if (isVisible && !isHovered) startAutoplay();
    else stopAutoplay();
  }
  function restartAutoplay() {
    refreshAutoplay();
  }

  viewport.addEventListener("pointerenter", () => {
    isHovered = true;
    refreshAutoplay();
  });
  viewport.addEventListener("pointerleave", () => {
    isHovered = false;
    refreshAutoplay();
  });
  viewport.addEventListener("focusin", () => {
    isHovered = true;
    refreshAutoplay();
  });
  viewport.addEventListener("focusout", () => {
    isHovered = false;
    refreshAutoplay();
  });

  // Only autoplay while the reviews section is actually scrolled into view.
  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        refreshAutoplay();
      });
    },
    { threshold: 0.4 }
  );
  visibilityObserver.observe(viewport);

  updateActiveDot();
}
