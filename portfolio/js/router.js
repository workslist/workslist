'use strict'

import { renderHeader } from "./header.js";
import { renderHome } from "../pages/home.js";
import { renderLandings } from "../pages/landings.js";

const navigationHistory = [];
let currentSection = "/";
const routes = {
  "/": renderHome,
  "/landings": renderLandings
};

export function navigate(path, option = {}) {
  const currentPath = location.hash.slice(1) || "/";

  if (currentPath === path) return;

  navigationHistory.push(currentPath);

  if (option.section) {
    currentSection = option.section;
  } else if (currentPath !== "/") {
    currentSection = currentPath;
  }

  location.hash = `#${path}`;

}

export function goBack() {
  if (navigationHistory.length === 0) {
    navigate("/");
    return;
  }

  const previousPath = navigationHistory.pop();
  location.has = `#${previousPath}`;

}

function updateHeader(path) {
  const backButton = document.querySelector("[data-back]");
  const sectionButton = document.querySelector("[data-section]");

  if (backButton) {
    backButton.classList.toggle("header__link--hidden", path === "/");
  }

  if (sectionButton) {
    sectionButton.classList.add("header__link--hidden");
  }  

}

const app = document.querySelector("#app");

export function renderRoute() {
  const path = location.hash.slice(1) || "/";
  const render = routes[path] || renderHome;

  updateHeader(path);
  app.innerHTML = render();
}

document.addEventListener("click", event => {

  const backButton = event.target.closest("[data-back]");

  if (backButton) {
    goBack();
    return;
  }

  const link = event.target.closest("[data-link]");

  if (!link) return;

  event.preventDefault();

  const path = link.hash.slice(1) || "/";

  navigate(path)

});

document.querySelector("#header").innerHTML = renderHeader();
window.addEventListener("hashchange", renderRoute);
