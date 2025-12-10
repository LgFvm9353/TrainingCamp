import { useEffect, useRef, useState } from "@lynx-js/react";
import { WebSocket } from "@lynx-js/websocket";
import type { ConnectionStatus, ServerChatMessage, LocalChatMessage } from "../types";
import { createWebSocketUrl, formatTimeLabel } from "../utils";

interface UseWebSocketOptions {
  userId: string;
  onMessage: (message: LocalChatMessage) => void;
}

export function useWebSocket({ userId, onMessage }: UseWebSocketOptions) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");
  const [shouldReconnect, setShouldReconnect] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const userIdRef = useRef<string>("");
  const onMessageRef = useRef(onMessage);
  const reconnectAttemptsRef = useRef<number>(0);
  const maxReconnectAttempts = 10; // 最大重连次数

  // 同步 ref，方便在 WebSocket 回调里拿到最新的值
  useEffect(() => {
    userIdRef.current = userId;
    onMessageRef.current = onMessage;
  }, [userId, onMessage]);

  useEffect(() => {
    // 如果已达到最大重连次数且是重连请求，不再连接
    if (shouldReconnect && reconnectAttemptsRef.current >= maxReconnectAttempts) {
      return;
    }

    const url = createWebSocketUrl();
    console.info("[chat] connecting to", url);

    let socket: WebSocket | null = null;
    let connectionTimeout: any = null;
    const CONNECTION_TIMEOUT = 10000; // 10秒超时

    try {
      if (typeof WebSocket === "undefined") {
        console.error("[chat] WebSocket is not available");
        setConnectionStatus("error");
        return;
      }

      socket = new WebSocket(url);
      socketRef.current = socket;
      setConnectionStatus("connecting");

      // 设置连接超时
      connectionTimeout = (globalThis as any).setTimeout?.(
        () => {
          if (socket && socket.readyState !== 1) {
            console.error("[chat] connection timeout", { url, readyState: socket.readyState });
            try {
              socket.close();
            } catch (e) {
              // 忽略关闭错误
            }
            setConnectionStatus("error");
          }
        },
        CONNECTION_TIMEOUT
      );

      const handleOpen = () => {
        console.info("[chat] websocket connected");
        setConnectionStatus("open");
        reconnectAttemptsRef.current = 0;
        setShouldReconnect(false);
        if (connectionTimeout && (globalThis as any).clearTimeout) {
          (globalThis as any).clearTimeout(connectionTimeout);
        }
      };

      const handleClose = (event: any) => {
        const closeCode = event?.code || 0;
        console.warn("[chat] websocket closed", { code: closeCode, url });
        
        socketRef.current = null;

        if (closeCode === 1000) {
          setConnectionStatus("closed");
          return;
        }

        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          console.info(`[chat] reconnecting (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`);
          setConnectionStatus("connecting");
          
          // 延迟重连
          let frameCount = 0;
          const maxFrames = 180; // 约3秒
          const scheduleReconnect = () => {
            frameCount++;
            if (frameCount >= maxFrames) {
              setShouldReconnect(true);
            } else {
              const raf = (globalThis as any).requestAnimationFrame || 
                          ((globalThis as any).setTimeout || (() => {}));
              if (raf) {
                raf(scheduleReconnect, 16);
              } else {
                setShouldReconnect(true);
              }
            }
          };
          scheduleReconnect();
        } else {
          console.error("[chat] max reconnect attempts reached", { url });
          setConnectionStatus("error");
        }
      };

      const handleError = (event: any) => {
        console.error("[chat] websocket error", { url, readyState: socket?.readyState });
      };

      const handleMessage = (event: any) => {
        try {
          const data: ServerChatMessage = JSON.parse(
            typeof event.data === "string" ? event.data : String(event.data)
          );

          if (data.type !== "chat-message") return;

          const isSelf = data.userId === userIdRef.current;
          const message: LocalChatMessage = {
            ...data,
            id: Date.now(),
            self: isSelf,
            timeLabel: formatTimeLabel(data.timestamp),
          };

          onMessageRef.current(message);
        } catch (error) {
          console.warn("[chat] failed to parse message from server", error);
        }
      };

      // 绑定事件处理器
      socket.onopen = handleOpen;
      socket.onclose = handleClose;
      socket.onerror = handleError;
      socket.onmessage = handleMessage;
    } catch (error) {
      console.error("[chat] failed to create websocket", { error, url });
      setConnectionStatus("error");
    }

    return () => {
      // 清除超时定时器
      if (connectionTimeout && (globalThis as any).clearTimeout) {
        (globalThis as any).clearTimeout(connectionTimeout);
      }
      if (socket) {
        try {
          socket.close();
        } catch (e) {
          // 忽略关闭错误
        }
        socketRef.current = null;
      }
    };
  }, [shouldReconnect]); // 当 shouldReconnect 变化时重新连接

  const sendMessage = (payload: ServerChatMessage) => {
    const socket = socketRef.current;
    if (socket && socket.readyState === 1) {
      // WebSocket.OPEN = 1
      socket.send(JSON.stringify(payload));
      return true;
    } else {
      console.warn("[chat] websocket is not ready, message only saved locally");
      return false;
    }
  };

  return {
    connectionStatus,
    sendMessage,
  };
}

