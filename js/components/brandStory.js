export function renderBrandStory(container, { brandStory }) {
  if (!container) return;

  container.innerHTML = `
    <div class="container story-inner">
      <div class="story-media" data-animate="fade-right">
        <img src="${brandStory.image}" alt="${brandStory.imageAlt}" width="1000" height="1388" loading="lazy">
      </div>

      <div class="story-copy">
        <p class="eyebrow" data-animate="fade-up">${brandStory.eyebrow}</p>
        <h2 data-animate="fade-up">${brandStory.heading}</h2>
        ${brandStory.paragraphs
          .map((paragraph, i) => `<p data-animate="fade-up" style="transition-delay:${i * 60}ms">${paragraph}</p>`)
          .join("")}
        <a class="btn btn-outline" href="${brandStory.cta.href}" data-animate="fade-up">${brandStory.cta.label}</a>
      </div>
    </div>
  `;
}
