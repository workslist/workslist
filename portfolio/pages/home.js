'use strict';

import { sections } from "../js/data/sections.js";

let activeIndex = 0;
let isScrolling = false;

const getIndex = index => (index + sections.length) % sections.length;

function updateBackground(index) {
  const home = document.querySelector(".home");
  const section = sections[getIndex(index)];

  if (!home || !section) return;

  home.style.backgroundImage = `url("${section.background}")`;
}

function getCardClass(index) {
  if (index === 3) return "home__card--active";
  if (index === 2 || index === 4) return "home__card--side";
  return "home__card--far";
}

function renderCards() {
  return Array.from({ length: 7 }, (_, index) => {
    const isContentCard = index >= 2 && index <= 4;
    const section = isContentCard
      ? sections[getIndex(activeIndex + index - 3)]
      : null;

    return `
      <a
        class="home__card ${getCardClass(index)} ${isContentCard ? "" : "home__card--empty"} ${index === 0 || index === 6 ? "home__card--invisible" : ""}"
        ${index === 3 ? `href="#${section.path}" data-link` : ""}
        data-index="${index}"
      >${section ? section.title : ""}</a>
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

function updateCards(cards, nextActiveIndex) {
  cards.forEach((card, index) => {
    const isContentCard = index >= 2 && index <= 4;
    const section = isContentCard
      ? sections[getIndex(nextActiveIndex + index - 3)]
      : null;

    card.textContent = section ? section.title : "";
    card.dataset.index = index;

    if (index === 3 && section) {
      card.href = `#${section.path}`;
      card.setAttribute("data-link", "");
    } else {
      card.removeAttribute("href");
      card.removeAttribute("data-link");
    }

    card.classList.remove(
      "home__card--far",
      "home__card--side",
      "home__card--active",
      "home__card--empty",
      "home__card--invisible"
    );

    card.classList.add(getCardClass(index));

    if (!isContentCard) {
      card.classList.add("home__card--empty");
    }

    if (index === 0 || index === 6) {
      card.classList.add("home__card--invisible");
    }
  });
}

function moveCards(direction) {
  const track = document.querySelector(".home__track");

  if (!track || isScrolling || sections.length < 2) return;

  const cards = [...track.querySelectorAll(".home__card")];

  if (cards.length !== 7) return;

  isScrolling = true;

  const gap = parseFloat(getComputedStyle(track).gap) || 0;
  const distance =
    cards[direction > 0 ? 0 : 6].getBoundingClientRect().width + gap;

  const nextCards = direction > 0
    ? [...cards.slice(1), cards[0]]
    : [cards[6], ...cards.slice(0, 6)];

  const nextActiveIndex = getIndex(activeIndex + direction);

  // Сразу обновляем содержимое карточек
  updateCards(nextCards, nextActiveIndex);

  // Подготавливаем движение
  track.style.transition = "none";
  track.style.transform = "translateX(-50%)";
  track.getBoundingClientRect();

  track.style.transition = "transform 0.3s ease";
  track.style.transform =
    `translateX(calc(-50% ${direction > 0 ? " - " : " + "}${distance}px))`;

  const finishMove = event => {
    if (event.propertyName !== "transform") return;

    track.removeEventListener("transitionend", finishMove);

    activeIndex = nextActiveIndex;

    if (direction > 0) {
      track.appendChild(track.firstElementChild);
    } else {
      track.prepend(track.lastElementChild);
    }

    const updatedCards = [...track.querySelectorAll(".home__card")];

    // Возвращаем трек в исходное положение без анимации
    track.style.transition = "none";
    track.style.transform = "translateX(-50%)";

    updateCards(updatedCards, activeIndex);

    track.getBoundingClientRect();

    isScrolling = false;
  };

  track.addEventListener("transitionend", finishMove);
}

// Управление стрелками
document.addEventListener("keydown", event => {
  if (!document.querySelector(".home__track")) return;

  // Не перехватываем стрелки при вводе текста
  if (
    event.target.matches("input, textarea, select") ||
    event.target.isContentEditable
  ) {
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    moveCards(-1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    moveCards(1);
  }
});

// Клики справа и слева от карточки
document.addEventListener("click", event => {
  const container = event.target.closest(".home__cards");
  if (!container) return;
  const card = event.target.closest(".home__card");

  if (card?.classList.contains("home__card--active")) return;

  const activeCard = document.querySelector(".home__card--active");
  if (!activeCard) return;

  const rect = activeCard.getBoundingClientRect();

  if (event.clientX < rect.left) {
    event.preventDefault();
    moveCards(-1);
  } else if (event.clientX > rect.right) {
    event.preventDefault();
    moveCards(1);
  }
});

window.addEventListener("wheel", event => {
  if (!document.querySelector(".home__track")) return;

  if (window.innerWidth > 900) {
    event.preventDefault();
  }

  moveCards(event.deltaY > 0 ? 1 : -1);
}, { passive: false });

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", event => {
  if (!event.target.closest(".home__cards")) return;

  touchStartX = event.changedTouches[0].clientX;
  touchStartY = event.changedTouches[0].clientY;
}, { passive: true });

document.addEventListener("touchend", event => {
  if (!event.target.closest(".home__cards")) return;

  const deltaX = event.changedTouches[0].clientX - touchStartX;
  const deltaY = event.changedTouches[0].clientY - touchStartY;

  // Игнорируем короткие движения и вертикальные свайпы
  if (Math.abs(deltaX) < 40) return;
  if (Math.abs(deltaX) < Math.abs(deltaY)) return;

  moveCards(deltaX < 0 ? 1 : -1);
}, { passive: true });
