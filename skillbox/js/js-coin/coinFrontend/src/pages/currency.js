import { el, setChildren } from 'redom';
import { getKnownCurrwncies, exchangeCurrency } from '../modules/api';
import { listCurrency } from '../modules/router';
import IMask from 'imask';
import imgGreen from '../img/img_green.svg';
import imgRed from '../img/img_red.svg';
import sortBottom from '../img/sortBottom.svg';
import sortTop from '../img/sortTop.svg';
import { spinner } from '../modules/spinner';
import '../css/currency.scss';

export async function currency(arr, token) {

  let arrCurency = []
  arrCurency = Object.values(arr.payload);

  const boxCurrency = el('div', { class: 'currency' }); // Общий бокс
  const boxPanel = el('div', {class:'topPanel currency__topPanel'}, [
    el('h2', {class:'title currency__title'}, 'Валютный обмен'),
  ]); // Панель верх бокс
  const boxCenter = el('div', { class: 'boxCenter currency__boxCenter' }); // Центральный бокс
  const boxLeft = el('div', { class: 'boxLeft currency__boxLeft' }); // Левый бокс
  const boxRight = el('div', { class: 'boxRight currency__boxRight' }); // Правый бокс

  // Ваши валюты
  let newUserCurrency = new UserCurrency(arrCurency);
  const boxUserCurency = newUserCurrency.box;

  // ----

  let ws; // Глобальная переменная для WebSocket

  // Изменение курсов
  async function getChangedCurrency() {
    ws = new WebSocket('ws://localhost:3000/currency-feed');
    
    return new Promise((resolve, reject) => {
      // Обработчик для открытия соединения
      ws.onopen = () => {
        console.log('WebSocket подключен');
      };

      // Обработчик для получения данных
      ws.onmessage = (event) => {
        try {
          const currencyData = JSON.parse(event.data);
          // console.log('Изменение валюты:', currencyData);
          let newLinesСhange = new LinesСhange(currencyData);
        } catch (error) {
          console.error('Ошибка при обработке данных:', error);
        }
      };

      // Обработчик для ошибок
      ws.onerror = (error) => {
        console.error('Ошибка WebSocket:', error);
        reject(error);
      };

      // Обработчик для закрытия соединения
      ws.onclose = () => {
        console.log('WebSocket соединение закрыто');
      };
    });
  }

  // Функция для остановки WebSocket-соединения
  function stopCurrencyUpdates() {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close(); // Закрытие соединения
      console.log('WebSocket соединение закрыто вручную');
    } else {
      console.log('WebSocket не подключен или уже закрыт');
    }
  }

  // Использование функции
  getChangedCurrency()
    .then(() => {
      console.log('Готово к получению данных...');
    })
    .catch((error) => {
      console.error('Ошибка при подключении к WebSocket:', error);
    });

  let newBoxСhange = new BoxСhange(arrCurency);
  const boxnewBoxСhange = newBoxСhange.box;

      // Обмен валюты
  const listCurrency = await getKnownCurrwncies();
  const arrListCurrency = listCurrency.payload
  const newCurrencyExchange = new CurrencyExchange(arrListCurrency, token, stopCurrencyUpdates);
  const boxCurrencyExchange = newCurrencyExchange.box;

  boxRight.append(boxnewBoxСhange);
  boxLeft.append(boxUserCurency, boxCurrencyExchange);
  boxCenter.append(boxLeft, boxRight)
  boxCurrency.append(boxPanel, boxCenter);
  return boxCurrency;
}

// Бокс Изменение курсов в реальном времени
class BoxСhange {
  constructor() {
    this.box = el('div', {class: 'exchangeСhange currency__exchangeСhange'});
    this.subject = el('h3', { class: 'subject exchangeСhange__subject'}, 'Изменение курсов в реальном времени');
    this.list = el('ul', {id: 'listСhange', class: 'list exchangeСhange__list'});

    this.box.append(this.subject, this.list);

  }
}

