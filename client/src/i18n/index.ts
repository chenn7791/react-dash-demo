/*
 * @Author: Chenn
 * @Date: 2026-04-25 11:51:56
 * @LastEditors: Chenn
 * @LastEditTime: 2026-04-25 17:42:36
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  'zh-CN': {
    translation: {
      app: {
        badge: 'React 18 + TypeScript + Redux Toolkit + MUI',
        title: '客户端计数器',
        countLabel: '当前计数',
        language: '语言',
      },
      language: {
        zh: '中文',
        en: 'English',
      },
      board: {
        title: '看板',
        todoList: '待办列表',
        doingList: '进行中列表',
        doneList: '已完成列表',
        add: '添加',
        addPlaceholder: '输入卡片内容',
        confirmAdd: '确认',
        cancelAdd: '取消',
        empty: '暂无内容',
        drag: '拖拽卡片',
        advance: '推进到下一列',
        edit: '编辑',
        delete: '删除',
      },
    },
  },
  en: {
    translation: {
      app: {
        badge: 'React 18 + TypeScript + Redux Toolkit + MUI',
        title: 'Client Counter',
        countLabel: 'Current count',
        language: 'Language',
      },
      language: {
        zh: '中文',
        en: 'English',
      },
      board: {
        title: 'Board',
        todoList: 'Todo',
        doingList: 'Doing',
        doneList: 'Done',
        add: 'Add',
        addPlaceholder: 'Enter card content',
        confirmAdd: 'Confirm',
        cancelAdd: 'Cancel',
        empty: 'No cards yet',
        drag: 'Drag card',
        advance: 'Move to next column',
        edit: 'Edit',
        delete: 'Delete',
      },
    },
  },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: 'zh-CN',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
