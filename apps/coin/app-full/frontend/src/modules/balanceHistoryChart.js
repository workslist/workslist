// График история баланса
import { el, setChildren } from 'redom';
import '../css/balanceHistoryChart.scss';

// Рендер динамика баланса за x месяцев
export class HistoryChart {
  constructor(arr, balance, mon) {

    this.arrBalance = balanceHistoryChart(arr, balance, mon);
    this.heightBoxChart = '165';

    let topBalans = 0;
    let minBalans = 0;

    if (this.arrBalance.length) {
      topBalans = Math.floor(this.arrBalance[0].topBalans * 10) / 10;
      minBalans = Math.floor(this.arrBalance[0].minBalans * 10) / 10;
    }
    

    this.box = el('div', {class:'dynamics'});
    this.subject = el('h2', {class:'caption dynamics__caption'}, 'Динамика баланса');
    this.boxChart = el('div', { style: { height: `${this.heightBoxChart}px` }, class:'chart dynamics__chart'});
    this.boxBalance = el('div', {class:'balance dynamics__balance'}, [
      el('div', {class:'value dynamics__value'}, [
        el('p', topBalans),
        el('p', minBalans),
      ])
    ]);
    this.listBalance = el('div', {class:'list dynamics__list'});

    this.boxChart.append(this.listBalance, this.boxBalance);
    this.box.append(this.subject, this.boxChart);

    this.arrBalance.sort((a, b) => parseInt(b.monthNumber) - parseInt(a.monthNumber));
    for (const item of this.arrBalance) {
      
      const result = this.heightBoxChart * (item.percent / 100);
      
      const elBalance = el('div', {class:'item dynamics__item'}, [
        el('div', { style: { height: `${Math.round(result)}px`, backgroundColor: '#116ACC'}, class:'column dynamics__column' }),
        el('p', {class: 'month dynamics__month'}, item.month)
      ])
      this.listBalance.append(elBalance);
    }

  }
}

// Динамика баланса
export class HistoryChartvNegative {
  constructor(arr, mon) {
  
    this.arrCheck = transactionsHistoryChart(arr, mon);
    this.heightBoxChart = '165';

    let topCheck = 0;
    let centerCheck = 0;
    let minCheck = 0;

    if (this.arrCheck.length) {
      if (Math.abs(this.arrCheck[0].topCheck) > Math.abs(this.arrCheck[0].minCheck)) {
        topCheck = Math.floor(this.arrCheck[0].topCheck * 10) / 10;
        centerCheck = Math.floor(this.arrCheck[0].minCheck * 10) / 10;
      } else {
        centerCheck = this.arrCheck[0].topCheck;
        topCheck = this.arrCheck[0].minCheck;
      }
    }

    this.box = el('div', {class:'dynamics'});
    this.subject = el('h2', {class:'caption dynamics__caption'}, 'Соотношение входящих исходящих транзакций');
    this.boxChart = el('div', { style: { height: `${this.heightBoxChart}px` }, class:'chart dynamics__chart'});
    this.topCheck = el('p', Math.abs(topCheck));
    this.boxBalance = el('div', {class:'balance dynamics__balance'}, [
      el('div', {class:'value dynamics__value'}, [
        this.topCheck,
        el('p', Math.abs(centerCheck)),
        el('p', minCheck),
      ])
    ]);
    this.listBalance = el('div', {class:'list dynamics__list'});

    this.boxChart.append(this.listBalance, this.boxBalance);
    this.box.append(this.subject, this.boxChart);

    console.log(this.arrCheck);

    // Рендер столбцов +
    this.arrCheck.sort((a, b) => parseInt(b.monthNumber) - parseInt(a.monthNumber));
    for (const item of this.arrCheck) {

      let result = this.heightBoxChart * (item.percentMaxCheck / 100);
      let resultNegative = this.heightBoxChart * (item.percentMinCheck / 100);

      const maxHeightClass = 'column dynamics__column dynamics__column-maxHeight';
      const normalHeightClass = 'column dynamics__column';
      let classHeightPositiv = null;
      let classHeightNegativ = null;

      if (this.topCheck === Math.abs(this.arrCheck[0].minCheck)) {
        classHeightPositiv = maxHeightClass;
        classHeightNegativ = normalHeightClass;
        
      } else {
        classHeightPositiv = normalHeightClass;
        classHeightNegativ = maxHeightClass;
      }
      // 'dynamics__column-negative'
      
      const elCheck = el('div', {class:'item dynamics__item'}, [
        el('div', { style: { height: `${Math.round(result)}px`, backgroundColor: '#76CA66'}, class: classHeightPositiv }),
        el('p', {class: 'month dynamics__month'}, item.month),
        el('div', { style: { height: `${Math.round(resultNegative)}px`, backgroundColor: '#FD4E5D'}, class: `${classHeightNegativ} dynamics__column-negativ` }),
      ])
      this.listBalance.append(elCheck);


      
    }
  }
}

