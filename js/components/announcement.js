import { icon } from "../utils/icons.js";

export function renderAnnouncement(container, { announcement }) {
  if (!container || !announcement || !announcement.enabled) {
    if (container) container.hidden = true;
    return;
  }

  container.innerHTML = `
    ${icon(announcement.icon || "leaf")}
    <span>${announcement.text}</span>
    ${announcement.linkHref ? `<a href="${announcement.linkHref}">${announcement.linkLabel || "Learn more"}</a>` : ""}
    <button type="button" id="announcement-close" class="announcement-close" aria-label="Dismiss announcement">
      ${icon("close")}
    </button>
  `;
}
