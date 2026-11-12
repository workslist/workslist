import { useState, useEffect, useRef } from "react"

export function useList() {

  /** Создать новый элемент. */

  const [list, setList] = useState([]);

  const createItem = () => {
    
    setList([...list, {id: crypto.randomUUID(), title: "", done: false,}])
    
  };

  /**
   * Установить заголовок элемента.
   *
   * @param id - ID элемента.
   * @param title - Заголовок элемента.
   */
  const setItemTitle = (id, title) => {

    setList(list.map(obj => {
      if (obj.id === id) {
        return {...obj, title: title}
      } else {
        return obj
      }
    }))

  };

  /**
   * Переключить выполненность элемента.
   *
   * @param id - ID элемента.
   */
  const toggleItem = (id) => {

    setList(list.map(obj => {
      if (obj.id === id) {
        return {...obj, done: !obj.done}
      } else {
        return obj
      }
    }))

  };

  /**
   * Удалить элемент.
   *
   * @param id - ID элемента.
   */

  // const [item, setItem] = useState(list)

  const deleteItem = (id) => {
    
    setList(list.filter(obj => obj.id != id))

  };


  return {
    list,
    createItem,
    setItemTitle,
    toggleItem,
    deleteItem,
  };
}
  // Устанавливаем фокус в новый элемент
  export function inputFocus() {

  const inputRef = useRef();

  useEffect(() => {
      if (inputRef.current.value === "") {
          inputRef.current.focus(); 
      };
  }, []);

  return inputRef;

}