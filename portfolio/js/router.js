'use strict'

import { renderHeader } from "./header.js";
import { renderHome } from "../pages/home.js";
import { renderLandings } from "../pages/landings.js";
import { renderProject } from "../pages/project.js";
import { projects } from "./data/projects.js";

const navigationHistory = [];
let currentSection = "/";

const routes = {
  "/": renderHome,
  "/landings": renderLandings
}

// const projects = {
//   "/project/lagoona": {
//     path: "../Layout/sass/flex/Lagoona/index.html",
//     section: "/landings"
//   }
// }

export function navigate(path, option = {}) {
  const currentPath = location.hash.slice(1) || "/";

  if (currentPath === path) return;

  navigationHistory.push(currentPath);

  if (option.section) {
    currentSection = option.section;
  } else if (projects[path]) {
    currentSection = projects[path].section;
  } else if (path !== "/") {
    currentSection = path;
  }

  location.hash = `#${path}`;

}

export function goBack() {
  if (navigationHistory.length === 0) {
    navigate("/");
    return;
  }

  const previousPath = navigationHistory.pop();

  location.hash = `#${previousPath}`;

}

function updateHeader(path) {
  const backButton = document.querySelector("[data-back]");
  const sectionButton = document.querySelector("[data-section-button]");

  if (backButton) {
    backButton.classList.toggle("header__link--hidden", path === "/");
  }

  if (sectionButton) {
    const isProject = path.startsWith("/project/");
    sectionButton.classList.toggle("header__link--hidden", !isProject);
  }  

}

const app = document.querySelector("#app");

export function renderRoute() {
  const path = location.hash.slice(1) || "/";

  if (projects[path] && navigationHistory.length === 0) {
    currentSection = projects[path].section;
    navigationHistory.push(currentSection);
  }

  const project = projects[path];

  const render = project ? () => renderProject(project.path) : routes[path] || renderHome;

  updateHeader(path);
  app.innerHTML = render();
}

document.addEventListener("click", event => {

  const backButton = event.target.closest("[data-back]");

  if (backButton) {
    event.preventDefault();
    goBack();
    return;
  }

  const sectionButton = event.target.closest("[data-section-button]");

  if (sectionButton) {    

    event.preventDefault();    

    if (navigationHistory.length > 0) {
      navigationHistory.pop();
    }

    location.hash = `#${currentSection}`
    return;
  }

  const link = event.target.closest("[data-link]");

  if (!link) return;

  event.preventDefault();

  const path = link.hash.slice(1) || "/";
  const section = link.dataset.section;

  navigate(path, {section});

});

document.querySelector("#header").innerHTML = renderHeader();
window.addEventListener("hashchange", renderRoute);
