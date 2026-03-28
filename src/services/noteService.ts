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

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalNotes: number;
  totalPages: number;
  currentPage: number;
}

export const fetchNotes = async (params: FetchNotesParams): Promise<FetchNotesResponse> => {
  const { data } = await noteApi.get<FetchNotesResponse>('/notes', { params });
  return data;
};

export const createNote = async (note: Omit<Note, 'id' | 'createdAt'>): Promise<Note> => {
  const { data } = await noteApi.post<Note>('/notes', note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await noteApi.delete<Note>(`/notes/${id}`);
  return data;
};