import { el, setChildren } from 'redom';
import {
  getAccounts,
  eventTargetGetAccounts,
  createAccount,
} from '../modules/api.js';
import { routerCheckListLS, routerCheckID } from '../modules/router.js';
import sortBottom from '../img/sortBottom.svg';
import sortTop from '../img/sortTop.svg';
import checkSort from '../img/checkSort.svg';
import plus from '../img/plus.svg';
import '../css/checks.scss';

let arrSortActive = [
  {
    value: 'account',
    name: 'По номеру',
  },
];

// Рендер массива списка счетов
export function getCheckAccounts(arr, token) {
  
  const boxCheck = el('div', { class: 'checsk' });
  const boxPanel = el('div', { class: 'boxPanel checsk__boxPanel' });
  const btnNewCheck = el('button', { id: 'btnNewCheck', class: 'boxPanelBtn checsk__boxPanelBtn' }, 'Создать новый счёт');
  const boxList = el('div', { id: 'boxList', class: 'boxList checsk__boxList' });

  const user = arr.payload;
  console.log(user);
  sort(user, arrSortActive[0].value); //Сортировка
  let newListCheck = new Checks(user); // Рисуем список
  let newCheckSort = checksSort(user); // Сохранить массив для сортировки

  boxPanel.append(newCheckSort, btnNewCheck);
  boxList.append(newListCheck.listCheck);
  boxCheck.append(boxPanel, boxList);

  // Создать счет и отобразить на странице
  btnNewCheck.addEventListener('click', async function () {
    await createAccount(token);
    routerCheckListLS();
  });

  return boxCheck;
}

// Рендер списка счетов после сортировки
function renderCheks(arr) {
  let newListCheck = new Checks(arr);
  const boxList = document.getElementById('boxList');
  boxList.innerHTML = '';
  boxList.append(newListCheck.listCheck);
  return boxList;
}

// Список счетов ul
class Checks {
  constructor(arr) {
    const arrCheckList = [...arr]; // Получить массив счетов

    this.listCheck = el('ul', {class: 'list checsk__list' });

    arrCheckList.map((obj) => {
      let newCheckCard = new CheckСard(obj);
      this.itemCheck = el('li', {class: 'item checsk__item' }, newCheckCard.box);
      this.listCheck.append(this.itemCheck);
    });
  }
}

// Карточка счета li
class CheckСard {
  constructor(obj) {
    let newDateTran = new DateTran(obj);

    this.box = el('div', { class: 'itemBox checsk__itemBox' });
    this.boxContent = el('div', { class: 'itemContent checsk__itemContent' }, [
      el('div', [el('h2', {class: 'check checsk__check' }, obj.account), el('p', {class: 'balance checsk__balance' }, `${obj.balance} ₽`)]),
      el('div', [el('p', {class: 'transactionBox checsk__transactionBox' }, 'Последняя транзакция:'), el('p',  {class: 'transactionValue checsk__transactionValue' }, newDateTran.mess)]),
    ]);
    this.btnCheck = el('button', {class: 'btn checsk__btn' }, 'Открыть');

    setChildren(this.box, [this.boxContent, this.btnCheck]);

    this.btnCheck.addEventListener('click', (event) => {
      event.preventDefault();
      // Меняем URL без перезагрузки страницы
      history.pushState(null, '', `/accounts/?check=${obj.account}`);

      //Достаю id из ссылки
      const searchParams = new URLSearchParams(location.search);
      const productId = searchParams.get('check');

      //Рендер
      routerCheckID(productId);
    });
  }
}

// Вытащить дату и сообщение
class DateTran {
  constructor(arr) {
    this.arrTran = arr.transactions;
    this.mess = null;
    if (this.arrTran.length > 0) {
      this.index = this.arrTran.length - 1;
      this.date = this.arrTran[this.index].date;

      this.dateMess = new Date(this.date);
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      this.mess = this.dateMess.toLocaleDateString('ru-RU', options);
      this.mess = this.mess.replace(/ г\.$/, '');
    } else {
      this.mess = 'Транзакции отсутствуют';
      this.date = 0;
    }
  }
}

