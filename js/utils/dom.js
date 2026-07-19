// Tiny DOM helpers used across component renderers.

/** Query a single element, optionally scoped. */
export function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

/** Query all elements as a real array, optionally scoped. */
export function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

/** Create an element with attributes + children in one call. */
export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === "class") node.className = value;
    else if (key === "html") node.innerHTML = value;
    else if (key === "text") node.textContent = value;
    else if (key.startsWith("on") && typeof value === "function") {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      node.setAttribute(key, value);
    }
  }
  for (const child of [].concat(children)) {
    if (child == null) continue;
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return node;
}

/** Escape a string for safe interpolation into innerHTML templates. */
export function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** Format a number as Indian Rupees, e.g. 1999 -> "₹1,999". */
export function formatINR(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

/** Build a wa.me link from a phone (digits only) + message text. */
export function whatsappLink(number, text = "") {
  const base = `https://wa.me/${number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
