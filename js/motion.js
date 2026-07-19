// Scroll-driven motion: reveal-on-scroll, parallax layers, count-up numbers.
// Everything here is GPU-friendly (transform/opacity only) and fully disabled
// under prefers-reduced-motion.

import { qsa } from "./utils/dom.js";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Scans the document for [data-animate] and [data-stagger] elements and
 * reveals them the first time they enter the viewport.
 * Safe to call multiple times (e.g. after each component renders) —
 * already-observed elements are tracked and skipped.
 */
const observedReveal = new WeakSet();
let revealObserver = null;

export function initScrollReveal(root = document) {
  if (prefersReducedMotion) {
    qsa("[data-animate], [data-stagger]", root).forEach((elNode) => elNode.classList.add("is-visible"));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
  }

  qsa("[data-stagger]", root).forEach((group) => {
    Array.from(group.children).forEach((child, i) => child.style.setProperty("--stagger-index", i));
  });

  qsa("[data-animate], [data-stagger]", root).forEach((elNode) => {
    if (observedReveal.has(elNode)) return;
    observedReveal.add(elNode);
    revealObserver.observe(elNode);
  });
}

/**
 * Lightweight parallax: elements with [data-parallax] move vertically at
 * `data-speed` (default 0.15) relative to normal scroll, via a single
 * rAF-throttled scroll listener updating a CSS custom property.
 */
export function initParallax(root = document) {
  if (prefersReducedMotion) return;

  const layers = qsa("[data-parallax]", root);
  if (!layers.length) return;

  let ticking = false;

  function update() {
    const viewportH = window.innerHeight;
    layers.forEach((layerNode) => {
      const speed = parseFloat(layerNode.dataset.speed || "0.15");
      const rect = layerNode.getBoundingClientRect();
      const centerOffset = rect.top + rect.height / 2 - viewportH / 2;
      const y = centerOffset * speed * -1;
      layerNode.style.setProperty("--parallax-y", y.toFixed(1));
    });
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
}

/**
 * Animates [data-countup] elements from 0 to their target value the first
 * time they scroll into view. Reads target/suffix/prefix from data attrs.
 */
export function initCountUp(root = document) {
  const nodes = qsa("[data-countup]", root);
  if (!nodes.length) return;

  if (prefersReducedMotion) {
    nodes.forEach((node) => {
      node.textContent = (node.dataset.prefix || "") + node.dataset.target + (node.dataset.suffix || "");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  nodes.forEach((node) => observer.observe(node));
}

function animateCount(node) {
  const target = Number(node.dataset.target || 0);
  const prefix = node.dataset.prefix || "";
  const suffix = node.dataset.suffix || "";
  const duration = 1200;
  const start = performance.now();

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function frame(now) {
    const elapsed = Math.min((now - start) / duration, 1);
    const value = Math.round(target * easeOutExpo(elapsed));
    node.textContent = prefix + value + suffix;
    if (elapsed < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}