// Строчка валюты
class LinesСhange {
  constructor(obj) {

    let color = '#76CA66';
    let image = imgGreen;

    if (obj.change === -1) {
      color = '#FD4E5D';
      image = imgRed;
    }

    this.item = el('li', { class: 'item exchangeСhange__item'});
    this.curr = el('p', { class: 'curr exchangeСhange__curr'}, `${obj.from}/${obj.to}`);
    this.val = el('p', { class: 'val exchangeСhange__val'}, obj.rate);
    this.img = el('img', { class: 'image exchangeСhange__image', src: image }),
    this.line = el('p', { style: { border: `1px dashed ${color}` }, class: 'line exchangeСhange__line'});
    this.item.append(this.curr, this.val, this.img, this.line);

    this.list = document.getElementById('listСhange');

    this.list.append(this.item);
    
  }
}

// Обмен валют
class CurrencyExchange {
  constructor(arr, token, fun) {
    this.box = el('div', {class: 'currencyExchange currency__currencyExchange'});
    this.subject = el('h3', 'Обмен валюты'), { class: 'subject currencyExchange__subject'};
    this.boxCenter = el('div', { class: 'boxCenter currencyExchange__boxCenter'});
    this.boxInput = el('div', { class: 'boxInput currencyExchange__boxInput'});
    this.button = el('button', { class: 'btn currencyExchange__btn'}, 'Обменять');

    // Инпуты откуда куда
    let newInputFromTo = new InputFromTo(arr);
    const boxInputFromTo = newInputFromTo.box;
    // Инпут сумма
    let newInputSumm = new InputSumm('inputSumm');
    const boxInputSumm = newInputSumm.box;

    this.boxInput.append(boxInputFromTo, boxInputSumm);
    this.boxCenter.append(this.boxInput, this.button);
    this.box.append(this.subject, this.boxCenter);

    // Отправка обмена валюты
    // async function exchangeCurrency(from, to, amount, token) {
    //   return await fetch('http://localhost:3000/currency-buy', {
    //     method: 'POST',
    //     body: JSON.stringify({
    //       from,
    //       to,
    //       amount,
    //     }),
    //     headers: {
    //       'Content-Type': 'application/json',
    //       authorization: `Basic ${token}`,
    //     },
    //   }).then((res) => res.json());
    // }

    async function exchangeCurrency(from, to, amount, token) {
      const main = document.getElementById('main');
      const spin = spinner(); // Включаем спиннер перед выполнением запроса
      main.append(spin); // Добавляем спиннер в элемент main
    
      return await fetch('http://localhost:3000/currency-buy', {
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
      })
        .then((res) => res.json())
        .finally(() => {
          spin.remove(); // Убираем спиннер после завершения запроса
        });
    }

    // Отправка формы(обмен)
    this.button.addEventListener('click', async () => {
      const inputFrom = document.getElementById('inputFrom').value;
      const inputTo = document.getElementById('inputTo').value;
      const inputSumm = document.getElementById('inputSumm').value;

      if(!inputSumm) {
        console.log('Поле сумма перевода не должно быть пустым');
      } else {
        const newExchangeCurrency = await exchangeCurrency(inputFrom, inputTo, inputSumm, token);
        console.log(newExchangeCurrency);
        if ( newExchangeCurrency.payload ) {
          fun();
          await listCurrency();

        } else {
          console.log('Перевод не выполнен');
        }
      }
      
    });

  }
}

// Бокс - инпут сумма
class InputSumm {
  constructor(id) {
    this.box = el('div', {class: 'boxSumm currencyExchange__boxSumm'});
    this.spanFrom = el('span', { class: 'text currencyExchange__text'}, 'Сумма');
    this.input= el('input', {id: id, placeholder: 'Введите сумму', class: 'inputSumm currencyExchange__inputSumm'});

    const mask = /^[0-9]*\.?[0-9]*$/;
    IMask(this.input, mask);
    
    this.box.append(this.spanFrom, this.input);
  }
}

