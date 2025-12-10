import { useCallback, useRef, useState } from "@lynx-js/react";
import type { LocalChatMessage, ServerChatMessage } from "./types";
import { formatTimeLabel } from "./utils";
import { useWebSocket } from "./hooks";
import { ChatHeader, UserSection, MessageList, InputBar } from "./components";
import "./App.css";

const MAX_MESSAGES = 500; // 最多保留 500 条消息
const MAX_USER_ID_LENGTH = 50;
const MAX_MESSAGE_LENGTH = 1000;

export function App(_: { onRender?: () => void }) {
  // 用户身份 ID，由用户在顶部输入，一旦设置后会显示在消息中
  const [userId, setUserId] = useState<string>("");
  const [userIdInput, setUserIdInput] = useState<string>("");

  // 当前输入框里的待发送消息
  const [pendingMessage, setPendingMessage] = useState<string>("");

  // 聊天记录列表
  const [messages, setMessages] = useState<LocalChatMessage[]>([]);

  const messageIdRef = useRef<number>(1);

  // 处理接收到的消息
  const handleMessage = useCallback(
    (message: LocalChatMessage) => {
      const isSelf = message.userId === userId;

      // 如果是自己发送的消息，检查是否已经显示过（避免重复）
      if (isSelf) {
        setMessages((prev) => {
          // 检查是否已经有相同内容的消息（通过时间戳和内容判断）
          const isDuplicate = prev.some(
            (msg) =>
              msg.self &&
              msg.userId === message.userId &&
              msg.text === message.text &&
              Math.abs(msg.timestamp - message.timestamp) < 2000 // 2秒内的相同消息视为重复
          );
          if (isDuplicate) {
            return prev; // 不添加重复消息
          }
          return addMessage(prev, { ...message, id: messageIdRef.current++ });
        });
      } else {
        // 其他人的消息直接添加
        setMessages((prev) =>
          addMessage(prev, { ...message, id: messageIdRef.current++ })
        );
      }
    },
    [userId]
  );

  // 添加消息到列表，并限制最大数量
  const addMessage = (
    prev: LocalChatMessage[],
    message: LocalChatMessage
  ): LocalChatMessage[] => {
    const newMessages = [...prev, message];
    return newMessages.length > MAX_MESSAGES
      ? newMessages.slice(-MAX_MESSAGES)
      : newMessages;
  };

  // 创建系统消息
  const createSystemMessage = (text: string): LocalChatMessage => {
    return {
      id: messageIdRef.current++,
      type: "chat-message",
      userId: "系统",
      text,
      timestamp: Date.now(),
      self: false,
      timeLabel: formatTimeLabel(Date.now()),
    };
  };

  // WebSocket 连接
  const { connectionStatus, sendMessage } = useWebSocket({
    userId,
    onMessage: handleMessage,
  });

  // 处理确认用户ID
  const handleConfirmUserId = useCallback(() => {
    const trimmed = userIdInput.trim();
    if (!trimmed) return;

    // 限制用户ID长度
    if (trimmed.length > MAX_USER_ID_LENGTH) {
      setMessages((prev) => [
        ...prev,
        createSystemMessage("用户ID过长，请控制在 50 字符以内。"),
      ]);
      return;
    }

    setUserId(trimmed);
    setUserIdInput("");
  }, [userIdInput]);

  // 处理发送消息
  const handleSendMessage = useCallback(() => {
    // 检查连接状态
    if (connectionStatus !== "open") {
      setMessages((prev) => [
        ...prev,
        createSystemMessage("服务器未连接，无法发送消息。请等待连接成功后再试。"),
      ]);
      return;
    }

    const text = pendingMessage.trim();
    if (!text) {
      return;
    }

    // 限制消息长度
    if (text.length > MAX_MESSAGE_LENGTH) {
      setMessages((prev) => [
        ...prev,
        createSystemMessage("消息过长，请控制在 1000 字符以内。"),
      ]);
      return;
    }

    if (!userId) {
      // 没有设置用户 ID，则提示用户先设置
      setMessages((prev) => [
        ...prev,
        createSystemMessage("请先在上方设置一个你的 ID，再开始聊天。"),
      ]);
      return;
    }

    const clientTimestamp = Date.now();
    const payload: ServerChatMessage = {
      type: "chat-message",
      userId,
      text,
      timestamp: clientTimestamp,
    };

    // 创建本地消息用于立即显示
    const localMessage: LocalChatMessage = {
      ...payload,
      id: messageIdRef.current++,
      self: true,
      timeLabel: formatTimeLabel(payload.timestamp),
    };

    setMessages((prev) => addMessage(prev, localMessage));
    setPendingMessage("");

    // 发送到服务器
    sendMessage(payload);
  }, [pendingMessage, userId, connectionStatus, sendMessage]);

  return (
    <page>
      <view className="AppRoot">
        <view className="ChatCard">
          <ChatHeader connectionStatus={connectionStatus} />

          <UserSection
            userId={userId}
            userIdInput={userIdInput}
            onUserIdInputChange={setUserIdInput}
            onConfirmUserId={handleConfirmUserId}
          />

          <MessageList messages={messages} />

          <InputBar
            userId={userId}
            pendingMessage={pendingMessage}
            connectionStatus={connectionStatus}
            onMessageChange={setPendingMessage}
            onSendMessage={handleSendMessage}
          />
        </view>
      </view>
    </page>
  );
}
