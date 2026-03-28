import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Movie } from '../../types/movie';
import css from './MovieModal.module.css';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => e.code === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className={css.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true">
      <div className={css.modal}>
        <button className={css.closeButton} onClick={onClose} aria-label="Close modal">&times;</button>
        <img src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} alt={movie.title} className={css.image} />
        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> {movie.vote_average.toFixed(1)}/10</p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MovieModal;