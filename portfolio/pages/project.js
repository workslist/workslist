'use strict'

export function renderProject(projectPath) {
  return `
    <iframe src="${projectPath}"></iframe>
  `;
}