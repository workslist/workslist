import 'babel-polyfill';

// Рендер стр входа (главная)
// import { router } from './modules/router';
import {
  tokenLS,
  routerLogin,
  routerCheckList,
  routerCheckListLS,
  routerCheckID,
  listCurrency,
  listBanks,
} from './modules/router';

// При выходе очистить стореж и открыть вход
// localStorage.removeItem('tokenUser');

const path = window.location.pathname;

if (path === '/') {
  if (tokenLS()) {
    routerCheckListLS();
  } else {
    routerLogin();
  }
}

if (path === '/login') {
  if (tokenLS()) {
    routerCheckListLS();
  } else {
    routerLogin();
  }
}

if (path === '/accounts') {
  if (tokenLS()) {
    routerCheckListLS();
  } else {
    routerLogin();
  }
}

// Детальная инф-я о счёте
if (tokenLS()) {
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get('check');
  if (productId) {
    routerCheckID(productId);
  }
} else {
  routerLogin();
}

// Валюты
if (path === '/currencies') {
  if (tokenLS()) {
    listCurrency();
  } else {
    routerLogin();
  }
}

// Карта банкоматов
if (path === '/banks') {
  if (tokenLS()) {
    listBanks();
  } else {
    routerLogin();
  }
}
