'use strict'

export function renderProject(projectPath) {
  return `
    <iframe src="${projectPath}" width="100%" height="600"></iframe>
  `;
}