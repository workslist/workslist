'use strict'

export function renderHeader(path) {
  return `
      <div class="header__container">

        <a class="header__link" href="#" data-back>
          Назад
        </a>

        <a class="header__link" href="#" data-section-button>
          В&nbsp;раздел
        </a>

        <a class="header__link" href="#/">
          Главная
        </a>

      </div>
  `;
}

