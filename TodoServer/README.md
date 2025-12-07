# Todo List API

基于 Koa 的持久化 Todo List API 服务，数据保存到 JSON 文件。

## 快速开始

```bash
# 安装依赖
npm install

# 启动服务器
npm start

# 开发模式（自动重启）
npm run dev
```

服务器运行在 `http://localhost:3000`，前端页面可直接访问根路径。

## API 接口

- `GET /api/todos` - 获取所有任务
- `POST /api/todos` - 创建任务
  ```json
  { "title": "任务标题", "completed": false }
  ```
- `POST /api/todos/:id` - 更新任务（支持部分更新）
- `DELETE /api/todos/:id` - 删除任务

## 项目结构

```
TodoServer/
├── server/index.js      # 服务器入口
├── utils/storage.js     # 数据持久化
├── public/index.html    # 前端页面
└── todos.json          # 数据文件（自动生成）
```

## 技术栈

- Koa
- koa-router
- koa-bodyparser
- koa-static
