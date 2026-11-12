/// <reference types="cypress" />

describe('Авторизация и переход на страницу счетов', () => {

  beforeEach(() => {
    // Открытие страницы логина и авторизация
    cy.visit('/login');

    // Ввод данных в форму авторизации
    cy.get('input[name="username"]').type('developer');
    cy.get('input[name="password"]').type('skillbox');

    // Клик по body для снятия фокуса с поля ввода
    cy.get('body').click();

    // Отправляем форму
    cy.get('button[type="submit"]').click();

    // Ожидаем перехода на страницу счетов и проверяем URL
    cy.url().should('include', '/accounts');

    // Проверяем, что текст "Ваши счета" отображается на странице
    cy.contains('Ваши счета').should('be.visible');
  });

  it('Успешный вход и переход на страницу счетов', () => {
    cy.log('Тест завершен успешно!');
  });
});


describe('Перевод со счета на счет', () => {

  beforeEach(() => {
    // Открытие страницы логина и авторизация
    cy.visit('/login');
    cy.get('input[name="username"]').type('developer');
    cy.get('input[name="password"]').type('skillbox');
    cy.get('body').click();
    cy.wait(3000);
    cy.get('button[type="submit"]').click();

    // Проверка перехода на страницу счетов
    cy.url().should('include', '/accounts');
    cy.contains('Ваши счета');
  });

  it('Найти счёт с ненулевым балансом и выполнить перевод', () => {
    // Найти <li> с ненулевым балансом
    cy.get('li.item.checsk__item')
      .filter((index, element) => {
        // Извлечь текст баланса
        const balanceText = Cypress.$(element).find('p.balance.checsk__balance').text().trim();
        const balance = parseFloat(balanceText.replace(/[^\d.-]/g, ''));
        return balance > 0; // Фильтровать по ненулевому балансу
      })
      .first() // Выбрать первый подходящий элемент <li>
      .within(() => {
        // Сохранить номер счёта для проверки в URL
        cy.get('h2.check.checsk__check')
          .invoke('text')
          .then((accountNumber) => {
            // Задержка перед кликом на кнопку "Открыть"
            cy.wait(3000); // Ждём 3 секунды
            cy.get('button.btn.checsk__btn').click();

            // Проверить, что URL содержит правильный параметр ?check=<номер счёта>
            cy.url().should('include', `?check=${accountNumber.trim()}`);
          });
      });

    // Заполнение инпутов для перевода
    cy.get('input[name="numberCheck"]').should('be.visible').type('66278254857742268558171756'); // Ввод номера счёта

    // Поле для суммы существует
    cy.get('input[name="summ"]', { timeout: 2000 }).should('exist').type('10'); // Ввод суммы (summ)

    // Клик по элементу с классом boxDetail__detailCheck для снятия фокуса
    cy.get('.boxDetail__detailCheck').click();

    // Задержка перед отправкой формы
    cy.wait(2000); // Ждём 2 секунды

    // Нажать кнопку отправки формы
    cy.contains('button', 'Отправить').click();

    // Задержка перед проверкой
    cy.wait(2000); // Ждём 2 секунды

    // Проверка, что поля ввода пустые после отправки
    cy.get('input[name="numberCheck"]').should('have.value', ''); // Поле должно быть пустым
    cy.get('input[name="summ"]').should('have.value', '');  // Поле должно быть пустым
  });

});

describe('Создать новый счет и совершить на него перевод', () => {
  it('Найти счёт с ненулевым балансом и выполнить перевод', () => {
    // Авторизация и переход на страницу счетов
    cy.visit('/login');
    cy.get('input[name="username"]').type('developer');
    cy.get('input[name="password"]').type('skillbox');
    cy.get('body').click();
    cy.wait(3000);
    cy.get('button[type="submit"]').click();

    // Проверка перехода на страницу счетов
    cy.url().should('include', '/accounts');
    cy.contains('Ваши счета');

    // Нажать на кнопку "Создать новый счёт"
    cy.contains('button', 'Создать новый счёт').click();

    // Подождать, пока новый счёт добавится в список
    cy.wait(3000);

    // Проверка, что новый элемент списка появился
    cy.get('li.item.checsk__item').last() // Возьмём последний элемент списка
      .within(() => {
        // Извлекаем номер счёта из нового li элемента
        cy.get('h2.check.checsk__check')
          .invoke('text')
          .then((newAccountNumber) => {
            // Сохраняем номер счёта для дальнейших тестов
            cy.wrap(newAccountNumber.trim()).as('newAccountNumber');
          });
      });

    // Найти <li> с ненулевым балансом
    cy.get('li.item.checsk__item')
      .filter((index, element) => {
        const balanceText = Cypress.$(element).find('p.balance.checsk__balance').text().trim();
        const balance = parseFloat(balanceText.replace(/[^\d.-]/g, ''));
        return balance > 0;
      })
      .first()
      .within(() => {
        // Сохранить номер счёта для проверки в URL
        cy.get('h2.check.checsk__check')
          .invoke('text')
          .then((accountNumber) => {
            cy.wait(3000);
            cy.get('button.btn.checsk__btn').click();
            cy.url().should('include', `?check=${accountNumber.trim()}`);
          });
      });

    // Использование сохранённого номера счёта для перевода
    cy.get('@newAccountNumber').then((newAccountNumber) => {
      cy.get('input[name="numberCheck"]').type(newAccountNumber); // Ввод сохранённого номера счёта
    });

    // Ввод суммы для перевода
    cy.get('input[name="summ"]', { timeout: 2000 }).type('10'); // Ввод суммы (summ)

    // Клик по элементу с классом boxDetail__detailCheck для снятия фокуса
    cy.get('.boxDetail__detailCheck').click();

    // Задержка перед отправкой формы
    cy.wait(2000); // Ждём 2 секунды

    // Нажать кнопку отправки формы
    cy.contains('button', 'Отправить').click();

    // Задержка перед проверкой
    cy.wait(2000); // Ждём 2 секунды

    // Проверка, что поля ввода пустые после отправки
    cy.get('input[name="numberCheck"]').should('have.value', ''); // Поле должно быть пустым
    cy.get('input[name="summ"]').should('have.value', '');  // Поле должно быть пустым
  });
});
