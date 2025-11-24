/// <reference types="vite/client" />

// CSS Module 类型定义
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
