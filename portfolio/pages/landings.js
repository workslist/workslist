'use strict'

import { landings } from "../js/data/landings.js";
import { projects } from "../js/data/projects.js";

export function renderLandings() {

  const projectLinks = Object.entries(landings).map(([route, project]) => {
    return `
      <a href="#${route}" data-link data-section="/landings">
        ${project.title}
      </a>
    `
  }).join("");

  return `
    <section class="landings">

      <h1 class="title title--landings">
        Лендинги
      </h1>
      <p class="descr descr--landings">
        Здесь будут мои проекты по вёрстке
      </p>
      ${projectLinks}

    </section>
  `;
}
