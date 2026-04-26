/*
 * @Author: Chenn
 * @Date: 2026-04-25 11:29:20
 * @LastEditors: Chenn
 * @LastEditTime: 2026-04-25 11:49:51
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CardType, ICard } from './interface';

export interface CardState {
  todo: ICard[];
  doing: ICard[];
  done: ICard[];
}
const initialState: CardState = {
  todo: [
    { key: '1', message: '1', id: '1' },
    { key: '2', message: '2', id: '2' },
  ],
  doing: [],
  done: [],
};

const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    addCard: (state, action: PayloadAction<{ cardType: CardType; card: ICard }>) => {
      const payload = action.payload;
      state[payload.cardType].push(payload.card);
    },
    moveCard: (
      state,
      action: PayloadAction<{
        from: CardType;
        to: CardType;
        cardId: ICard['id'];
        targetCardId?: ICard['id'];
      }>,
    ) => {
      const { cardId, from, targetCardId, to } = action.payload;

      const fromList = state[from];
      const sourceIndex = fromList.findIndex((card) => card.id === cardId);

      if (sourceIndex === -1 || cardId === targetCardId) {
        return;
      }

      const [card] = fromList.splice(sourceIndex, 1);
      const toList = state[to];
      const targetIndex = targetCardId
        ? toList.findIndex((targetCard) => targetCard.id === targetCardId)
        : -1;

      if (targetIndex === -1) {
        toList.push(card);
        return;
      }

      toList.splice(targetIndex, 0, card);
    },
  },
});

export const { addCard, moveCard } = cardSlice.actions;
export default cardSlice.reducer;
