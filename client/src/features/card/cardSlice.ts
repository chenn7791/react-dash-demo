/*
 * @Author: Chenn
 * @Date: 2026-04-25 11:29:20
 * @LastEditors: Chenn
 * @LastEditTime: 2026-04-25 11:49:51
 */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createCard,
  deleteCard,
  fetchCards,
  reorderCards,
  updateCard,
} from '../../api/cards';
import { CardType, ICard } from './interface';

export interface CardState {
  todo: ICard[];
  doing: ICard[];
  done: ICard[];
}

export interface CardSliceState extends CardState {
  error: string | null;
  loading: boolean;
}

const emptyCards: CardState = {
  todo: [],
  doing: [],
  done: [],
};

const initialState: CardSliceState = {
  ...emptyCards,
  error: null,
  loading: false,
};

function selectCards(state: CardSliceState): CardState {
  return {
    todo: state.todo,
    doing: state.doing,
    done: state.done,
  };
}

function applyMove(
  state: CardState,
  payload: {
    from: CardType;
    to: CardType;
    cardId: ICard['id'];
    targetCardId?: ICard['id'];
  },
): CardState {
  const nextState: CardState = {
    todo: [...state.todo],
    doing: [...state.doing],
    done: [...state.done],
  };
  const { cardId, from, targetCardId, to } = payload;
  const fromList = nextState[from];
  const sourceIndex = fromList.findIndex((card) => card.id === cardId);

  if (sourceIndex === -1 || cardId === targetCardId) {
    return nextState;
  }

  const [card] = fromList.splice(sourceIndex, 1);
  const toList = nextState[to];
  const targetIndex = targetCardId
    ? toList.findIndex((targetCard) => targetCard.id === targetCardId)
    : -1;

  if (targetIndex === -1) {
    toList.push(card);
  } else {
    toList.splice(targetIndex, 0, card);
  }

  return nextState;
}

function replaceCards(state: CardSliceState, cards: CardState) {
  state.todo = cards.todo;
  state.doing = cards.doing;
  state.done = cards.done;
}

export const fetchCardsAsync = createAsyncThunk('card/fetchCards', fetchCards);

export const addCardAsync = createAsyncThunk(
  'card/addCard',
  async ({ cardType, message }: { cardType: CardType; message: string }) => {
    const card = await createCard(cardType, message);
    return { card, cardType };
  },
);

export const updateCardAsync = createAsyncThunk(
  'card/updateCard',
  async ({ cardId, message }: { cardId: ICard['id']; message: string }) =>
    updateCard(cardId, message),
);

export const deleteCardAsync = createAsyncThunk(
  'card/deleteCard',
  async (cardId: ICard['id']) => {
    await deleteCard(cardId);
    return cardId;
  },
);

export const moveCardAsync = createAsyncThunk(
  'card/moveCard',
  async (
    payload: {
      from: CardType;
      to: CardType;
      cardId: ICard['id'];
      targetCardId?: ICard['id'];
    },
    { getState },
  ) => {
    const rootState = getState() as { card: CardSliceState };
    const nextState = applyMove(selectCards(rootState.card), payload);
    return reorderCards(nextState);
  },
);

const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    moveCard: (
      state,
      action: PayloadAction<{
        from: CardType;
        to: CardType;
        cardId: ICard['id'];
        targetCardId?: ICard['id'];
      }>,
    ) => {
      replaceCards(state, applyMove(selectCards(state), action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCardsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCardsAsync.fulfilled, (state, action) => {
        replaceCards(state, action.payload);
        state.loading = false;
      })
      .addCase(fetchCardsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch cards';
      })
      .addCase(addCardAsync.fulfilled, (state, action) => {
        state[action.payload.cardType].push(action.payload.card);
      })
      .addCase(updateCardAsync.fulfilled, (state, action) => {
        for (const type of ['todo', 'doing', 'done'] as CardType[]) {
          const card = state[type].find((item) => item.id === action.payload.id);

          if (card) {
            card.message = action.payload.message;
            break;
          }
        }
      })
      .addCase(deleteCardAsync.fulfilled, (state, action) => {
        for (const type of ['todo', 'doing', 'done'] as CardType[]) {
          state[type] = state[type].filter((card) => card.id !== action.payload);
        }
      })
      .addCase(moveCardAsync.fulfilled, (state, action) => {
        replaceCards(state, action.payload);
      });
  },
});

export const { moveCard } = cardSlice.actions;
export default cardSlice.reducer;
