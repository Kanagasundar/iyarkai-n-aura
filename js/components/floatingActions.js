import { icon } from "../utils/icons.js";
import { whatsappLink } from "../utils/dom.js";

export function renderFloatingActions(container, { contact }) {
  if (!container) return;

  const waHref = whatsappLink(contact.whatsappNumber, contact.whatsappDefaultText);

  container.innerHTML = `
    <a class="whatsapp-fab" href="${waHref}" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">
      ${icon("whatsapp")}
    </a>
    <button type="button" class="back-to-top" id="back-to-top" aria-label="Back to top">
      ${icon("arrowUp")}
    </button>
  `;
}
