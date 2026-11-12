import { el, setChildren } from 'redom';
import { tokenLS, routerCheckListLS, routerCheckID } from '../modules/router';
import { TableHistory } from '../modules/tableHistoryTrans.js';
import { SumCheckInput } from '../modules/input.js';
import { HistoryChart } from '../modules/balanceHistoryChart.js';
import { detailHistoryBalance } from '../modules/detailBalanceHistory.js';
import IMask from 'imask';
import '../css/checkDetails.scss';

let arrErr = []; // Ошибки
let errBtn = []; // disabled кнопки
let arrCheck = []; // Массив счетов
const numMask = { mask: /^[1-9]\d*$/ }; // Маска поля ввода
const sumMask = { mask: /^[1-9]\d*$/ }; // Маска поля ввода

export async function checkDetails(arr) {
  const boxDetail = el('div', { class: 'boxDetail' }); // Общий бокс
  const boxPanel = el('div', { class: 'detailCheck boxDetail__detailCheck' }); // Панель верх бокс 
  const boxcentr = el('div', { class: 'detailCentr boxDetail__detailCentr' }); // Центральный бокс
  const boxHistory = el('div', { class: 'detailHistory boxDetail__detailHistory' }); // История переводов бокс
  const btnBack = el('button', { class: 'btn boxDetail__btn' }, 'Вернуться назад');

  const user = arr.payload;

  // Массив истории переводов
  let balArr = [];
  balArr = user.transactions;

  // Рендер стр
  // Верх панель
  const detailCheck = el('div', [
    el('h2', { class: 'title boxDetail__title' }, 'Просмотр счёта'),
    el('p', { class: 'check boxDetail__check' }, `№ ${user.account}`),
  ]);
  const detailBtn = el('div', [
    btnBack,
    el('p', { class: 'descr boxDetail__descr' }, [
      el('span', { class: 'text boxDetail__text' }, 'Баланс'), 
      el('span', { class: 'value boxDetail__value' }, `${user.balance} ₽`)
    ]),
  ]);

  // Новый перевод
  let transferBox = new TransferBox(user.account);

  // История низ
  let newTableHistory = new TableHistory(user.transactions, user.account, 10);

  // История баланса график
  // Массив переводов дата - сумма
  let arrListChart = [];
  arrListChart.length = 0;
  arrListChart = newTableHistory.arrListChart;

  // Рендер графика переводов
  const usBalance = user.balance;
  let newHistoryChart = new HistoryChart(arrListChart, usBalance, 6);
  const boxHistoryChart = newHistoryChart.box;


  // Загрузить детальную информацию о счете
  function histiryBalancePages(arr) {
    boxDetail.innerHTML = '';
    const newDetailHistoryChart = detailHistoryBalance(arr);
    boxDetail.append(newDetailHistoryChart);
  }

  boxHistoryChart.addEventListener('click', async function () {
    histiryBalancePages(arr);
  });

  boxHistory.addEventListener('click', async function () {
    histiryBalancePages(arr);
  });

  boxcentr.append(transferBox.box, boxHistoryChart);
  boxPanel.append(detailCheck, detailBtn);
  boxHistory.append(newTableHistory.boxTable);
  boxDetail.append(boxPanel, boxcentr, boxHistory);

  // Клики
  btnBack.addEventListener('click', async function () {
    routerCheckListLS();
  });

  return boxDetail;
}

const sumCheckInput = new SumCheckInput(
  'Сумма перевода',
  'sum',
  errBtn,
  arrErr,
  sumMask,
  'btn-transfer',
  'summ'
);

