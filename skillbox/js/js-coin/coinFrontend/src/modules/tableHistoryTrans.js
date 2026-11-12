// Таблица История переводов div table
import { el, setChildren } from 'redom';
import '../css/tableHistoryTrans.scss';

export class TableHistory {
  constructor(arr, account, quantity) {
    const arrHistoryTrans = [...arr]; // Получить массив счетов

    // Сортировка по убыванию даты
    arrHistoryTrans.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Массив переводов дата - сумма
    this.arrListChart = [];

    // Рендер
    this.boxTable = el('div', { class: 'boxTable' }, [
      el('h3', { class: 'subject boxTable__subject' }, 'История переводов')
    ]);
    this.tbody = el('tbody', { class: 'tbody boxTable__tbody' });
    this.table = el('table', { class: 'table boxTable__table' }, [
      el('thead', { class: 'thead boxTable__thead' }, [
        el('tr', { class: 'line boxTable__line boxTable__line-theadTr' }, [
          el('th', { class: 'cell boxTable__cell boxTable__cell-th' }, 'Счёт отправителя'),
          el('th', { class: 'cell boxTable__cell boxTable__cell-th' }, 'Счёт получателя'),
          el('th', { class: 'cell boxTable__cell boxTable__cell-th' }, 'Сумма'),
          el('th', { class: 'cell boxTable__cell boxTable__cell-th' }, 'Дата'),
        ]),
      ]),
      this.tbody,
    ]);

    for (let i = 0; i < quantity; i++) {
      if (quantity === 25) {
        arrHHistoryChart(arrHistoryTrans, account, quantity, this.tbody);
      } else {
        if (arrHistoryTrans[i]) {
          let lineHistory = new LineHistory(arrHistoryTrans[i], account);
          this.tbody.append(lineHistory.line);
        }
      }
    }


    // Постраничный вывод строк
    // arrHHistoryChart(arrHistoryTrans, account, 25, this.table);

    // Получить массив переводов дата - сумма
    for (let i = 0; i < arrHistoryTrans.length; i++) {
      if (arrHistoryTrans[i]) {
        let lineHistoryChart = new LineHistory(arrHistoryTrans[i], account);
        // Добавить массив переводов дата - сумма для использования в др модулях
        this.arrListChart.push(lineHistoryChart.arrListChart);
      }
    }

    this.boxTable.append(this.table);
  }
}

// Рендер таблицы переводов для детального просмотра
function arrHHistoryChart(arr, account, quantity, box) {

  const newArr = [];
  let numPage = 0;
  const boxBtn = el('div', { class: 'boxBtn boxTable__boxBtn' });
  const btnRight = el('button', { class: 'button boxTable__button' }, 'Вперед');
  const btnLeft = el('button', { class: 'button boxTable__button' }, 'Назад');
  btnLeft.disabled = 'true';
  
  boxBtn.append(btnLeft, btnRight);

  // Распределить массив переводов по объектам  
  for (let i = 0; i < arr.length; i += quantity) {
      newArr.push({
          index: newArr.length, // Индекс текущего подмассива
          items: arr.slice(i, i + quantity) // Подмассив с 25 элементами
      });
  }

  function renderArrTrans(index) {
    if (newArr[index]) {
      const renderArr = newArr[index].items;
      box.innerHTML = '';
      for (let i = 0; i < quantity; i++) {
        if (renderArr[i]) {
          let lineHistory = new LineHistory(renderArr[i], account);
          box.append(lineHistory.line);
        }
      }
    } else {
      for (let i = 0; i < quantity; i++) {
        if (arr[i]) {
          let lineHistory = new LineHistory(arr[i], account);
          box.append(lineHistory.line);
        }
      }
    }

    if (newArr.length > 1) {
      box.append(boxBtn);
    }
      
  }

  function disabledBtn(index) {
    if(index === 0) {
      btnLeft.disabled = true;
    } else {
      btnLeft.disabled = false;
    }
    
    if(index === newArr.length - 1) {
      btnRight.disabled = true;
    } else {
      btnRight.disabled = false;
    }
  }

  renderArrTrans(numPage);

  btnRight.addEventListener('click', () => {
    numPage = numPage + 1;
    disabledBtn(numPage);
    
    box.innerHTML = '';
    renderArrTrans(numPage);
  });

  btnLeft.addEventListener('click', () => {
    numPage = numPage - 1;
    disabledBtn(numPage);
    box.innerHTML = '';
    renderArrTrans(numPage);
  });



  return box;
  

}

// Строка перевода tr
class LineHistory {
  constructor(obj, account) {
    let newDateTran = new DateTran(obj);

    this.account = account;
    this.sender = obj.from;
    this.balanceChange = null;
    this.line = el('tr', { class: 'line boxTable__line boxTable__line-tr' });
    this.senderСheck = el('td', { class: 'cell boxTable__cell boxTable__cell-td' }, obj.from); // Отправитель
    this.recipientСheck = el('td', { class: 'cell boxTable__cell boxTable__cell-td' }, obj.to); // Получатель
    let color = '#76CA66';  
    if ( this.balanceChange === '-' ) {
      color = '#FD4E5D';
    }

    this.sumСheck = el('td', { class: 'cell boxTable__cell boxTable__cell-td', style: { color: color } }, `${this.balanceChange} ${obj.amount}`); // Сумма перевода
    this.dateСheck = el('td', { class: 'cell boxTable__cell boxTable__cell-td' }, newDateTran.mess); // Дата
    this.arrListChart = {};

    setChildren(this.line, [
      this.senderСheck,
      this.recipientСheck,
      this.sumСheck,
      this.dateСheck,
    ]);

    // Добавляем счета в массив
    this.arrListChart = {
      date: newDateTran.mess,
      summ: `${this.balanceChange}${obj.amount}`,
    };
  
  }

  set senderСheck(value) {
    this._senderСheck = value;

    if (this.sender === this.account) {
      this.balanceChange = '-';
      // Добавить / удалить класс, меняющий цвет this.sumСheck
    } else {
      this.balanceChange = '+';
      // Добавить / удалить класс, меняющий цвет this.sumСheck
    }
  }

  get senderСheck() {
    return this._senderСheck;
  }
}

// Вытащить дату
class DateTran {
  constructor(obj) {
    this.objTran = obj.date;
    this.dateMess = new Date(this.objTran);
    const day = String(this.dateMess.getDate()).padStart(2, '0');
    const month = String(this.dateMess.getMonth() + 1).padStart(2, '0');
    const year = this.dateMess.getFullYear();
    this.mess = `${day}.${month}.${year}`;
  }
}
