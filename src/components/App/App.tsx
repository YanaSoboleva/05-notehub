import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { fetchMovies, type TMDBResponse} from '../../services/movieService';
import type { Movie } from '../../types/movie';

import ReactPaginate from 'react-paginate';
import css from './App.module.css';
import { useQuery, keepPreviousData} from '@tanstack/react-query';

const App = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isFetching } = useQuery<TMDBResponse>({
    queryKey: ['movies', searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: !!searchQuery,
    placeholderData: keepPreviousData,
    // placeholderData: (previousData) => previousData,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;


  useEffect(() => {
    if (!isFetching && !isLoading && !isError && searchQuery && movies.length === 0) {
      toast("No movies found for your request.", {
        icon: '🔍',
        position: "top-center",
      });
    }
  }, [movies.length, isFetching, isLoading, isError, searchQuery]);

  const handleSearch = (query: string) => {
    if (query.trim() === '') {
      toast.error("Please enter a search term", { position: "top-center" });
      return;
    }
    setSearchQuery(query);
    setPage(1);
  };

  return (
    <div>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />

      <main style={{ padding: '20px' }}>
        
        {isLoading && <Loader />}       
        {isError && <ErrorMessage />}
        {movies.length > 0 && (

<>
          <MovieGrid movies={movies} onSelect={setSelectedMovie} />
          <ReactPaginate
            pageCount={totalPages}
            forcePage={page - 1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"/>
        </>
      )}
      </main>

      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </div>
  );
};

export default App;
