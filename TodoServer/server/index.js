import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import { readTodos, writeTodos, generateId } from '../utils/storage.js';
import serve from 'koa-static';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = new Koa();
const router = new Router();

app.use(bodyParser());

// CORS 中间件（允许前端访问 API）
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type');
    if (ctx.method === 'OPTIONS') {
      ctx.status = 204;
      return;
    }
    await next();
  });
// 处理错误中间件
app.use(async (ctx, next) => {
    try {
        await next();
    } catch(error) {
        ctx.status = error.status || 500;
        ctx.body = {
            error: error.message || 'Internal Server Error'
        };
        console.error('服务器错误:', error);
    }
});

app.use(serve(path.join(__dirname, '..', 'public')));

router.get('/api/todos', async (ctx) => {
    const todos = await readTodos();
    ctx.body = todos;
});

router.post('/api/todos', async (ctx) => {
    const {title, completed = false} = ctx.request.body;
    if(!title || typeof title !== 'string' || title.trim() === ''){
        ctx.status = 400;
        ctx.body = {error: 'title 字段是必填的，且必须是非空字符串'};
        return;
    }
    if(typeof completed !== 'boolean'){
        ctx.status = 400;
        ctx.body = {error: 'completed 字段必须是布尔值'};
        return;
    }
    const todos = await readTodos();
    const newTodo = {
        id: generateId(todos),
        title: title.trim(),
        completed,
        createdAt: new Date().toISOString()
    };
    todos.push(newTodo);
    await writeTodos(todos);
    ctx.status = 201;
    ctx.body = newTodo;
});

router.post('/api/todos/:id', async (ctx) => {
   const {id} = ctx.params;
   const {title, completed} = ctx.request.body;
   
   const todos = await readTodos();
   const todoIndex = todos.findIndex(todo => todo.id === id);
   if(todoIndex === -1){
    ctx.status = 404;
    ctx.body = {error: 'Todo 任务未找到'};
    return;
   }

   const todo = todos[todoIndex];
   
   // 只更新提供的字段（允许部分更新）
   if (title !== undefined) {
       if (typeof title !== 'string' || title.trim() === '') {
           ctx.status = 400;
           ctx.body = {error: 'title 字段必须是非空字符串'};
           return;
       }
       todo.title = title.trim();
   }

   if (completed !== undefined) {
       if (typeof completed !== 'boolean') {
           ctx.status = 400;
           ctx.body = {error: 'completed 字段必须是布尔值'};
           return;
       }
       todo.completed = completed;
   }

   await writeTodos(todos);
   ctx.body = todo;
});

router.delete('/api/todos/:id', async (ctx) => {
    const {id} = ctx.params;
    const todos = await readTodos();
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if(todoIndex === -1){
        ctx.status = 404;
        ctx.body = {error: 'Todo 任务未找到'};
        return;
    }
    todos.splice(todoIndex, 1);
    await writeTodos(todos);
    ctx.status = 204;
    ctx.body = null;
});

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Todo List API 服务器已启动`);
    console.log(`监听端口: ${PORT}`);
    console.log(`访问地址: http://localhost:${PORT}`);
    console.log(`API 端点:`);
    console.log(`   - GET    http://localhost:${PORT}/api/todos`);
    console.log(`   - POST   http://localhost:${PORT}/api/todos`);
    console.log(`   - POST   http://localhost:${PORT}/api/todos/:id`);
    console.log(`   - DELETE    http://localhost:${PORT}/api/todos/:id`);
});