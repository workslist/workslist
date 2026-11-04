'use strict'

import { projects } from "../js/data/projects.js";
import { sections } from "../js/data/sections.js";

export function renderLandings() {

  const projectCards = Object.entries(projects)
    .filter(([route, project]) => project.section === "/landings")
    .map(([route, project]) => {

      const section = sections.find(
        item => item.path === project.section
      );

      const hasValue = value => value !== undefined && value !== null && value !== "" && value !== 0;

      return `
        <a href="#${route}" data-link data-section="${project.section}" class="landings__card">          

          ${hasValue(project.title) ? `<h2 class="landings__subject">${project.title}</h2>` : ""}

          ${hasValue(project.description) ? `<p class="landings__descr">${project.description}</p>` : ""}

          ${hasValue(project.image) ? `<img class="landings__img" src="${project.image}" alt="${project.title}">` : ""}          

          ${section && hasValue(section.title) ? `<p class="landings__text">${section.title}</p>` : ""}          

        </a>
      `
    })
    .join("");

  return `
    <section class="landings">

      <div class="landings__cards">
        ${projectCards}
      </div>

    </section>
  `;
}