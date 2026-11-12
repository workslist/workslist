import { useState, useEffect, useRef } from "react"


const list = [
  {
    id: '1',
    title: 'Кукурузка'
  },
]

export function useList() {

  /** Создать новый элемент. */

  const [ item, setItem ] = useState(list);

  const createItem = () => {
    setItem(
      list.push({ 
          id: Date.now(), 
          title: '',
      })
  )

  console.log('Добавили новый объект');
  console.log(list);
  };

  /**
   * Установить заголовок элемента.
   *
   * @param id - ID элемента.
   * @param title - Заголовок элемента.
   */
  const setItemTitle = (id, title) => {

  };

  /**
   * Переключить выполненность элемента.
   *
   * @param id - ID элемента.
   */
  const toggleItem = (id) => {};

  /**
   * Удалить элемент.
   *
   * @param id - ID элемента.
   */

  // const [item, setItem] = useState(list)

  const deleteItem = (id) => {
    console.log('должно произойти удаление');

    setItem(list.filter((product) => product.id !== id))

  //   setItem(item.filter(obj => {
  //     if (obj.id != id) {
  //        return obj;
  //     }
  //  }));



    console.log(list);
    console.log('не удалилось');

  };

  return {
    list,
    createItem,
    setItemTitle,
    toggleItem,
    deleteItem,
  };
}
  // Устанавливаем фокус в новый элемент (не получается перенести)

  export function inputFocus() {

  const inputRef = useRef();

  useEffect(() => {
      if (inputRef.current.value === "") {
          inputRef.current.focus(); 
      };
  }, []);

  return inputRef;

}