'use strict'

import { sections } from "../js/data/sections.js";

export function renderHome() {

  const activeIndex = 0;

  const getIndex = index => (index + sections.length) % sections.length;

  const cards = [
    null,
    sections[getIndex(activeIndex - 1)],
    sections[activeIndex],
    sections[getIndex(activeIndex + 1)],
    null
  ];

  return `
    <section class="home">

      <div class="home__cards">
        ${cards.map((card, index) => `
          <div class="home__card ${card ? "" : "home__card--empty"} " data-index="${index}">
            ${card ? card.title : ""}
          </div>
        `).join("")}
      </div>
    </section>
  `;
  
}