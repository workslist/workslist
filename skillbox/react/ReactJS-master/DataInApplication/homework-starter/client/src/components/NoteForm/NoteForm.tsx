import { FormField } from "../FormField";
import { Button } from "../Button";
import "./NoteForm.css";

export const NoteForm = () => {
  return (
    <form className="note-form">
      <FormField label="Заголовок">
        <input type="text" />
      </FormField>
      <FormField label="Текст">
        <textarea />
      </FormField>
      <Button>Сохранить</Button>
    </form>
  );
};