// Массив истории переводов месяц - процент + -
function transactionsHistoryChart(arr, mon) {

  // 1. Список сумм переводов месяц - сумма за послендние X месяцев
  const groupedTransactions = groupByMonths(arr, mon);
  // 2. Сумма переводов по месяцам
  const sumMonth = getSumsByMonth(groupedTransactions);
  
  // 4 Переводы
  let topCheck = 0;
  let minCheck = 0;

  if(sumMonth.length) {
    // 4.1 Самый большой отрицатьльный перевод
    sumMonth.sort((a, b) => a.negativeSum - b.negativeSum);
    minCheck = sumMonth[0].negativeSum
  
    // 4.2 Самый большой положительный перевод
    sumMonth.sort((a, b) => b.positiveSum - a.positiveSum);
    topCheck = sumMonth[0].positiveSum
  }

  // 5. Переводы в процентах
  let percentCheckMonth = [];
  for (const item of sumMonth) {

    // const sumCheck = Math.abs(item.negativeSum) + item.positiveSum;
    const percentMinCheck = Math.round(Math.abs(item.negativeSum) * 100 / Math.abs(minCheck));
    const percentMaxCheck = Math.round(item.positiveSum * 100 / topCheck);

    percentCheckMonth.push({
      month: item.month,
      percentMinCheck: percentMinCheck,
      percentMaxCheck: percentMaxCheck,
      topCheck: topCheck,
      minCheck: minCheck,
      monthNumber: item.monthNumber,
    })
  }
  
  return percentCheckMonth;
}

// Массив истории баланса месяц - процент
function balanceHistoryChart(arr, balance, mon) {

  // 1. Список сумм переводов месяц - сумма за послендние 6 месяцев
  const groupedTransactions = groupByMonths(arr, mon);
  
  // 2. Сумма переводов по месяцам
  const sumMonth = getSumsByMonth(groupedTransactions);
  // 3. Баланс по месяцам
  const balanceMonth = balansemonth(sumMonth, balance);
  
  // 4 Баланс
  let topBalans = 0;
  let minBalans = 0;

  if(balanceMonth.length) {
    // 4.1 Самый большой баланс
    balanceMonth.sort((a, b) => b.balance - a.balance);
    topBalans = balanceMonth[0].balance
    // 4.2 Самый маленький баланс
    balanceMonth.sort((a, b) => a.balance - b.balance);
    minBalans = balanceMonth[0].balance
  }

  // 5. Баланс в процентах
  let percentBalanceMonth = [];
  for (const item of balanceMonth) {
    const percent = Math.round(item.balance * 100 / topBalans);
    percentBalanceMonth.push({
      month: item.month,
      percent: percent,
      topBalans: topBalans,
      minBalans: minBalans,
      monthNumber: item.monthNumber,
    })
  }

  return percentBalanceMonth;
}

// Объект с переводами дата - сумма за кол-во месяцев
// function groupByMonths(data, monthsCount) {
//   const result = {};
//   const today = new Date();
//   const startDate = new Date();
//   startDate.setMonth(today.getMonth() - monthsCount + 1); // Отнимаем `monthsCount - 1` месяцев

//   data.forEach(item => {
//       // Преобразуем строку даты в объект Date
//       const [day, month, year] = item.date.split(".");
//       const transactionDate = new Date(`${year}-${month}-${day}`);

//       // Проверяем, входит ли дата в последние `monthsCount` месяцев
//       if (transactionDate >= startDate && transactionDate <= today) {
//           const key = `${year}-${month}`; // Ключ для группировки: "ГГГГ-ММ"

//           // Если ключ отсутствует, создаем массив
//           if (!result[key]) {
//               result[key] = [];
//           }

