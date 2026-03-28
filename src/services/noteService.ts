import axios from 'axios';
import type { Note } from '../types/note';

const API_URL = 'https://notehub-public.goit.study/api';
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const noteApi = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

// 1. Виправлений інтерфейс відповіді (тільки те, що реально приходить з API)
interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// 2. Тип для створення нотатки (суворо 3 поля)
export type CreateNoteData = {
  title: string;
  content: string;
  tag: string;
};

interface FetchParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = '',
}: FetchParams): Promise<FetchNotesResponse> => {
  const response = await noteApi.get<FetchNotesResponse>('/notes', {
    params: { page, perPage, search },
  });
  return response.data;
};

// 3. Функція createNote тепер приймає лише необхідні дані
export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
  const response = await noteApi.post<Note>('/notes', noteData);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  // Ми вказуємо <Note>, щоб axios знав тип даних у response.data
  const response = await noteApi.delete<Note>(`/notes/${id}`);
  
  // Повертаємо дані видаленої нотатки
  return response.data;
};