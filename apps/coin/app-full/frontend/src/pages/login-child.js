'use strict'

import { el, setChildren } from 'redom';
import { autorization, eventTarget } from '../modules/api.js';
import { routerCheckList } from '../modules/router';
// import { routerCheckList } from '../modules/router';
import { LoginInput } from '../modules/input.js';
// Форма входа (Главная стр "/")
// Логин и пароль (`developer`, `skillbox`)
const arrLog = [
  {
    login: '',
    pas: '',
  },
];

let arrErr = []; // Ошибки
let errBtn = []; // disabled кнопки
const inputMask = { mask: /^\S*$/ }; // Маска поля ввода

const inputLog = new LoginInput(
  'Логин',
  'login',
  errBtn,
  arrErr,
  inputMask,
  'btn-login',
  arrLog
);
const inputPass = new LoginInput(
  'Пароль',
  'pas',
  errBtn,
  arrErr,
  inputMask,
  'btn-login',
  arrLog
);

// Форма входа DOM и отправка
export class LoginBox {
  constructor() {
    this.box = el('div');
    this.inputLogin = inputLog.box;
    inputLog.input.id = 'inputLogin';
    this.inputPass = inputPass.box;
    inputPass.input.id = 'inputPass';
    this.errLog = el('span', { class: 'form__error' });
    this.errPas = el('span', { class: 'form__error' });
    this.form = el('form', [
      el('h1', 'Вход в аккаунт'),
      el('div', [
        el('span', { class: 'form__erro' }, 'Логин'),
        this.inputLogin,
        this.errLog,
      ]),
      el('div', [
        el('span', { class: 'form__erro' }, 'Пароль'),
        this.inputPass,
        this.errPas,
      ]),
      el('button', { id: 'btn-login', disabled: 'true' }, 'Войти'),
    ]);

    setChildren(this.box, this.form);

    this.form.addEventListener('submit', function (event) {
      event.preventDefault();
      let logValue = arrLog[0].login;
      let pasValue = arrLog[0].pas;
      token(logValue, pasValue); // Получить токен
      document.getElementById('btn-login').disabled = true;
    });
  }
}

let loginToken = null;

// Получение результата отправки формы, вывод ошибок
function token(log, pass) {
  // Слушаем событие успешной авторизации
  eventTarget.addEventListener('authReady', (event) => {
    // Дальнейшая работа с результатом:
    if (event.detail.payload) {
      const user = event.detail.payload.token;
      loginToken = user;
      routerCheckList();
    } else {
      arrErr.push({ err: event.detail.error });
      if (event.detail.error === 'No such user') {
        arrErr.map((obj) => {
          inputLog.errInput.textContent = obj.err;
        });
        if (arrErr.length) {
          inputLog.input.classList.add('form__input-valid');
          inputLog.errInput.classList.add('form__error-valid');
        }
      } else {
        arrErr.map((obj) => {
          inputPass.errInput.textContent = obj.err;
        });
        if (arrErr.length) {
          inputPass.input.classList.add('form__input-valid');
          inputPass.errInput.classList.add('form__error-valid');
        }
      }
    }
  });

  // Слушаем событие ошибки авторизации
  eventTarget.addEventListener('authError', (event) => {
    arrErr.push({ err: `Ошибка авторизации: ${event.detail}` });
    arrErr.map((obj) => {
      inputLog.errInput.textContent = obj.err;
    });
    if (arrErr.length) {
      inputLog.input.classList.add('form__input-valid');
      inputLog.errInput.classList.add('form__error-valid');
    }
  });

  // Вызов авторизации
  autorization(log, pass);
}

export { loginToken };
