/**
 * 一个非常简单的 Node.js + WebSocket 聊天服务器。
 *
 * 功能：
 * - 接收前端发送的聊天消息，并广播给所有已连接的客户端
 * - 不做持久化，也不做鉴权，方便你在此基础上继续扩展
 *
 * 启动方式：
 *   npm run server
 *
 * 前端会默认连接到 ws://<当前主机名>:8080
 */

import { WebSocketServer, WebSocket } from "ws";

const PORT = Number(process.env.PORT || 8080);
const MAX_MESSAGE_LENGTH = 1000; // 限制消息最大长度

/** 创建 WebSocket 服务器实例 */
// 监听所有网络接口（0.0.0.0），允许局域网设备连接
const wss = new WebSocketServer({ 
  port: PORT,
  host: '0.0.0.0'  // 允许从任何网络接口访问
});

/**
 * 一个小工具：安全地解析客户端发来的 JSON 字符串。
 * 解析失败时返回 null，避免程序直接抛异常退出。
 */
function safeParseJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

wss.on("connection", (socket, request) => {
  const clientAddress =
    request?.socket?.remoteAddress ?? "unknown-address";
  console.log(`[server] client connected from ${clientAddress}`);

  socket.on("message", (buffer) => {
    const raw = buffer.toString("utf-8");
    const payload = safeParseJson(raw);

    if (!payload || payload.type !== "chat-message") {
      console.warn("[server] ignored non-chat message:", raw);
      return;
    }

    // 验证消息格式
    if (typeof payload.userId !== "string" || typeof payload.text !== "string") {
      console.warn("[server] invalid message format:", payload);
      return;
    }

    // 限制消息长度
    if (payload.text.length > MAX_MESSAGE_LENGTH) {
      console.warn(`[server] message too long (${payload.text.length} > ${MAX_MESSAGE_LENGTH})`);
      return;
    }

    // 清理用户输入（防止 XSS，虽然这里只是简单示例）
    const sanitizedText = payload.text.trim();
    if (!sanitizedText) {
      console.warn("[server] empty message after trim");
      return;
    }

    const enriched = {
      type: "chat-message",
      userId: payload.userId.trim().slice(0, 50), // 限制用户ID长度
      text: sanitizedText,
      // 统一由服务端打时间戳，保证所有人看到的时间一致
      timestamp: Date.now(),
    };

    const encoded = JSON.stringify(enriched);

    // 简单广播：把消息发送给所有在线的客户端
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(encoded);
        } catch (error) {
          console.error("[server] failed to send message to client:", error);
        }
      }
    });
  });

  socket.on("close", () => {
    console.log("[server] client disconnected");
  });

  socket.on("error", (error) => {
    console.error("[server] socket error", error);
  });
});

console.log(
  `[server] WebSocket chat server is running on ws://0.0.0.0:${PORT}`
);
console.log(
  `[server] Accessible from LAN devices at ws://<your-ip>:${PORT}`
);


