import { icon } from "../utils/icons.js";

export function renderWhyUs(container, { whyUs }) {
  if (!container) return;

  container.innerHTML = `
    <div class="container why-us-inner">
      <div class="why-us-media" data-animate="fade-right">
        <img src="${whyUs.image}" alt="${whyUs.imageAlt}" width="900" height="1199" loading="lazy">
      </div>

      <div class="why-us-copy">
        <p class="eyebrow" data-animate="fade-up">${whyUs.eyebrow}</p>
        <h2 data-animate="fade-up">${whyUs.heading}</h2>
        <p class="section-lead" data-animate="fade-up">${whyUs.lead}</p>

        <ul class="feature-grid" data-stagger>
          ${whyUs.features
            .map(
              (f) => `
            <li class="feature-card">
              <span class="feature-icon">${icon(f.icon)}</span>
              <h3>${f.title}</h3>
              <p>${f.description}</p>
            </li>`
            )
            .join("")}
        </ul>
      </div>
    </div>
  `;
}
