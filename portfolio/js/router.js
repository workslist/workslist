'use strict'

import { renderHome } from "../pages/home.js";
import { renderLandings } from "../pages/landings.js";

const routes = {
  "/": renderHome,
  "/landings": renderLandings
};

const app = document.querySelector("#app");

export function renderRoute() {
  const path = location.hash.slice(1) || "/";
  const render = routes[path] || renderHome;

  app.innerHTML = render();
}

document.addEventListener("click", event => {

  const link = event.target.closest("[data-link]");

  if (!link) return;

  event.preventDefault();

  if (location.hash === link.hash) {
    renderRoute();
  } else {
    location.hash = link.hash;
  }

});

window.addEventListener("hashchange", renderRoute);
