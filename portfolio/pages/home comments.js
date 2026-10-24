'use strict'

// Импортируем массив разделов портфолио из файла с данными
import { sections } from "../js/data/sections.js";

// Индекс текущего активного раздела в массиве sections
let activeIndex = 0;

// Флаг блокировки прокрутки.
// Пока анимация не закончилась, новую прокрутку не запускаем
let isScrolling = false;

// Возвращает корректный индекс раздела.
// Если индекс выходит за границы массива, начинаем отсчёт заново.
// Благодаря этому карусель работает по кругу
const getIndex = index =>
  (index + sections.length) % sections.length;

// Определяет класс карточки в зависимости от её позиции в карусели
function getCardClass(index) {
  if (index === 3) return "home__card--active"; // Центральная активная карточка
  if (index === 2 || index === 4) return "home__card--side"; // Карточки по бокам от центральной
  return "home__card--far"; // Остальные карточки по краям
}

// Создаёт HTML-разметку семи карточек карусели
function renderCards() {
  return Array.from({ length: 7 }, (_, index) => {

    // Контент есть только у карточек №3, №4 и №5
    const isContentCard = index >= 2 && index <= 4;

    // Подбираем раздел для карточки с учётом циклического порядка
    const section = isContentCard
      ? sections[getIndex(activeIndex + index - 3)]
      : null;

    // Возвращаем HTML одной карточки
    return `
      <a
        class="home__card ${getCardClass(index)} ${isContentCard ? "" : "home__card--empty"} ${index === 0 || index === 6 ? "home__card--invisible" : ""}"
        ${index === 3 ? `href="#${section.path}" data-link` : ""}
        data-index="${index}"
      >${section ? section.title : ""}</a>
    `;
  }).join(""); // Объединяем HTML всех карточек в одну строку
}

// Создаёт главную страницу портфолио с каруселью
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

// Обновляет содержимое, ссылки и CSS-классы всех карточек
function updateCards(cards, nextActiveIndex) {
  cards.forEach((card, index) => {

    // Определяем, должна ли карточка показывать название раздела
    const isContentCard = index >= 2 && index <= 4;

    // Получаем раздел для текущей позиции
    const section = isContentCard
      ? sections[getIndex(nextActiveIndex + index - 3)]
      : null;

    // Обновляем текст карточки.
    // У пустых карточек текст остаётся пустым
    card.textContent = section ? section.title : "";

    // Сохраняем текущую позицию карточки в атрибуте data-index
    card.dataset.index = index;

    // Ссылка и data-link есть только у центральной карточки
    if (index === 3 && section) {
      card.href = `#${section.path}`;
      card.setAttribute("data-link", "");
    } else {
      // У остальных карточек удаляем ссылку и признак навигации
      card.removeAttribute("href");
      card.removeAttribute("data-link");
    }

    // Удаляем старые классы позиционирования и оформления
    card.classList.remove(
      "home__card--far",
      "home__card--side",
      "home__card--active",
      "home__card--empty",
      "home__card--invisible"
    );

    // Назначаем класс в соответствии с новой позицией
    card.classList.add(getCardClass(index));

    // Пустым карточкам назначаем класс заглушки
    if (!isContentCard) {
      card.classList.add("home__card--empty");
    }

    // Первая и седьмая карточки остаются невидимыми
    if (index === 0 || index === 6) {
      card.classList.add("home__card--invisible");
    }
  });
}

// Перемещает карусель в заданном направлении:
// direction = 1 — вперёд, direction = -1 — назад
function moveCards(direction) {

  // Находим контейнер карточек
  const track = document.querySelector(".home__track");

  // Не запускаем движение, если карусели нет,
  // предыдущая анимация ещё идёт или разделов меньше двух
  if (!track || isScrolling || sections.length < 2) return;

  // Получаем все карточки в массив
  const cards = [...track.querySelectorAll(".home__card")];

  // Для работы этой логики должно быть ровно семь карточек
  if (cards.length !== 7) return;

  // Блокируем повторную прокрутку на время анимации
  isScrolling = true;

  // Получаем расстояние между карточками
  const gap = parseFloat(getComputedStyle(track).gap) || 0;

  // Рассчитываем расстояние движения:
  // ширина крайней карточки плюс промежуток между карточками
  const distance =
    cards[direction > 0 ? 0 : 6].getBoundingClientRect().width + gap;

  // Формируем порядок карточек после одного шага:
  // при движении вперёд первая карточка переходит в конец,
  // при движении назад последняя карточка переходит в начало
  const nextCards = direction > 0
    ? [...cards.slice(1), cards[0]]
    : [cards[6], ...cards.slice(0, 6)];

  // Рассчитываем индекс раздела, который станет активным
  const nextActiveIndex = getIndex(activeIndex + direction);

  // Сразу обновляем содержимое карточек в новом порядке,
  // чтобы старые названия не оставались на них до конца анимации
  updateCards(nextCards, nextActiveIndex);

  // Сбрасываем анимацию и возвращаем трек в исходное положение.
  // Это подготавливает его к следующему движению
  track.style.transition = "none";
  track.style.transform = "translateX(-50%)";

  // Принудительно применяем изменения перед запуском анимации
  track.getBoundingClientRect();

  // Запускаем плавное перемещение трека
  track.style.transition = "transform 0.6s ease";

  // Сдвигаем трек в нужную сторону на рассчитанное расстояние
  track.style.transform =
    `translateX(calc(-50% ${direction > 0 ? " - " : " + "}${distance}px))`;

  // Функция вызывается после завершения CSS-перехода
  const finishMove = event => {

    // Игнорируем события анимации других CSS-свойств
    if (event.propertyName !== "transform") return;

    // Удаляем обработчик, чтобы он не сработал повторно
    track.removeEventListener("transitionend", finishMove);

    // Фиксируем новый активный раздел
    activeIndex = nextActiveIndex;

    // Физически переставляем карточки в DOM,
    // чтобы карусель могла продолжать движение по кругу
    if (direction > 0) {
      track.appendChild(track.firstElementChild);
    } else {
      track.prepend(track.lastElementChild);
    }

    // Получаем новый порядок карточек после перестановки
    const updatedCards = [...track.querySelectorAll(".home__card")];

    // Отключаем анимацию и возвращаем трек в исходное положение.
    // Перестановка элементов не должна быть видна пользователю
    track.style.transition = "none";
    track.style.transform = "translateX(-50%)";

    // Обновляем содержимое и классы уже после перестановки
    updateCards(updatedCards, activeIndex);

    // Применяем изменения до следующего движения
    track.getBoundingClientRect();

    // Разрешаем следующую прокрутку
    isScrolling = false;
  };

  // Следим за завершением анимации перемещения
  track.addEventListener("transitionend", finishMove);
}

// Обрабатываем прокрутку колёсика мыши
window.addEventListener("wheel", event => {

  // Если карусели нет на текущей странице, ничего не делаем
  if (!document.querySelector(".home__track")) return;

  // Отключаем стандартную прокрутку страницы
  event.preventDefault();

  // Определяем направление движения по вертикальной прокрутке
  moveCards(event.deltaY > 0 ? 1 : -1);

}, { passive: false }); // passive: false позволяет использовать preventDefault()