class TransferBox {
  constructor(userAccount) {
    this.box = el('div', { class: 'transferBox boxDetail__transferBox' }, [
      el('h3', { class: 'transferSubject boxDetail__transferSubject' }, 'Новый перевод'),
    ]);
    const numCheckBox = boxNumCheck(userAccount);
    this.SumCheckInput = sumCheckInput.box;
    sumCheckInput.input.id = 'inputSum';
    sumCheckInput.input.classList = 'formInput boxDetail__formInput';
    sumCheckInput.input.placeholder = 'Введите сумму';
    sumCheckInput.errInput.classList = 'formInputErr boxDetail__formInputErr';
    sumCheckInput.box.classList = 'inputBoxCheck boxDetail__inputBoxCheck';
    // this.errNum = el('span', { class: 'formInputErr boxDetail__formInputErr' });
    // this.errSum = el('span', { class: 'formInputErr boxDetail__formInputErr' });
    this.form = el('form', { class: 'form boxDetail__form' }, [
      el('div', { class: 'inputBox boxDetail__inputBox' }, [
        el('span', { class: 'inputText boxDetail__inputText' }, 'Номер счёта получателя'),
        numCheckBox,
        // this.errNum,
      ]),
      el('div', { class: 'inputBox boxDetail__inputBox' }, [
        el('span', { class: 'inputText boxDetail__inputText' }, 'Сумма перевода'),
        this.SumCheckInput,
        // this.errSum,
      ]),
      el('div', { class: 'formBtnBox boxDetail__formBtnBox' }, [
        el('button', { id: 'btn-transfer', disabled: 'true', class: 'formBtn boxDetail__formBtn' }, 'Отправить'),
      ]),
    ]);

    for (const item of errBtn) {
      if (item.name === 'Сумма перевода') {
        item.err = true;
        break
      }
    }

    sumCheckInput.newMask.updateValue();

    this.box.append(this.form);

    // Отправить перевод со счета на счет
    async function transferFunds(from, to, amount, token) {
      return await fetch('http://localhost:3000/transfer-funds', {
        method: 'POST',
        body: JSON.stringify({
          from,
          to,
          amount,
        }),
        headers: {
          'Content-Type': 'application/json',
          authorization: `Basic ${token}`,
        },
      }).then((res) => res.json());
    }

    this.form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const numCheckInput = document.getElementById('inputNum'); 
      const sumCheckInput = document.getElementById('inputSum'); 
      const numVal = numCheckInput.value
      const sumVal = sumCheckInput.value
      
      const newTransferFunds = await transferFunds(userAccount, numVal, sumVal, tokenLS())

      if ( newTransferFunds.payload ) {
        arrCheckLS(arrCheck, userAccount, numCheckInput.value);
        event.target.reset();
        routerCheckID(userAccount);
      } else {
        const objErr = { err: newTransferFunds.error };
        const errText = document.getElementById('errInputNum');
        arrErr.push(objErr);
        arrErr.map((obj) => {
          errText.textContent = obj.err;
        });
      }
    });
  }
}

function boxNumCheck(userAccount) {

  const boxInput = el('div', { class: 'inputBoxCheck boxDetail__inputBoxCheck' });

  const checkInput = el('input', {
    class: 'formInput boxDetail__formInput',
    type: 'text',
    name: 'numberCheck',
    placeholder: 'Введите номер',
  });
  checkInput.id = 'inputNum';
  const errInput = el('span', { class: 'formInputErr boxDetail__formInputErr' });
  errInput.id = 'errInputNum';

  const boxCheckList = el('div', { class: 'box-none' });
  const checkList = el('ul', { class: 'formListCheck boxDetail__formListCheck' });
  const body = document.body;
  
  let newMask = IMask(checkInput, numMask);

  let arrChecks = [];

  if(errBtn.length < 2) {
    errBtn.push({
      name: 'Номер счёта получателя',
      err: true,
    });
  }

  if (JSON.parse(localStorage.getItem(userAccount))) {
    arrChecks = JSON.parse(localStorage.getItem(userAccount));
  }

  for (const item of arrChecks) {
    const checkItem = el('li', { class: 'formItemCheck boxDetail__formItemCheck' }, item);
    checkList.append(checkItem);

    checkItem.addEventListener('click', () => {
      checkInput.value = checkItem.textContent;
      boxCheckList.classList.remove('box-flex');
    });
  }

  let isCheckInputFocused = false;

  checkInput.addEventListener('focus', () => {

    document.getElementById('btn-transfer').disabled = true;
    arrErr.length = 0;
    errInput.textContent = '';
    checkInput.classList.remove('finputErr-err');

    if (arrChecks.length) {
      boxCheckList.classList.add('box-flex');

      console.log('Добавить удаление подсказки при фокусе для элемента выше');
      document.getElementById('inputSum').addEventListener('focus', () => {
        boxCheckList.classList.remove('box-flex');
      });
    }
    isCheckInputFocused = true;
  });

  boxInput.addEventListener('click', (event) => {
    event._isClickBox = true;
    newMask.updateValue();
  });

  //Скрыть подсказку список счетов
  body.addEventListener('click', (event) => {
    if (!isCheckInputFocused) return;
    if (event._isClickBox) return;
    boxCheckList.classList.remove('box-flex');
    // валидация
    if (checkInput.value === '') {
      const objErr = { err: 'Поле не может быть пустым' }; 
      checkInput.classList.add('finputErr-err');
      arrErr.push(objErr);
      arrErr.map((obj) => {
        errInput.textContent = obj.err;
      });
      for (const item of errBtn) {
        if (item.name === 'Номер счёта получателя') {
          item.err = true;
          break
        }
      }
    } else {
      for (const item of errBtn) {
        if (item.name === 'Номер счёта получателя') {
          item.err = false;
          break
        }
      }
    }

    for (const item of errBtn) {
      if (item.err) {
        document.getElementById('btn-transfer').disabled = true;
        break;
      }
      document.getElementById('btn-transfer').disabled = false;
    }
    isCheckInputFocused = false;
  });

  
  boxCheckList.append(checkList);
  boxInput.append(checkInput, errInput, boxCheckList);
  return boxInput;
}

// Записать счет в ЛС
function arrCheckLS(arr, usAcc, numVal) {
  let listChecs = JSON.parse(localStorage.getItem(usAcc));
  let repeatCheck = false;
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