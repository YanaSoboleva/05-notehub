import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  // 1. Створюємо мутацію прямо всередині компонента
  const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: (deletedNote) => {
    console.log(`Видалено нотатку: ${deletedNote.title}`);
    queryClient.invalidateQueries({ queryKey: ['notes'] });
  },
    onError: (error) => {
      console.error("Помилка при видаленні нотатки:", error);
      alert("Не вдалося видалити нотатку. Спробуйте ще раз.");
    }
  });

  if (notes.length === 0) return null;

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li key={id} className={css.listItem}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{tag}</span>
            <button 
              className={css.deleteBtn} 
              // 3. Викликаємо мутацію прямо тут
              onClick={() => mutation.mutate(id)}
              disabled={mutation.isPending}
              type="button"
            >
              {mutation.isPending ? '...' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}