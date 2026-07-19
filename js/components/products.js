import { qs, qsa, formatINR, whatsappLink } from "../utils/dom.js";

export function renderProducts(container, { productsSection, products, contact }) {
  if (!container) return;

  const categories = productsSection.categories || [{ id: "all", label: "All Products" }];

  container.innerHTML = `
    <div class="container">
      <div class="section-head" data-animate="fade-up">
        <p class="eyebrow center">${productsSection.eyebrow}</p>
        <h2>${productsSection.heading}</h2>
        <p class="section-lead">${productsSection.lead}</p>
      </div>

      ${
        categories.length > 1
          ? `<div class="category-filters" role="tablist" aria-label="Filter products by category" data-animate="fade-up">
              ${categories
                .map(
                  (cat, i) =>
                    `<button type="button" class="chip${i === 0 ? " is-active" : ""}" data-category="${cat.id}" role="tab" aria-selected="${i === 0}">${cat.label}</button>`
                )
                .join("")}
            </div>`
          : ""
      }

      <div class="product-grid" id="product-grid" data-stagger>
        ${products.map((p) => productCard(p, contact)).join("")}
      </div>

      <p class="products-footnote" data-animate="fade-up">${productsSection.footnote}</p>
    </div>
  `;

  setupFilters(container, products, contact);
}

function productCard(product, contact) {
  const waHref = whatsappLink(contact.whatsappNumber, `Hi, I'd like to order the ${product.name}`);
  return `
    <article class="product-card" data-category="${product.category}">
      <div class="product-media">
        <img src="${product.image}" alt="${product.imageAlt}" width="900" height="900" loading="lazy">
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
      </div>
      <div class="product-body">
        <h3>${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <p class="product-meta">${product.size} &middot; ${product.meta}</p>
        <div class="product-footer">
          <p class="price">
            <span class="price-now">${formatINR(product.price)}</span>
            ${product.mrp && product.mrp > product.price ? `<span class="price-was">${formatINR(product.mrp)}</span>` : ""}
          </p>
          <a class="btn btn-primary btn-sm" href="${waHref}" target="_blank" rel="noopener">Enquire</a>
        </div>
      </div>
    </article>
  `;
}

function setupFilters(container, products, contact) {
  const chips = qsa(".chip", container);
  const grid = qs("#product-grid", container);
  if (!chips.length || !grid) return;

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => {
        c.classList.remove("is-active");
        c.setAttribute("aria-selected", "false");
      });
      chip.classList.add("is-active");
      chip.setAttribute("aria-selected", "true");

      const category = chip.dataset.category;
      const filtered = category === "all" ? products : products.filter((p) => p.category === category);

      grid.innerHTML = filtered.length
        ? filtered.map((p) => productCard(p, contact)).join("")
        : `<p class="empty-state">No products in this category yet — check back soon!</p>`;
    });
  });
}
