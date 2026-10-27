'use strict'

export function renderProject(projectPath) {
  return `
    <div class="project">
      <div class="project__loader">Загрузка...</div>

      <iframe
        src="${projectPath}"
        onload="this.parentElement.classList.add('project--loaded')"
      ></iframe>
    </div>
  `;
}

// onload="setTimeout(() => this.parentElement.classList.add('project--loaded'), 2000)"