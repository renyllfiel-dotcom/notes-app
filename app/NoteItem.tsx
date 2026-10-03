type Note = {
  id: number;
  title: string;
  description: string;
};

type NoteItemProps = {
  note: Note;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
};

export default function NoteItem({
  note,
  onDelete,
  onEdit,
}: NoteItemProps) {
  return (
    <div className="note-card">
      <h3>{note.title}</h3>

      <p>{note.description}</p>

      <div className="note-buttons">
        <button
          className="edit-button"
          onClick={() => onEdit(note.id)}
        >
          Edit
        </button>

        <button
          className="delete-button"
          onClick={() => onDelete(note.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}