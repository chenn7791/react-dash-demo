<!--
 * @Author: Chenn
 * @Date: 2026-04-30 09:38:34
 * @LastEditors: Chenn
 * @LastEditTime: 2026-04-30 09:38:36
-->

# React Dash Demo

一个前后端分离的轻量看板 Demo。前端使用 React 18、TypeScript、Vite、Redux Toolkit 和 MUI 构建三列表任务看板，后端使用 Express 提供 REST API，并通过 SQLite 持久化卡片数据。

## 功能特性

- 三列看板：待办、进行中、已完成
- 新增、编辑、删除卡片
- 拖拽卡片调整列和顺序
- 一键推进卡片到下一列
- 中英文语言切换
- SQLite 本地持久化存储
- 前端状态通过 Redux Toolkit 管理，并与后端 API 同步

## 技术栈

### Client

- React 18
- TypeScript
- Vite
- Redux Toolkit / React Redux
- MUI
- i18next / react-i18next
- ESLint / Prettier / Husky / lint-staged

### Server

- Node.js
- Express
- SQLite
- CORS
- Nodemon

## 项目结构

```text
.
├── client
│   ├── src
│   │   ├── api              # 前端 API 请求封装
│   │   ├── features         # Redux slice
│   │   ├── i18n             # 国际化配置
│   │   ├── App.tsx          # 应用入口组件
│   │   ├── Cards.tsx        # 看板列组件
│   │   └── CardItem.tsx     # 卡片项组件
│   └── package.json
├── server
│   ├── src
│   │   ├── lib              # SQLite 初始化与查询封装
│   │   ├── routes           # API 路由
│   │   └── index.js         # 服务入口
│   └── package.json
└── README.md
```

## 环境要求

- Node.js `24.4.x`
- Yarn `1.22.x`

## 本地启动

### 1. 安装依赖

```bash
cd server
yarn install

cd ../client
yarn install
```

### 2. 启动后端

```bash
cd server
yarn dev
```

默认服务地址：

```text
http://localhost:3001
```

后端启动后会自动初始化 SQLite 数据库，数据库文件位于：

```text
server/data/app.sqlite
```

### 3. 启动前端

另开一个终端：

```bash
cd client
yarn dev
```

默认前端地址：

```text
http://127.0.0.1:5173
```

## 环境变量

前端默认请求后端地址为 `http://localhost:3001`。如果需要自定义 API 地址，可以在 `client` 目录下创建 `.env`：

```bash
VITE_API_BASE_URL=http://localhost:3001
```

## 常用命令

### Client

```bash
yarn dev           # 启动 Vite 开发服务
yarn build         # TypeScript 检查并构建生产包
yarn preview       # 本地预览生产构建
yarn lint          # 运行 ESLint
yarn lint:fix      # 自动修复 ESLint 问题
yarn format        # 使用 Prettier 格式化
yarn format:check  # 检查格式
```

### Server

```bash
yarn dev    # 使用 nodemon 启动开发服务
yarn start  # 使用 node 启动服务
```

## API 接口

后端基础地址：`http://localhost:3001`

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/health` | 健康检查 |
| `GET` | `/api/cards` | 获取所有卡片 |
| `POST` | `/api/cards` | 新增卡片 |
| `PATCH` | `/api/cards/:id` | 更新卡片内容、类型或位置 |
| `DELETE` | `/api/cards/:id` | 删除卡片 |
| `PUT` | `/api/cards/reorder` | 批量更新卡片列和排序 |

新增卡片示例：

```bash
curl -X POST http://localhost:3001/api/cards \
  -H "Content-Type: application/json" \
  -d '{"type":"todo","message":"新的任务"}'
```

卡片类型仅支持：

```text
todo | doing | done
```

## 数据说明

卡片数据表包含以下核心字段：

| 字段 | 说明 |
| --- | --- |
| `id` | 卡片唯一 ID |
| `type` | 卡片所在列 |
| `message` | 卡片内容 |
| `position` | 卡片在列中的排序 |
| `created_at` | 创建时间 |
| `updated_at` | 更新时间 |

## 提交规范

项目已配置 commitlint，建议使用 Conventional Commits 风格：

```text
feat: 新增功能
fix: 修复问题
docs: 文档变更
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建或工具配置
```
