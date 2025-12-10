/**
 * 与后端约定的消息结构。
 * 这里使用最简单的单频道广播聊天：所有客户端都能收到所有人的消息。
 */
export interface ServerChatMessage {
  type: "chat-message";
  userId: string;
  text: string;
  /** 服务器时间戳（毫秒） */
  timestamp: number;
}

/** 前端用于渲染的消息结构，比后端多了一些展示字段 */
export interface LocalChatMessage extends ServerChatMessage {
  id: number;
  /** 是否是当前用户自己发出的消息，用来区分左右气泡 */
  self: boolean;
  /** 已格式化的时间展示文案，例如 `19:30` */
  timeLabel: string;
}

export type ConnectionStatus = "connecting" | "open" | "closed" | "error";

