
'use strict';

import { sections } from "../js/data/sections.js";

let activeIndex = 0;
let isScrolling = false;

const getIndex = index => (index + sections.length) % sections.length;

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
        ${index === 3 && section ? `href="#${section.path}" data-link` : ""}
        data-index="${index}"
      >
        <svg class="home__icon">
          <use xlink:href="./portfolio/img/sprite.svg#arr"></use>
        </svg>    
        <h1 class="home__title">${section ? section.title : ""}</h1>
        <p class="home__descr">${section ? section.description ?? "" : ""}</p>
      </a>
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

    const title = card.querySelector(".home__title");
    const description = card.querySelector(".home__descr");
    const content = card.querySelector(".home__content");

    // Обновляем текст, не удаляя HTML-элементы
    title.textContent = section ? section.title : "";
    description.textContent = section ? section.description ?? "" : "";

    card.dataset.index = index;

    // Обновляем ссылку центральной карточки
    if (index === 3 && section) {
      card.href = `#${section.path}`;
      card.setAttribute("data-link", "");
    } else {
      card.removeAttribute("href");
      card.removeAttribute("data-link");
    }

    // Обновляем классы карточек
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

  const home = document.querySelector(".home");
  home?.classList.add("is-scrolling");

  const gap = parseFloat(getComputedStyle(track).gap) || 0;
  const distance =
    cards[direction > 0 ? 0 : 6].getBoundingClientRect().width + gap;

  const nextCards = direction > 0
    ? [...cards.slice(1), cards[0]]
    : [cards[6], ...cards.slice(0, 6)];

  const nextActiveIndex = getIndex(activeIndex + direction);  

  updateCards(nextCards, nextActiveIndex);

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

    track.style.transition = "none";
    track.style.transform = "translateX(-50%)";

    updateCards(updatedCards, activeIndex);

    track.getBoundingClientRect();

    isScrolling = false;
    home?.classList.remove("is-scrolling");
  };

  track.addEventListener("transitionend", finishMove);
}

// Управление стрелками
document.addEventListener("keydown", event => {
  if (!document.querySelector(".home__track")) return;

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

// Клики слева и справа от центральной карточки
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

// Прокрутка колёсиком
window.addEventListener("wheel", event => {
  if (!document.querySelector(".home__track")) return;

  if (window.innerWidth > 900) {
    event.preventDefault();
  }

  moveCards(event.deltaY > 0 ? 1 : -1);
}, { passive: false });

// Свайпы на сенсорном экране
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

  if (Math.abs(deltaX) < 40) return;
  if (Math.abs(deltaX) < Math.abs(deltaY)) return;

  moveCards(deltaX < 0 ? 1 : -1);
}, { passive: true });
