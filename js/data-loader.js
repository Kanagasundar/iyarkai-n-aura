// Fetches every JSON data file the site needs and returns one combined object.
// This is the ONLY place that knows the data/ file layout.

const FILES = {
  site: "data/site.json",
  products: "data/products.json",
  reviews: "data/reviews.json",
  faq: "data/faq.json",
  gallery: "data/gallery.json",
};

async function fetchJSON(path) {
  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Failed to load ${path} (${res.status})`);
  return res.json();
}

/**
 * Loads all JSON data files concurrently.
 * @returns {Promise<{site:object, products:object[], reviews:object[], faq:object[], gallery:object[]}>}
 */
export async function loadSiteData() {
  const entries = Object.entries(FILES);
  const results = await Promise.all(entries.map(([, path]) => fetchJSON(path)));
  const data = {};
  entries.forEach(([key], i) => (data[key] = results[i]));
  return data;
}