// Бокс - инпуты откуда/куда
class InputFromTo {
  constructor(arr) {
    this.box = el('div', {class: 'boxFromTo currencyExchange__boxFromTo'});
    this.spanFrom = el('span', {class: 'text currencyExchange__text'}, 'Из');
    this.spanTo = el('span', {class: 'text currencyExchange__text'}, 'в');
    this.inputFrom = boxInputFromTo(arr, 0, 'inputFrom');
    this.inputTo = boxInputFromTo(arr, 1, 'inputTo');

    this.box.append(this.spanFrom, this.inputFrom, this.spanTo, this.inputTo );
  }
}

// Инпут откуда/куда
function boxInputFromTo(arr, index, id) {

  const boxInput = el('div', { class: 'inputFromToBox currencyExchange__inputFromToBox' });

  const fromToInput = el('input', { id: id, class: 'inputFromTo currencyExchange__inputFromTo'});
  const formImgTop = el('img', { id: 'formImgTop', class: 'formToImg currencyExchange__formToImg currencyExchange__formToImg-none', src: sortTop });
  const formImgBottom = el('img', { id: 'formImgBottom', class: 'formToImg currencyExchange__formToImg', src: sortBottom });

  const boxCurrencyList = el('div', { class: 'box-none formBoxCurr currencyExchange__formBoxCurr' });
  const CurrensyList = el('ul', { class: 'formBoxList currencyExchange__formBoxList' });
  const body = document.body;

  let arrCurrency = [];
  
  if (arr.length) {
    arrCurrency = arr;
    fromToInput.value = arrCurrency[index];
    fromToInput.readOnly = true;
  }

  for (const item of arrCurrency) {
    const checkItem = el('li', { class: 'formBoxItem currencyExchange__formBoxItem' }, item);
    CurrensyList.append(checkItem);

    checkItem.addEventListener('click', () => {
      fromToInput.value = checkItem.textContent;
      boxCurrencyList.classList.remove('box-flex');
      formImgBottom.classList.remove('currencyExchange__formToImg-none');
      formImgTop.classList.add('currencyExchange__formToImg-none');
    });
  }

  let isCheckInputFocused = false;

  fromToInput.addEventListener('focus', () => {

    if (arrCurrency.length) {
      boxCurrencyList.classList.add('box-flex');
    }
    isCheckInputFocused = true;
  });

  fromToInput.addEventListener('click', (event) => {
    event._isClickBox = true;
    formImgBottom.classList.add('currencyExchange__formToImg-none');
    formImgTop.classList.remove('currencyExchange__formToImg-none');
  });

  //Скрыть список валют
  body.addEventListener('click', (event) => {
    if (!isCheckInputFocused) return;
    if (event._isClickBox) return;
    boxCurrencyList.classList.remove('box-flex');
    formImgBottom.classList.remove('currencyExchange__formToImg-none');
    formImgTop.classList.add('currencyExchange__formToImg-none');

    isCheckInputFocused = false;
  });

  
  boxCurrencyList.append(CurrensyList);
  boxInput.append(fromToInput, formImgTop, formImgBottom, boxCurrencyList);

  return boxInput;
}

// Ваши валюты
class UserCurrency {
  constructor(arr) {
    this.box = el('div', {class: 'userCurrency currency__userCurrency'});
    this.subject = el('h3', { class: 'subject userCurrency__subject'}, 'Ваши валюты');
    this.list = el('ul', { class: 'list userCurrency__list'});

    this.box.append(this.subject, this.list);

    for (const item of arr) {
      if (item.amount !==0) {
        let newUserCurrencyLine = new UserCurrencyLine(item);
        const newItem = newUserCurrencyLine.item;
        this.list.append(newItem);
      }
    }

    
  }
}

// Строчка валюты
class UserCurrencyLine {
  constructor(obj) {
    this.item = el('li', { class: 'item userCurrency__item'});
    this.curr = el('p', { class: 'curr userCurrency__curr'}, obj.code);
    this.val = el('p', { class: 'val userCurrency__val'}, obj.amount);
    this.line = el('p', { class: 'line userCurrency__line'});
    this.item.append(this.curr, this.val, this.line);
  }
}
