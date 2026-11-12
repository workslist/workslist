import { el, setChildren } from 'redom';
import { Header } from '../header/header.js';
import { headerLogin } from '../header/headerLogin.js';
import { LoginBox } from '../pages/login.js';
import { getCheckAccounts } from '../pages/checks.js';
import { checkDetails } from '../pages/checkDetails.js';
import { loginToken } from '../pages/login.js';
import { currency } from '../pages/currency.js';
import { bancsMap } from '../pages/banks.js';
import { spinner } from '../modules/spinner';
import '../css/main.scss';

const main = el('main', {id: 'main', class:'main'});
const SERVER_URL = 'http://localhost:3000';

let newHeader = new Header();
const header = newHeader.box

// Проверка наличия токена
export function tokenLS() {
  let userToken = localStorage.getItem('tokenUser');
  return userToken;
}

// 1) Стр Авторизация
export async function routerLogin() {
  history.pushState(null, '', '/login');
  let login = new LoginBox();
  const element = el('div', login.box);
  main.innerHTML = '';
  main.append(element);
  setChildren(window.document.body, [headerLogin, main]);
}

// 2) Список счетов по токену из авторизации (Запуск в Логине)
export async function routerCheckList() {

  async function serverGetChecs(token) {
    const spin = spinner(); // Показываем спиннер перед выполнением запроса
    main.append(spin); // Добавляем спиннер в элемент main
  
    return await fetch(SERVER_URL + '/accounts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    })
      .then((res) => res.json())
      .finally(() => {
        spin.remove(); // Убираем спиннер после завершения запроса
      });
  }
  
  const arrChecks = await serverGetChecs(loginToken);
  history.pushState(null, '', '/accounts');
  const listCheck = getCheckAccounts(arrChecks, loginToken);
  main.innerHTML = '';
  main.append(listCheck);
  setChildren(window.document.body, [header, main]);
  localStorage.setItem('tokenUser', loginToken);
  console.log(localStorage.getItem('tokenUser'));
}

// 2.1) Список счетов по токену из лс (Запуск на главной)
export async function routerCheckListLS() {

  async function serverGetChecs(token) {
    const spin = spinner(); // Показываем спиннер перед выполнением запроса
    main.append(spin); // Добавляем спиннер в элемент main
  
    return await fetch(SERVER_URL + '/accounts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    })
      .then((res) => res.json())
      .finally(() => {
        spin.remove(); // Убираем спиннер после завершения запроса
      });
  }
  
  const userToken = localStorage.getItem('tokenUser');
  const arrChecks = await serverGetChecs(userToken);

  history.pushState(null, '', '/accounts');
  let listCheck = getCheckAccounts(arrChecks, userToken);
  main.innerHTML = '';
  main.append(listCheck);
  setChildren(window.document.body, [header, main]);
}

// 3) Просмотр счета
export async function routerCheckID(id) {

  async function getAccount(id, token) {
    const spin = spinner(); // Показываем спиннер перед выполнением запроса
    main.append(spin);
  
    return await fetch(`http://localhost:3000/account/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    })
      .then((res) => res.json())
      .finally(() => spin.remove()); // Убираем спиннер после завершения запроса
  }

  let arrCheckDetail = await getAccount(id, tokenLS());
  const element = await checkDetails(arrCheckDetail);

  main.innerHTML = '';
  main.append(element);
  setChildren(window.document.body, [header, main]);
}

// 4) Список валютных счетов
export async function listCurrency() {

  async function getCurrencyAccounts(token) {
    const spin = spinner(); // Включаем спиннер перед выполнением запроса
    main.append(spin); // Добавляем спиннер в элемент main
  
    return await fetch(SERVER_URL + '/currencies', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    })
      .then((data) => data.json())
      .finally(() => {
        spin.remove(); // Убираем спиннер после завершения запроса
      });
  }

  const arrCurrency = await getCurrencyAccounts(tokenLS());

  history.pushState(null, '', '/currencies');
  const element = await currency(arrCurrency, tokenLS());
  main.innerHTML = '';
  main.append(element);
  setChildren(window.document.body, [header, main]);
}

// 5) Банкоматы
export async function listBanks() {

  async function getBanks(token) {
    const spin = spinner(); // Включаем спиннер перед выполнением запроса
    main.append(spin); // Добавляем спиннер в элемент main
  
    return await fetch(SERVER_URL + '/banks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    })
      .then((data) => data.json())
      .finally(() => {
        spin.remove(); // Убираем спиннер после завершения запроса
      });
  }

  const arrBanks = await getBanks(tokenLS());


  history.pushState(null, '', '/banks');
  const element = bancsMap(arrBanks);
  main.innerHTML = '';
  main.append(element);
  setChildren(window.document.body, [header, main]);
}
