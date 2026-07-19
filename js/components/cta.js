import { icon } from "../utils/icons.js";
import { whatsappLink } from "../utils/dom.js";

export function renderCTA(container, { cta, contact }) {
  if (!container) return;

  const primaryHref =
    cta.primaryCta.href === "whatsapp"
      ? whatsappLink(contact.whatsappNumber, contact.whatsappDefaultText)
      : cta.primaryCta.href;
  const secondaryHref = cta.secondaryCta.href === "tel" ? `tel:${contact.phoneHref}` : cta.secondaryCta.href;

  container.innerHTML = `
    <div class="blob-field" aria-hidden="true">
      <div class="blob blob-2" style="background:var(--clr-gold)"></div>
    </div>
    <div class="container cta-inner">
      <h2 data-animate="fade-up">${cta.heading}</h2>
      <p data-animate="fade-up">${cta.subheading}</p>
      <div class="cta-actions" data-animate="fade-up">
        <a class="btn btn-primary is-whatsapp" href="${primaryHref}" target="_blank" rel="noopener">
          ${icon("whatsapp")} ${cta.primaryCta.label}
        </a>
        <a class="btn btn-outline-light" href="${secondaryHref}">
          ${icon("phone")} ${cta.secondaryCta.label}
        </a>
      </div>

      <div class="contact-grid" data-stagger>
        <div>
          <h3>Call / WhatsApp</h3>
          <p><a href="tel:${contact.phoneHref}">${contact.phoneDisplay}</a></p>
        </div>
        <div>
          <h3>Email</h3>
          <p><a href="mailto:${contact.email}">${contact.email}</a></p>
        </div>
        <div>
          <h3>Visit Us</h3>
          <p>${contact.addressLines.join("<br>")}</p>
        </div>
      </div>
    </div>
  `;
}
