import { el, setChildren } from 'redom';
import { autorization, eventTarget } from '../modules/api.js';
import { routerCheckList } from '../modules/router.js';
import '../css/login.scss';
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
  'username',
  arrLog,
);
const inputPass = new LoginInput(
  'Пароль',
  'pas',
  errBtn,
  arrErr,
  inputMask,
  'btn-login',
  'password',
  arrLog,
);

// Форма входа DOM и отправка
export class LoginBox {
  constructor() {
    this.box = el('div', {class:'login'});
    this.inputLogin = inputLog.box;
    this.inputLogin.classList = 'formWrap login__formWrap';
    inputLog.input.id = 'inputLogin';
    inputLog.input.classList = 'formItem login__formItem';
    inputLog.input.placeholder = 'Введите логин';
    inputLog.errInput.classList = 'formErr login__formErr';
    this.inputPass = inputPass.box;
    this.inputPass.classList = 'formWrap login__formWrap';
    inputPass.input.id = 'inputPass';
    inputPass.input.classList = 'formItem login__formItem';
    inputPass.input.placeholder = 'Введите пароль';
    inputPass.errInput.classList = 'formErr login__formErr';
    this.form = el('form', {class: 'form login__form'}, [
      el('h1', {class: 'title login__title'}, 'Вход в аккаунт'),
      el('div', {class: 'formBox login__formBox'}, [
        el('span', { class: 'formText login__formText' }, 'Логин'),
        this.inputLogin
      ]),
      el('div', {class: 'formBox login__formBox'}, [
        el('span', { class: 'formText login__formText' }, 'Пароль'),
        this.inputPass
      ]),
      el('div', {class: 'boxBtn login__boxBtn'}, [
        el('button', { id: 'btn-login', disabled: 'true', type: 'submit', tabindex: '0', class: 'formBtn login__formBtn' }, 'Войти'),
      ] )
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
          inputLog.input.classList.add('finputErr-err');
          inputLog.errInput.classList.add('formErr-err');
        }
      } else {
        arrErr.map((obj) => {
          inputPass.errInput.textContent = obj.err;
        });
        if (arrErr.length) {
          inputPass.input.classList.add('finputErr-err');
          inputPass.errInput.classList.add('formErr-err');
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
      inputLog.input.classList.add('finputErr-err');
      inputLog.errInput.classList.add('formErr-err');
    }
  });

  // Вызов авторизации
  autorization(log, pass);
}

export { loginToken };
