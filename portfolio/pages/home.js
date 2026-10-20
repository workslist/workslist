'use strict'

import { sections } from "../js/data/sections.js";

export function renderHome() {

  const sectionLinks = sections.map(section => {
    return `
      <a class="link link--lendings" href="#${section.path}" data-link>
        ${section.title}
      </a>
    `;
  }).join("")
 
  return `
    <section class="home">
      <h1 class="title title--home">
        Портфолио
      </h1>
 
      <nav>
        ${sectionLinks}
      </nav>

  </section>
  `;
}