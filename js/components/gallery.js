import { qs, qsa } from "../utils/dom.js";
import { icon } from "../utils/icons.js";

export function renderGallery(container, { gallerySection, gallery }) {
  if (!container) return;

  container.innerHTML = `
    <div class="container">
      <div class="section-head" data-animate="fade-up">
        <p class="eyebrow center">${gallerySection.eyebrow}</p>
        <h2>${gallerySection.heading}</h2>
        <p class="section-lead">${gallerySection.lead}</p>
      </div>

      <div class="gallery-grid" id="gallery-grid" data-stagger>
        ${gallery
          .map(
            (item, i) => `
          <div class="gallery-item" data-index="${i}" tabindex="0" role="button" aria-label="View ${item.caption} full size">
            <img src="${item.image}" alt="${item.alt}" loading="lazy">
            <span class="gallery-caption">${item.caption}</span>
          </div>`
          )
          .join("")}
      </div>
    </div>
  `;

  setupLightbox(container, gallery);
}

function setupLightbox(container, gallery) {
  if (!qs("#lightbox")) {
    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
        <button type="button" class="lightbox-close" id="lightbox-close" aria-label="Close image viewer">${icon("close")}</button>
        <button type="button" class="lightbox-nav lightbox-prev" id="lightbox-prev" aria-label="Previous image">${icon("arrowLeft")}</button>
        <figure>
          <img id="lightbox-image" src="" alt="">
          <figcaption class="lightbox-caption" id="lightbox-caption"></figcaption>
        </figure>
        <button type="button" class="lightbox-nav lightbox-next" id="lightbox-next" aria-label="Next image">${icon("arrowRight")}</button>
      </div>`
    );
  }

  const lightbox = qs("#lightbox");
  const imageEl = qs("#lightbox-image");
  const captionEl = qs("#lightbox-caption");
  let currentIndex = 0;
  let lastFocused = null;

  function open(index) {
    currentIndex = index;
    const item = gallery[currentIndex];
    imageEl.src = item.image;
    imageEl.alt = item.alt;
    captionEl.textContent = item.caption;
    lastFocused = document.activeElement;
    lightbox.classList.add("is-open");
    qs("#lightbox-close").focus();
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  function step(delta) {
    currentIndex = (currentIndex + delta + gallery.length) % gallery.length;
    const item = gallery[currentIndex];
    imageEl.src = item.image;
    imageEl.alt = item.alt;
    captionEl.textContent = item.caption;
  }

  qsa(".gallery-item", container).forEach((itemNode) => {
    const openThis = () => open(Number(itemNode.dataset.index));
    itemNode.addEventListener("click", openThis);
    itemNode.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openThis();
      }
    });
  });

  qs("#lightbox-close").addEventListener("click", close);
  qs("#lightbox-prev").addEventListener("click", () => step(-1));
  qs("#lightbox-next").addEventListener("click", () => step(1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
}
