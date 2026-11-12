// const { defineConfig } = require("cypress");

// module.exports = defineConfig({
//   e2e: {
//     setupNodeEvents(on, config) {
//       // implement node event listeners here
//     },
//   },
// });

const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Укажите URL вашего dev-сервера
    baseUrl: 'http://localhost:8080',

    // Укажите путь к тестам
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',

    // Если файл поддержки не используется, отключите его
    supportFile: false,

    // Настройка событий (при необходимости)
    setupNodeEvents(on, config) {
      // Реализуйте обработчики событий здесь, например:
      // on('before:browser:launch', (browser = {}, launchOptions) => {
      //   // Настройки перед запуском браузера
      // });
    },
  },
});