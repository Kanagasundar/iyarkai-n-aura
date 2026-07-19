export function renderStats(container, { stats }) {
  if (!container || !stats?.length) {
    if (container) container.hidden = true;
    return;
  }

  container.innerHTML = `
    <div class="container">
      <div class="stats-grid" data-stagger>
        ${stats
          .map(
            (stat) => `
          <div class="stat">
            <p class="stat-value" data-countup data-target="${stat.value}" data-prefix="${stat.prefix || ""}" data-suffix="${stat.suffix || ""}">0</p>
            <p class="stat-label">${stat.label}</p>
          </div>`
          )
          .join("")}
      </div>
    </div>
  `;
}
