
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
  return Array.from({ length: 5 }, (_, index) => {
    const section = sections[getIndex(activeIndex + index - 2)];

    return `
      <div class="home__card ${getCardClass(index)}"
           data-index="${index}">
        ${section.title}
      </div>
    `;
  }).join("");
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

function updateCardClasses(cards) {
  cards.forEach((card, index) => {
    card.classList.remove(
      "home__card--far",
      "home__card--side",
      "home__card--active"
    );

    card.classList.add(getCardClass(index));
    card.dataset.index = index;
  });
}

function moveCards(direction) {
  const track = document.querySelector(".home__track");

  if (!track || isScrolling || sections.length < 2) return;

  const cards = [...track.querySelectorAll(".home__card")];
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;

  // Определяем расстояние до следующей позиции
  const movingCard = direction > 0 ? cards[0] : cards[4];
  const distance = movingCard.getBoundingClientRect().width + gap;

  isScrolling = true;

  // Сначала физически двигаем ленту
  track.style.transition = "transform 0.6s ease";
  track.style.transform =
    `translateX(${direction > 0 ? -distance : distance}px)`;

  const finishMove = () => {
    track.removeEventListener("transitionend", finishMove);

    // Обновляем активный раздел
    activeIndex = getIndex(activeIndex + direction);

    // Переносим карточку на противоположный край
    if (direction > 0) {
      track.appendChild(track.firstElementChild);
    } else {
      track.prepend(track.lastElementChild);
    }

    const reorderedCards = [
      ...track.querySelectorAll(".home__card")
    ];

    // Обновляем классы и названия
    reorderedCards.forEach((card, index) => {
      const section = sections[getIndex(activeIndex + index - 2)];

      card.textContent = section.title;
    });

    updateCardClasses(reorderedCards);

    // Возвращаем ленту в исходное положение без анимации
    track.style.transition = "none";
    track.style.transform = "translateX(0)";

    // Применяем сброс позиции перед следующей анимацией
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