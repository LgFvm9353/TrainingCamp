// 数据持久化的工具模块

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// todo.json 文件的完整路径
const TODOS_FILE_PATH = path.join(__dirname, '..', 'todos.json');

export async function readTodos(){
    try{
       // 检查文件是否存在
       if(!fs.existsSync(TODOS_FILE_PATH)){
        // 如果文件不存在，创建一个空数组
        await writeTodos([]);
        return [];
       }
       // 读取文件内容
       const data = fs.readFileSync(TODOS_FILE_PATH, 'utf-8');
       if(!data.trim()){
        return [];
       }
       const todos = JSON.parse(data);
       return Array.isArray(todos) ? todos : [];
    }catch(error)
    {
        console.error('读取 todos.json 失败:', error);
        return [];
    }
}

// 写入所有的 Todo 任务到文件
export async function writeTodos(todos){
    try{
        if(!Array.isArray(todos)){
            throw new Error('todos 必须是数组');
        }
        const jsonContent = JSON.stringify(todos, null, 2);
        fs.writeFileSync(TODOS_FILE_PATH, jsonContent, 'utf-8');
        console.log('保存 todos.json 成功');
    }catch(error){
        console.error('保存 todos.json 失败:', error);
        throw error;
    }
}

// 生成新的唯一ID
export function generateId(todos) {
    if(todos.length === 0){
        return '1';
    }
    const maxId = Math.max(...todos.map(todo => parseInt(todo.id, 10) || 0));
    return String(maxId + 1);
}