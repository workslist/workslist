'use strict'

import { renderHeader } from "./header.js";
import { renderHome } from "../pages/home.js";
import { renderLandings } from "../pages/landings.js";
import { renderEmail } from "../pages/email.js";
import { renderApps } from "../pages/apps.js";
import { renderProject } from "../pages/project.js";
import { projects } from "./data/projects.js";

const navigationHistory = [];
let currentSection = "/";
const sectionScrollPositions = {};

const routes = {
  "/": renderHome,
  "/landings": renderLandings,
  "/emails": renderEmail,
  "/apps": renderApps
}

export function navigate(path, option = {}) {
  const currentPath = location.hash.slice(1) || "/";

  if (currentPath === path) return;

  if (projects[path] && routes[currentPath]) {
    const section = document.querySelector(".landings, .email");

    if (section) {
      sectionScrollPositions[currentPath] = section.scrollTop;
    }
  }

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
  const actionButton = document.querySelector(".header__all");

  const isProject = path.startsWith("/project/");
  const project = projects[path];

  if (backButton) {
    backButton.classList.toggle("display-hidden", path === "/");
  }

  if (!actionButton) return;

  const label = actionButton.querySelector("span");

  if (isProject && project?.git) {
    // Показываем Git
    actionButton.href = project.git;
    actionButton.target = "_blank";
    actionButton.rel = "noopener noreferrer";

    actionButton.removeAttribute("data-section-button");

    if (label) label.textContent = "Git";

    actionButton.classList.remove("display-hidden");

  } else {
    // Возвращаем All
    actionButton.href = "#";
    actionButton.removeAttribute("target");
    actionButton.removeAttribute("rel");

    actionButton.setAttribute("data-section-button", "");

    if (label) label.textContent = "All";

    actionButton.classList.toggle("display-hidden", !isProject || !project?.git);
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

  if (routes[path] && path !== "/") {
    requestAnimationFrame(() => {
      const section = document.querySelector(".landings, .email");

      if (section) {
        section.scrollTop = sectionScrollPositions[path] ?? 0;
      }
    });
  }
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
