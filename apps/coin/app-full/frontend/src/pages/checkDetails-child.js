'use strict';

import { el, setChildren } from 'redom';
import { getAccount, eventTargetGetAccount } from '../modules/api.js';
import { routerCheckID, routerCheckListLS } from '../modules/router.js';
import { TableHistory } from '../modules/tableHistoryTrans.js';
import { BoxInput, SumCheckInput } from '../modules/input.js';
import IMask from 'imask';
import '../css/checkDetails.scss';

let arrErr = []; // Ошибки
let errBtn = []; // disabled кнопки
let arrCheck = []; // Массив счетов
const numMask = { mask: /^[1-9]\d*$/ }; // Маска поля ввода
const sumMask = { mask: /^[1-9]\d*$/ }; // Маска поля ввода

// Получение результата получения списка счетов, вывод ошибок
export function checkDetails(id, token) {
  const boxDetail = el('div'); // Общий бокс
  const boxPanel = el('div'); // Панель верх бокс
  const boxcentr = el('div'); // Центральный бокс
  const boxHistory = el('div'); // История переводов бокс
  const btnBack = el('button', 'Вернуться назад');
  // Слушаем событие успешной авторизации
  eventTargetGetAccount.addEventListener('authReady', (event) => {
    // Дальнейшая работа с результатом:
    const user = event.detail.payload;
    console.log(user);

    // Рендер стр
    // Верх панель
    const detailCheck = el('div', [
      el('h2', 'Просмотр счёта'),
      el('p', `№ ${user.account}`),
    ]);
    const detailBtn = el('div', [
      btnBack,
      el('p', [el('span', 'Баланс'), el('span', `${user.balance} ₽`)]),
    ]);

    // Новый перевод
    let transferBox = new TransferBox(user.account);

    // История баланса

    // История низ
    let newTableHistory = new TableHistory(user.transactions, user.account, 10); // Рисуем список

    boxcentr.append(transferBox.box);
    boxPanel.append(detailCheck, detailBtn);
    boxHistory.append(newTableHistory.boxTable);
    boxDetail.append(boxPanel, boxcentr, boxHistory);

    // Клики
    btnBack.addEventListener('click', async function () {
      routerCheckListLS();
    });
  });

  // Слушаем событие ошибки авторизации
  eventTargetGetAccount.addEventListener('authError', (event) => {
    console.log(`Ошибка получения списка: ${event.detail}`);
  });

  // Вызов списка
  getAccount(id, token);
  return boxDetail;
}

const sumCheckInput = new SumCheckInput(
  'Сумма перевода',
  'sum',
  errBtn,
  arrErr,
  sumMask,
  'btn-transfer'
);

class TransferBox {
  constructor(userAccount) {
    this.box = el('div');
    const numCheckBox = boxNumCheck(userAccount);
    // numCheckInput.box.id = 'inputNumBox';
    // numCheckInput.input.id = 'inputNum';
    this.SumCheckInput = sumCheckInput.box;
    sumCheckInput.input.id = 'inputSum';
    this.errNum = el('span', { class: 'form__error' });
    this.errSum = el('span', { class: 'form__error' });
    this.form = el('form', [
      el('h3', 'Новый перевод'),
      el('div', [
        el('span', { class: 'form__erro' }, 'Номер счёта получателя'),
        numCheckBox,
        this.errNum,
      ]),
      el('div', [
        el('span', { class: 'form__erro' }, 'Сумма перевода'),
        this.SumCheckInput,
        this.errSum,
      ]),
      el('button', { id: 'btn-transfer', disabled: 'true' }, 'Отправить'),
    ]);

    errBtn[0].err = true;
    errBtn[1].err = true;

    sumCheckInput.newMask.updateValue();

    setChildren(this.box, this.form);

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const numCheckInput = document.getElementById('inputNum');
      arrCheckLS(arrCheck, userAccount, numCheckInput.value);
      console.log(JSON.parse(localStorage.getItem(userAccount)));
      event.target.reset();
      console.log('perevod-vipolnen');
      // localStorage.removeItem(userAccount);
      routerCheckID(userAccount);
    });
  }
}

//Инпут номер счета
function boxNumCheck(userAccount) {
  const boxInput = el('div');
  const numCheckInputBox = new BoxInput(
    'Номер счёта получателя',
    'num',
    errBtn,
    arrErr,
    numMask,
    'btn-transfer'
  );

  errBtn[0].err = true;

  const checkInput = numCheckInputBox.input;
  checkInput.id = 'inputNum';

  const boxCheckList = el('div', { class: 'box-none' });
  const checkList = el('ul');

  const arrChecks = JSON.parse(localStorage.getItem(userAccount));
  for (const item of arrChecks) {
    const checkItem = el('div', item);
    checkList.append(checkItem);

    checkItem.addEventListener('click', () => {
      checkInput.value = checkItem.textContent;
      numCheckInputBox.newMask.updateValue();
    });
  }
  const body = document.body;
  // let objErr = numCheckInputBox.objErr;

  boxCheckList.append(checkList);
  boxInput.append(numCheckInputBox.box, boxCheckList);

  checkInput.addEventListener('focus', () => {
    if (arrChecks.length) {
      boxCheckList.classList.add('box-flex');
      console.log(errBtn);

      document.getElementById('inputSum').addEventListener('focus', () => {
        boxCheckList.classList.remove('box-flex');
      });
    }
  });

  boxInput.addEventListener('click', (event) => {
    event._isClickBox = true;
  });

  //Скрыть подсказку список счетов
  body.addEventListener('click', (event) => {
    if (event._isClickBox) return;
    boxCheckList.classList.remove('box-flex');
    // валидация
    console.log(checkInput.value);
    if (checkInput.value === '') {
      numCheckInputBox.objErr = { err: 'Поле не может быть пустым' };
      numCheckInputBox.errInput.textContent = numCheckInputBox.objErr.err;
    }
    console.log(numCheckInputBox.objErr);
  });
  return boxInput;
}

//Отрпавка перевода, запись счета в ЛС
// function transferSend() {}

// Записать счет в ЛС
function arrCheckLS(arr, usAcc, numVal) {
  let listChecs = JSON.parse(localStorage.getItem(usAcc));
  let repeatCheck = false;
  console.log(listChecs);
  if (listChecs) {
    arr = listChecs;
    for (let i of arr) {
      if (i === numVal) {
        repeatCheck = true;
        break;
      }
    }

    if (!repeatCheck) {
      arr.push(numVal);
    }
  } else {
    arr.push(numVal);
  }

  localStorage.setItem(usAcc, JSON.stringify(arr));
}
