import { icon } from "../utils/icons.js";
import { whatsappLink } from "../utils/dom.js";

export function renderFooter(container, { brand, nav, contact, footer }) {
  if (!container) return;

  const waHref = whatsappLink(contact.whatsappNumber, contact.whatsappDefaultText);

  container.innerHTML = `
    <div class="container footer-inner">
      <div class="footer-brand">
        <a href="#top" class="brand">
          <span class="brand-mark"><img src="${brand.logoMark}" alt="" width="44" height="44" loading="lazy"></span>
          <span class="brand-name">
            <span class="brand-name-main">${brand.name}</span>
            <span class="brand-name-sub">${footer.tagline}</span>
          </span>
        </a>
        <p>${footer.about}</p>
        <div class="footer-social">
          <a href="${contact.instagram.url}" target="_blank" rel="noopener" aria-label="Instagram">${icon("instagram")}</a>
          <a href="${contact.facebook.url}" target="_blank" rel="noopener" aria-label="Facebook">${icon("facebook")}</a>
          <a href="${waHref}" target="_blank" rel="noopener" class="is-whatsapp" aria-label="WhatsApp">${icon("whatsapp")}</a>
        </div>
      </div>

      <div class="footer-links">
        <h4>Explore</h4>
        <ul>
          ${nav.links.map((link) => `<li><a href="${link.href}">${link.label}</a></li>`).join("")}
        </ul>
      </div>

      <div class="footer-links">
        <h4>Contact</h4>
        <ul>
          <li><a href="tel:${contact.phoneHref}">${contact.phoneDisplay}</a></li>
          <li><a href="mailto:${contact.email}">${contact.email}</a></li>
          <li>${contact.addressLines.join(", ")}</li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container">
        <p>&copy; <span id="year"></span> ${footer.copyrightName}. All rights reserved. ${footer.credit}</p>
      </div>
    </div>
  `;
}