//           // Добавляем перевод в массив соответствующего месяца
//           result[key].push(item);
//       }
//   });

//   return result;
// };

function groupByMonths(data, monthsCount) {
  const result = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Устанавливаем время на 00:00:00 для точности

  // Начальная дата (monthsCount месяцев назад)
  const startDate = new Date(today);
  startDate.setMonth(today.getMonth() - monthsCount + 1); // Начинаем с "monthsCount" месяцев назад, включая текущий месяц

  // Проходим по всем элементам данных
  data.forEach(item => {
      // Преобразуем строку даты в объект Date
      const [day, month, year] = item.date.split(".");
      const transactionDate = new Date(`${year}-${month}-${day}`);
      transactionDate.setHours(0, 0, 0, 0); // Для точного сравнения убираем время

      // Проверяем, входит ли дата в последние `monthsCount` месяцев
      if (transactionDate >= startDate && transactionDate <= today) {
          const key = `${year}-${month}`; // Ключ для группировки: "ГГГГ-ММ"

          // Если ключ отсутствует, создаем массив
          if (!result[key]) {
              result[key] = [];
          }

          // Добавляем текущую запись в соответствующий месяц
          result[key].push(item);
      }
  });

  return result;
}

// Сумма переводов по месяцам
// function getSumsByMonth(obj) {
//   // Объект для перевода номера месяца в аббревиатуру на русском языке
//   const monthsAbbr = {
//     "01": "янв", "02": "фев", "03": "мар", "04": "апр", "05": "май", "06": "июн",
//     "07": "июл", "08": "авг", "09": "сен", "10": "окт", "11": "ноя", "12": "дек"
//   };

//   // Новый массив объектов с суммами по месяцам и дополнительной информацией
//   return Object.entries(obj).map(([month, transactions]) => {
//     // Инициализируем суммы
//     let totalSum = 0;
//     let positiveSum = 0;
//     let negativeSum = 0;

//     // Подсчитываем суммы
//     transactions.forEach(item => {
//       const summ = parseFloat(item.summ);
//       totalSum += summ;
//       if (summ > 0) {
//         positiveSum += summ;
//       } else {
//         negativeSum += summ;
//       }
//     });

//     // Получаем аббревиатуру месяца на русском
//     const monthAbbr = monthsAbbr[month.split("-")[1]].toLowerCase();

//     // Возвращаем объект с месяцем, общей суммой и суммами положительных и отрицательных переводов
//     return { month: monthAbbr, totalSum, positiveSum, negativeSum };
//   });
// }

function getSumsByMonth(obj) {
  // Объект для перевода номера месяца в аббревиатуру на русском языке
  const monthsAbbr = {
    "01": "янв", "02": "фев", "03": "мар", "04": "апр", "05": "май", "06": "июн",
    "07": "июл", "08": "авг", "09": "сен", "10": "окт", "11": "ноя", "12": "дек"
  };

  // Новый массив объектов с суммами по месяцам и дополнительной информацией
  return Object.entries(obj).map(([month, transactions]) => {
    // Инициализируем суммы
    let totalSum = 0;
    let positiveSum = 0;
    let negativeSum = 0;

    // Подсчитываем суммы
    transactions.forEach(item => {
      const summ = parseFloat(item.summ);
      totalSum += summ;
      if (summ > 0) {
        positiveSum += summ;
      } else {
        negativeSum += summ;
      }
    });

    // Получаем аббревиатуру месяца на русском
    const monthAbbr = monthsAbbr[month.split("-")[1]].toLowerCase();

    // Получаем номер месяца
    const monthNumber = month.split("-")[1];

    // Возвращаем объект с месяцем, общей суммой, суммами положительных и отрицательных переводов, и номером месяца
    return { month: monthAbbr, monthNumber, totalSum, positiveSum, negativeSum };
  });
}

// Баланс по месяцам
function balansemonth(arr, bal) {

  let arrBalansemonth = [];

  for (let i = 0; i < arr.length; i++) {
    
    if (i === 0) {
      arrBalansemonth.push({
        month: arr[i].month,
        balance: bal,
      })
    } else {    
      const newBalance = arrBalansemonth[i-1].balance - arr[i].totalSum;
  
      arrBalansemonth.push({
        month: arr[i].month,
        balance: newBalance,
      }) 
    }

  }

  return arrBalansemonth;
}