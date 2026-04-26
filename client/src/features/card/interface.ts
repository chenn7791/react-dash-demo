/*
 * @Author: Chenn
 * @Date: 2026-04-25 11:30:25
 * @LastEditors: Chenn
 * @LastEditTime: 2026-04-25 11:50:02
 */
// 看板类型
export type CardType = 'todo' | 'doing' | 'done';

export interface ICard {
  id: string;
  message: string;
  key: React.Key;
}
