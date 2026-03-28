import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import Pagination from '../Pagination/Pagination';
import css from './App.module.css';


export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const queryClient = useQueryClient();

  // Запрос данных с учетом текущей страницы и поиска
  const { data, isLoading, isError, isPlaceholderData} = useQuery({
  queryKey: ['notes', page, search],
  queryFn: () => fetchNotes({ page, perPage: 12, search }),
  // Цей рядок забезпечує плавну зміну сторінок:
  placeholderData: keepPreviousData, 
});

  // // Мутация для удаления
  // const deleteMutation = useMutation({
  //   mutationFn: deleteNote,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['notes'] });
  //   },
  // });

  // Функция поиска с задержкой (Debounce)
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1); // При поиске всегда возвращаемся на 1-ю страницу
  }, 500);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={(e) => debouncedSearch(e.target.value)} />
        
        {data && data.totalPages > 1 && (
          <Pagination 
            pageCount={data.totalPages} 
            onPageChange={(p) => setPage(p + 1)}
            forcePage={page - 1} 
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {/* <main>
        {isLoading && <p className={css.status}>Loading notes...</p>}
        {isError && <p className={css.status}>Error fetching notes.</p>}
        
        {data && data.notes.length > 0 ? (
          <NoteList 
            notes={data.notes} 
            onDelete={(id: string) => deleteMutation.mutate(id)} 
          />
        ) : (
          !isLoading && <p className={css.status}>No notes found.</p>
        )}
      </main> */}
      <main style={{ opacity: isPlaceholderData ? 0.6 : 1, transition: 'opacity 200ms' }}>
      {/* Використовуємо isLoading тільки для першого завантаження */}
      {isLoading && !data && <p className={css.status}>Loading notes...</p>}
      
      {/* ТЕПЕР isError ВИКОРИСТОВУЄТЬСЯ — ESLint буде задоволений */}
      {isError && <p className={css.status}>Something went wrong. Please try again.</p>}
      
      {data && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        !isLoading && !isError && <p className={css.status}>No notes found.</p>
      )}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}