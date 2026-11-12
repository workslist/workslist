// Подробная история баланса
import { el, setChildren } from 'redom';
import { routerCheckID } from '../modules/router';
import { HistoryChart, HistoryChartvNegative } from '../modules/balanceHistoryChart.js';
import { TableHistory } from '../modules/tableHistoryTrans.js';
// import '../css/balanceHistoryChart.scss';

export function detailHistoryBalance(arr) {

  const boxDetail = el('div', { class: 'detail boxDetail__detail' }); // Общий бокс
  const boxPanel = el('div', { class: 'detailCheck boxDetail__detailCheck' }); // Панель верх бокс
  const boxcentr = el('div', { class: 'detailBoxCentr boxDetail__detailBoxCentr' }); // Центральный бокс
  const boxHistory = el('div'); // История переводов бокс
  const btnBack = el('button', { class: 'btn boxDetail__btn' }, 'Вернуться назад');

  const user = arr.payload;

  // Верх панель
  const detailCheck = el('div', [
    el('h2', { class: 'title boxDetail__title' }, 'История баланса'),
    el('p', { class: 'check boxDetail__check' }, `№ ${user.account}`),
  ]);
  const detailBtn = el('div', [
    btnBack,
    el('p', { class: 'descr boxDetail__descr' }, [
      el('span', { class: 'text boxDetail__text' }, 'Баланс'),
      el('span', { class: 'value boxDetail__value' }, `${user.balance} ₽`)
    ]),
  ]);

  // История низ
  let newTableHistory = new TableHistory(user.transactions, user.account, 25);

  // История баланса график
  // Массив переводов дата - сумма
  let arrListChart = [];
  arrListChart.length = 0;
  arrListChart = newTableHistory.arrListChart;

  // Рендер графика переводов
  const usBalance = user.balance;
  let newHistoryChart = new HistoryChart(arrListChart, usBalance, 12);
  const boxHistoryChart = newHistoryChart.box;
  newHistoryChart.box.classList.add('dynamics-history');
  newHistoryChart.listBalance.classList.add('dynamics__list-history');

  // Рендер графика переводов c минусом
  let newHistoryChartvNegative = new HistoryChartvNegative(arrListChart, 12);
  const boxHistoryChartNegative = newHistoryChartvNegative.box;
  newHistoryChartvNegative.box.classList.add('dynamics-history');
  newHistoryChartvNegative.listBalance.classList.add('dynamics__list-history');

  // Клики
  btnBack.addEventListener('click', async function () {
    routerCheckID(user.account);
  });
  boxcentr.append(boxHistoryChart, boxHistoryChartNegative);
  boxPanel.append(detailCheck, detailBtn);
  boxHistory.append(newTableHistory.boxTable);
  boxDetail.append(boxPanel, boxcentr, boxHistory);
  // boxDetail.append(boxPanel, boxcentr, boxHistory, newDetailHistoryChart);

  return boxDetail;
}