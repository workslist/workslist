import "./NotesListView.css";
import { NoteView } from "../NoteView";

export const NotesListView = () => {
  return (
    <ul className="note-list-view">
      <li>
        <NoteView />
      </li>
      <li>
        <NoteView />
      </li>
      <li>
        <NoteView />
      </li>
      <li>
        <NoteView />
      </li>
      <li>
        <NoteView />
      </li>
      <li>
        <NoteView />
      </li>
    </ul>
  );
};
