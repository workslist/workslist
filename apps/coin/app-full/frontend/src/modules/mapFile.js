/**
 * @typedef {{ coords: number[] | Coordinates, hint?: string }} PlacemarkObjData
 * @param {HTMLElement} container
 * @param {number[] | Coordinates} centerCoords - [широта, долгота] | Coordinates
 * @param {{ zoom: number, minZoom?: number, maxZoom?: number }} zoom
 * @param {PlacemarkObjData[]} placemarksObjData
 * @throws {Error & { name: 'ScriptExternalLoadError' }}
 */
export const createMap = async (container, centerCoords, zoom, placemarksObjData) => {
  await loadYandexMaps(); // Динамическая загрузка скрипта Яндекс.Карт

  return new Promise((resolve) => {
    ymaps.ready(() => {
      // Создание карты
      const map = new ymaps.Map(container, {
        center: translateCoords(centerCoords),
        zoom: zoom.zoom,
      });

      // Добавление меток на карту
      placemarksObjData.forEach((placemarkData) => {
        const placemark = new ymaps.Placemark(placemarkData.coords, {
          hintContent: placemarkData.hint || '',
        });

        map.geoObjects.add(placemark);
      });

      resolve(map); // Возвращаем созданную карту
    });
  });
};

/**
 * Динамическая загрузка скрипта Яндекс.Карт
 * @returns {Promise<void>}
 */
function loadYandexMaps() {
  return new Promise((resolve, reject) => {
    if (window.ymaps) {
      resolve(); // Скрипт уже загружен
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=ed10a128-5ad0-45ba-8105-1fb907906d23&lang=ru_RU';
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('Failed to load Yandex.Maps script'));

    document.head.appendChild(script);
  });
}

/**
 * Пример вспомогательной функции для преобразования координат (если необходимо)
 * @param {number[] | Coordinates} coords
 * @returns {number[]}
 */
function translateCoords(coords) {
  if (Array.isArray(coords)) {
    return coords; // Если это массив, возвращаем как есть
  }
  // Если это объект, преобразуем в массив
  return [coords.latitude, coords.longitude];
}