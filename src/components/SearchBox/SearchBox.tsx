import css from './SearchBox.module.css';

interface SearchBoxProps {
  // Типізуємо пропс onChange як функцію, що приймає подію зміни інпуту
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

export default function SearchBox({ onChange, value }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={value}
      onChange={onChange}
    />
  );
}