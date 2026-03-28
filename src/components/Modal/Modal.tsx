import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

const modalRoot = document.querySelector('#modal-root') as HTMLElement;

export default function Modal({ children, onClose }: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.code === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return createPortal(
    <div className={css.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true">
      <div className={css.modal}>
        {children}
      </div>
    </div>,
    modalRoot
  );
}