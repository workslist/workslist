'use strict'

export function renderHeader(path) {
  return `
    <a class="header__back" data-back href="#">
      <svg>
        <use 
          xlink:href="./portfolio/img/sprite.svg#h_back">
          </use>
      </svg>
    </a>

    <a class="header__logo" href="#/">
      <span>worksList</span>    
      <img src="./portfolio/img/logo.svg" alt="">
    </a>

    <a class="header__all" data-section-button href="#">
      <span>all</span>
    </a>
  `;
}

