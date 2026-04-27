import type { CardState } from '../features/card/cardSlice';
import type { CardType, ICard } from '../features/card/interface';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

interface ApiCard {
  id: string;
  type: CardType;
  message: string;
  position: number;
}

interface ApiResponse<T> {
  data: T;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function toCard(apiCard: ApiCard): ICard {
  return {
    id: apiCard.id,
    key: apiCard.id,
    message: apiCard.message,
  };
}

export function toCardState(apiCards: ApiCard[]): CardState {
  return apiCards.reduce<CardState>(
    (state, apiCard) => {
      state[apiCard.type].push(toCard(apiCard));
      return state;
    },
    { todo: [], doing: [], done: [] },
  );
}

export function flattenCardState(state: CardState) {
  return (['todo', 'doing', 'done'] as CardType[]).flatMap((type) =>
    state[type].map((card, position) => ({
      id: card.id,
      type,
      position,
    })),
  );
}

export async function fetchCards() {
  const response = await request<ApiResponse<ApiCard[]>>('/api/cards');
  return toCardState(response.data);
}

export async function createCard(type: CardType, message: string) {
  const response = await request<ApiResponse<ApiCard>>('/api/cards', {
    method: 'POST',
    body: JSON.stringify({ message, type }),
  });

  return toCard(response.data);
}

export async function updateCard(id: string, message: string) {
  const response = await request<ApiResponse<ApiCard>>(`/api/cards/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ message }),
  });

  return toCard(response.data);
}

export async function deleteCard(id: string) {
  await request<void>(`/api/cards/${id}`, {
    method: 'DELETE',
  });
}

export async function reorderCards(state: CardState) {
  const response = await request<ApiResponse<ApiCard[]>>('/api/cards/reorder', {
    method: 'PUT',
    body: JSON.stringify({ cards: flattenCardState(state) }),
  });

  return toCardState(response.data);
}