//Сортировка списка счетов по возрастанию выбранных параметров
function sort(arr, value) {
  if (value === 'transactions') {
    arr.sort((a, b) => {
      const dateA =
        a.transactions.length > 0
          ? new Date(a.transactions[a.transactions.length - 1].date)
          : new Date(0); // Берем дату из второго объекта
      const dateB =
        b.transactions.length > 0
          ? new Date(b.transactions[b.transactions.length - 1].date)
          : new Date(0); // Берем дату из второго объекта
      return dateA - dateB; // Сортируем по возрастанию
    });
  } else {
    arr.sort((a, b) => a[value] - b[value]);
  }
}

// Панель с сортировкой
function checksSort(arr) {
  const boxSort = el('div', {class: 'boxSort checsk__boxSort'});
  const titleSort = el('h2', {class: 'title checsk__title'}, 'Ваши счета');
  const boxSortList = el('div', {class: 'sortList checsk__sortList'});
  const subjectSort = el('h3', {class: 'sortSubject checsk__sortSubject'} ,'Сортировка');
  const BoxlistSort = el('div');
  const sortImgBottom = el('img', { id: 'sortImgBottom', class: 'sortImg checsk__sortImg', src: sortBottom });
  const sortImgTop = el('img', { id: 'sortImgTop', class: 'sortImg checsk__sortImg checsk__sortImg-none', src: sortTop });

  setChildren(boxSortList, [subjectSort, BoxlistSort, sortImgBottom, sortImgTop]);
  setChildren(boxSort, [titleSort, boxSortList]);
  const arrSort = [
    {
      value: 'account',
      name: 'По номеру',
    },
    {
      value: 'balance',
      name: 'По балансу',
    },
    {
      value: 'transactions',
      name: 'По последней транзакции',
    },
  ];

  subjectSort.addEventListener('click', function () {
    if (document.getElementById('sort-list')) {
      document.getElementById('sort-list').remove();
      sortImgBottom.classList.remove('checsk__sortImg-none');
      sortImgTop.classList.add('checsk__sortImg-none');
      return;
    }
    let currentValue = arrSortActive[0].value;
    const listSort = el('ul', { id: 'sort-list', class: 'sortListAfter checsk__sortListAfter' });
    // При клике - стрелочка вверх
    arrSort.forEach((obj) => {
      let newSortItem = new checkSortItem(obj, arr);
      listSort.append(newSortItem.itemSort);
      if(obj.value === arrSortActive[0].value) {
        console.log(obj.value);
        // добавить класс картинке
        newSortItem.itemImg.classList.remove('checsk__sortItemImg-none');
      }
      if (newSortItem.itemVal === currentValue)
        sortImgBottom.classList.add('checsk__sortImg-none');
        sortImgTop.classList.remove('checsk__sortImg-none');
      // sortImgTop.src = sortTop;
    });
    BoxlistSort.append(listSort);
  });
  return boxSort;
}

// Элементы сортировки
class checkSortItem {
  constructor(obj, arr) {
    this.itemSort = el('li', { class: 'sortItem checsk__sortItem' }, obj.name);
    this.itemImg =  el('img', { class: 'sortItemImg checsk__sortItemImg checsk__sortItemImg-none', src: checkSort });
    this.itemVal = obj.value;
    const copyArr = [...arr];

    this.itemSort.append(this.itemImg);

    this.itemSort.addEventListener('click', function () {
      arrSortActive.length = 0;
      arrSortActive.push({
        value: obj.value,
        name: obj.name,
      });
      // Применить сортировку (взять значение из массива)
      sort(copyArr, arrSortActive[0].value);
      renderCheks(copyArr);
      console.log('object');
      // Закрыть список
      document.getElementById('sort-list').remove();
      sortImgBottom.classList.remove('checsk__sortImg-none');
      sortImgTop.classList.add('checsk__sortImg-none');
    });
  }
}