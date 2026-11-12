import { spinner } from '../modules/spinner';

// 1) Вход - получить токен
const eventTarget = new EventTarget();
let authResult = null;
// 1.1 Получить результат фетч
export async function autorization(login, password) {
  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      body: JSON.stringify({
        login,
        password,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(
        `Ошибка авторизации: ${response.status} ${response.statusText}`
      );
    }

    authResult = await response.json();
    // console.log('Авторизация завершена:', authResult);

    // Отправляем событие об успешной авторизации
    const successEvent = new CustomEvent('authReady', { detail: authResult });
    eventTarget.dispatchEvent(successEvent);
  } catch (error) {
    console.error('Ошибка авторизации:', error.message);
    // Отправляем событие об ошибке
    const errorEvent = new CustomEvent('authError', { detail: error });
    eventTarget.dispatchEvent(errorEvent);
  }
}

export { eventTarget }; // При импорте в других модулях

// 2  Создать новый счет
export async function createAccount(token) {

  const main = document.getElementById('main');
  const spin = spinner(); // Включаем спиннер перед выполнением запроса
  main.append(spin); // Добавляем спиннер в элемент main

  return await fetch('http://localhost:3000/create-account', {
    method: 'POST',
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

// Отправить перевод со счета на счет

export async function transferFunds(from, to, amount, token) {
  const main = document.getElementById('main');
  const spin = spinner(); // Включаем спиннер перед выполнением запроса
  main.append(spin); // Добавляем спиннер в элемент main

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
  })
    .then((res) => res.json())
    .finally(() => {
      spin.remove(); // Убираем спиннер после завершения запроса
    });
}

// Список используемых валют
export async function getKnownCurrwncies() {
  return await fetch('http://localhost:3000/all-currencies').then((data) =>
    data.json()
  );
}