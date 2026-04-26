/*
 * @Author: Chenn
 * @Date: 2026-04-25 09:35:39
 * @LastEditors: Chenn
 * @LastEditTime: 2026-04-25 11:24:54
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { decrement, increment, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
