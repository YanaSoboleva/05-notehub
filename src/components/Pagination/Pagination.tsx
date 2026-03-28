import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  pageCount: number;
  onPageChange: (selectedPage: number) => void;
  forcePage?: number; // Дозволяє синхронізувати стан ззовні
}

export default function Pagination({ pageCount, onPageChange, forcePage }: PaginationProps) {
  return (
    <ReactPaginate
      // Текст для кнопок навігації
      previousLabel={'<'}
      nextLabel={'>'}
      breakLabel={'...'}
      
      // Кількість сторінок з бекенду
      pageCount={pageCount}
      
      // Скільки сторінок показувати навколо поточної
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      
      // Обробник кліку
      onPageChange={(data) => onPageChange(data.selected)}
      
      // Поточна сторінка (нуль-базова)
      forcePage={forcePage}

      // CSS класи зі стилів GoIT
      containerClassName={css.pagination}
      pageClassName={css.pageItem}
      pageLinkClassName={css.pageLink}
      previousClassName={css.pageItem}
      previousLinkClassName={css.pageLink}
      nextClassName={css.pageItem}
      nextLinkClassName={css.pageLink}
      breakClassName={css.pageItem}
      breakLinkClassName={css.pageLink}
      activeClassName={css.active}
      disabledClassName={css.disabled}
    />
  );
}