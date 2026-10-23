'use strict';

import { sections } from "../js/data/sections.js";

let activeIndex = 0;
let isScrolling = false;

const getIndex = index =>
  (index + sections.length) % sections.length;

function getCardClass(index) {
  if (index === 2) return "home__card--active";
  if (index === 1 || index === 3) return "home__card--side";
  return "home__card--far";
}

function renderCards() {
  const cards = [
    sections[getIndex(activeIndex - 2)],
    sections[getIndex(activeIndex - 1)],
    sections[activeIndex],
    sections[getIndex(activeIndex + 1)],
    sections[getIndex(activeIndex + 2)]
  ];

  return cards.map((card, index) => `
    <a
      class="home__card ${getCardClass(index)}"
      ${index === 2 ? `href="#${card.path}" data-link` : ""}
      data-index="${index}"
    >
      ${card.title}
    </a>
  `).join("");
}

export function renderHome() {
  return `
    <section class="home">
      <div class="home__cards">
        <div class="home__track">
          ${renderCards()}
        </div>
      </div>
    </section>
  `;
}

function moveCards(direction) {

  
  const track = document.querySelector(".home__track");

  if (!track || isScrolling || sections.length < 2) return;

  const cards = [...track.querySelectorAll(".home__card")];

  if (cards.length !== 5) return;

  isScrolling = true;

  const gap = parseFloat(getComputedStyle(track).gap) || 0;
  const distance =
    cards[direction > 0 ? 0 : 4].getBoundingClientRect().width + gap;

  // Сначала подготавливаем классы следующего положения
  const nextCards = direction > 0
    ? [...cards.slice(1), cards[0]]
    : [cards[4], ...cards.slice(0, 4)];

  nextCards.forEach((card, index) => {
    card.classList.remove(
      "home__card--far",
      "home__card--side",
      "home__card--active"
    );

    card.classList.add(getCardClass(index));
  });

  // Запускаем движение и изменение размеров одновременно
  track.style.transition =
    "transform 0.6s ease";

  track.style.transform =
    `translateX(calc(-50% ${direction > 0 ? " - " : " + "}${distance}px))`;

  const finishMove = event => {
    if (event.propertyName !== "transform") return;

    track.removeEventListener("transitionend", finishMove);

    activeIndex = getIndex(activeIndex + direction);

    if (direction > 0) {
      track.appendChild(track.firstElementChild);
    } else {
      track.prepend(track.lastElementChild);
    }

    const updatedCards = [
      ...track.querySelectorAll(".home__card")
    ];

    updatedCards.forEach((card, index) => {
      const section = sections[getIndex(activeIndex + index - 2)];

      card.textContent = section.title;
      card.dataset.index = index;

      if (index === 2) {
        card.href = `#${section.path}`;
        card.setAttribute("data-link", "");
      } else {
        card.removeAttribute("href");
        card.removeAttribute("data-link");
      }

      card.classList.remove(
        "home__card--far",
        "home__card--side",
        "home__card--active"
      );

      card.classList.add(getCardClass(index));
    });


    track.style.transition = "none";
    track.style.transform = "translateX(-50%)";

    track.getBoundingClientRect();

    isScrolling = false;
  };

  track.addEventListener("transitionend", finishMove);
}

window.addEventListener("wheel", event => {
  if (!document.querySelector(".home__track")) return;

  event.preventDefault();
  moveCards(event.deltaY > 0 ? 1 : -1);
}, { passive: false });