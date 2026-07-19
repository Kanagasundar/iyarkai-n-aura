import { qs, qsa } from "../utils/dom.js";
import { icon } from "../utils/icons.js";

export function renderFAQ(container, { faqSection, faq }) {
  if (!container) return;

  container.innerHTML = `
    <div class="container">
      <div class="section-head" data-animate="fade-up">
        <p class="eyebrow center">${faqSection.eyebrow}</p>
        <h2>${faqSection.heading}</h2>
        <p class="section-lead">${faqSection.lead}</p>
      </div>

      <div class="faq-list" data-stagger>
        ${faq
          .map(
            (item, i) => `
          <div class="faq-item" id="faq-${i}">
            <button type="button" class="faq-question" aria-expanded="false" aria-controls="faq-answer-${i}">
              <span>${item.question}</span>
              ${icon("plus")}
            </button>
            <div class="faq-answer" id="faq-answer-${i}" role="region">
              <p class="faq-answer-inner">${item.answer}</p>
            </div>
          </div>`
          )
          .join("")}
      </div>
    </div>
  `;

  setupAccordion(container);
}

function setupAccordion(container) {
  qsa(".faq-item", container).forEach((item) => {
    const question = qs(".faq-question", item);
    const answer = qs(".faq-answer", item);

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      // Close any other open item (single-open accordion)
      qsa(".faq-item.is-open", container).forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove("is-open");
          qs(".faq-question", openItem).setAttribute("aria-expanded", "false");
          qs(".faq-answer", openItem).style.maxHeight = null;
        }
      });

      item.classList.toggle("is-open", !isOpen);
      question.setAttribute("aria-expanded", String(!isOpen));
      answer.style.maxHeight = isOpen ? null : answer.scrollHeight + "px";
    });
  });
}
