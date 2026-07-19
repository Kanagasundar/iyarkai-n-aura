// Inline SVG icon registry — no external icon font / request needed.
// Each entry is the *inner* markup of an <svg>; consumers wrap it via icon().

export const ICONS = {
  leaf: `<path d="M12 2c7 6 8 9 8 12a8 8 0 01-16 0c0-3 1-6 8-12z"/>`,
  handmade: `<path d="M12 21s-7-4.5-9.5-9C.5 8 2 4 6 4c2 0 4 1.5 6 4 2-2.5 4-4 6-4 4 0 5.5 4 3.5 8-2.5 4.5-9.5 9-9.5 9z"/>`,
  heart: `<path d="M12 21s-7-4.5-9.5-9C.5 8 2 4 6 4c2 0 4 1.5 6 4 2-2.5 4-4 6-4 4 0 5.5 4 3.5 8-2.5 4.5-9.5 9-9.5 9z"/>`,
  shield: `<path d="M12 3l7 3v6c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V6l7-3z"/>`,
  sparkle: `<path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z"/>`,
  star: `<path d="M12 2l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.1 5.9 20.5l1.5-6.8L2.2 9l6.9-.7L12 2z"/>`,
  gift: `<path d="M4 21V9a2 2 0 012-2h3V5a2 2 0 012-2h2a2 2 0 012 2v2h3a2 2 0 012 2v12"/><path d="M9 21v-4h6v4"/>`,
  whatsapp: `<path d="M17.5 14.4c-.3-.1-1.7-.8-2-1-.3-.1-.5-.1-.6.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.2-.5.1-.2 0-.4 0-.5-.1-.1-.6-1.5-.8-2-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.5 1.1 2.6c.1.2 1.8 2.8 4.4 3.8.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.7-.7 1.9-1.3.2-.6.2-1.1.2-1.3-.1-.1-.3-.2-.6-.3z" data-fill="1"/><path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1112 20.2z"/>`,
  phone: `<path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.5 2.1L7.9 9.7a16 16 0 006.4 6.4l1.3-1.3a2 2 0 012.1-.5c.8.3 1.7.5 2.6.6a2 2 0 011.7 2z"/>`,
  mail: `<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>`,
  pin: `<path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/>`,
  instagram: `<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" data-fill="1"/>`,
  facebook: `<path d="M14 9h3V6h-3a3 3 0 00-3 3v2H9v3h2v6h3v-6h3l1-3h-4V9a1 1 0 011-1z"/>`,
  plus: `<path d="M12 5v14M5 12h14"/>`,
  close: `<path d="M6 6l12 12M18 6L6 18"/>`,
  arrowLeft: `<path d="M15 5l-7 7 7 7"/>`,
  arrowRight: `<path d="M9 5l7 7-7 7"/>`,
  arrowUp: `<path d="M12 19V5M5 12l7-7 7 7"/>`,
  quote: `<path d="M7 7h4v6a4 4 0 01-4 4H6v-2h1a2 2 0 002-2H7V7zm8 0h4v6a4 4 0 01-4 4h-1v-2h1a2 2 0 002-2h-2V7z" data-fill="1"/>`,
};

/**
 * Build an SVG string for the given icon name.
 * @param {string} name key from ICONS
 * @param {string} extraClass additional class(es) on the <svg>
 */
export function icon(name, extraClass = "") {
  const inner = ICONS[name];
  if (!inner) return "";
  const filled = inner.includes('data-fill="1"');
  const cls = ["icon", filled ? "icon-fill" : "", extraClass].filter(Boolean).join(" ");
  return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${inner.replace(/ data-fill="1"/g, "")}</svg>`;
}
