'use strict'

export function renderProject(projectPath) {
  return `
    <div class="project">

      <div class="project__loader">
        <div class="project__spinner"></div>
      </div>

      <iframe
        src="${projectPath}"
        onload="this.parentElement.classList.add('project--loaded')"        
      ></iframe>

    </div>
  `;
}

// onload="setTimeout(() => this.parentElement.classList.add('project--loaded'), 2000)"

// onload="this.parentElement.classList.add('project--loaded')"