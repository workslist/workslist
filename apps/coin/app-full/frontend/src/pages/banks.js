import { el, setChildren } from 'redom';
import { createMap } from '../modules/mapFile';
import { spinner } from '../modules/spinner';
import '../css/banks.scss';

export function bancsMap(arr) {
  const arrBanks = arr.payload; // Массив с банкоматами
  console.log(arrBanks);

  // Создание контейнера для карты
  const boxMap = el('div', { id: 'map', style: { width: '1340px', height: '728px' }, class: 'banks' }, [
    el('h2', { class: 'title banks__title' }, 'Карта банкоматов'),
  ]);

  // Создание и добавление спиннера
  const main = document.getElementById('main');
  const spin = spinner();
  boxMap.append(spin);

  const centerCoords = [55.76, 37.64]; // Центр карты (например, Москва)
  const zoom = { zoom: 10 };

  createMap(boxMap, centerCoords, zoom, [])
    .then((map) => {
      console.log('Карта успешно создана:', map);

      // Добавление точек банкоматов из массива
      arrBanks.forEach((bank) => {
        if (bank.lat && bank.lon) {
          const placemark = new ymaps.Placemark(
            [bank.lat, bank.lon], // Координаты банкомата
            {
              hintContent: `Банкомат (${bank.lat}, ${bank.lon})`, // Подсказка
              balloonContent: `Координаты: ${bank.lat}, ${bank.lon}`, // Балун
            },
            {
              preset: 'islands#icon', // Стиль метки
              iconColor: '#0095b6', // Цвет метки
            }
          );

          map.geoObjects.add(placemark); // Добавляем метку на карту
        }
      });
    })
    .catch((error) => {
      console.error('Ошибка создания карты:', error);
    })
    .finally(() => {
      spin.remove(); // Убираем спиннер после загрузки карты
    });

  return boxMap; // Возвращаем элемент карты
}

// export function bancsMap(arr) {
//   const arrBanks = arr.payload; // Массив с банкоматами
//   console.log(arrBanks);

//   // Создание контейнера для карты
//   const boxMap = el('div', { id: 'map', style: { width: '1340px', height: '728px' }, class:'banks' }, [
//     el('h2', {class:'title banks__title'}, 'Карта банкоматов'),
//   ]);

//   const centerCoords = [55.76, 37.64]; // Центр карты (например, Москва)
//   const zoom = { zoom: 10 };

//   createMap(boxMap, centerCoords, zoom, [])
//     .then((map) => {
//       console.log('Карта успешно создана:', map);

//       // Добавление точек банкоматов из массива
//       arrBanks.forEach((bank) => {
//         if (bank.lat && bank.lon) {
//           const placemark = new ymaps.Placemark(
//             [bank.lat, bank.lon], // Координаты банкомата
//             {
//               hintContent: `Банкомат (${bank.lat}, ${bank.lon})`, // Подсказка
//               balloonContent: `Координаты: ${bank.lat}, ${bank.lon}`, // Балун
//             },
//             {
//               preset: 'islands#icon', // Стиль метки
//               iconColor: '#0095b6', // Цвет метки
//             }
//           );

//           map.geoObjects.add(placemark); // Добавляем метку на карту
//         }
//       });
//     })
//     .catch((error) => {
//       console.error('Ошибка создания карты:', error);
//     });   

//   return boxMap; // Возвращаем элемент карты
// }