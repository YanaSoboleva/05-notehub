import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const modalRoot = document.querySelector('#modal-root');

export default function Modal({ children, onClose }: ModalProps) {
  // Додаємо логіку блокування прокручування
  useEffect(() => {
    // Зберігаємо оригінальний стиль, щоб повернути його назад
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Блокуємо прокручування при монтуванні
    document.body.style.overflow = 'hidden';

    // Функція очищення (спрацює при закритті модалки)
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  if (!modalRoot) return null;

  return createPortal(
    <div className={css.backdrop} onClick={onClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    modalRoot
  );
}