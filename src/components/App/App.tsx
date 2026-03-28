import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes, deleteNote } from '../../services/noteService';
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
  const queryClient = useQueryClient();

  // Запрос данных с учетом текущей страницы и поиска
  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes({ page, perPage: 12, search }),
  });

  // Мутация для удаления
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

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

      <main>
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
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}