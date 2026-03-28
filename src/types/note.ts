export type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string; // Дата створення (ISO рядок)
  updatedAt: string; // ДОДАНО: Дата останнього оновлення (ISO рядок)
}