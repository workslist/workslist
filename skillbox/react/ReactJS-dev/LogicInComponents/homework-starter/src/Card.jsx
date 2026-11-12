import './Card.css';
import { useState, useEffect, useRef } from "react";
import { inputFocus } from "./useList"


export const Card = ({
  id,
  title,
  onTitleChange,
  done,
  onToggle,
  onDelete,
}) => {

  const handleTitleChange = (event) => {
    onTitleChange(id, event.target.value);
  };

  const handleCheckboxChange = () => {
    onToggle(id);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onToggle(id);
  };

  const handleTitleBlur = () => {
    if (title === '') {
      onDelete(id);
    }
  };

  const ref = inputFocus();

  // ---------------------------------------------------

  // const [item, setItem] = useState(newList)
    
  // const handleDeketeItem = (id) => {

  //   setItem((prevState) => {
  //     prevState.filter((product) => product.id !== id)
  //   })

  // }
  

// ---------------------------------------------

  return (
    <form className="card" onSubmit={handleSubmit}>
      <input
        className="card__done"
        type="checkbox"
        checked={done}
        onChange={handleCheckboxChange}
        tabIndex={-1}
      />

      <input
        className="card__title"
        type="text"
        defaultValue={title}
        onChange={handleTitleChange}
        onBlur={handleTitleBlur}
        ref={ref}
      />
    </form>
  );
};