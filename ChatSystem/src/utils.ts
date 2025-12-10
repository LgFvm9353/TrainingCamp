/**
 * 根据当前环境生成 WebSocket 地址
 */
export function createWebSocketUrl(): string {
  try {
    if (typeof location !== "undefined" && location.hostname) {
      const hostname = location.hostname;

      // localhost 或 127.0.0.1 使用 localhost
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return "ws://localhost:8080";
      }

      // IP 地址格式（192.168.x.x, 10.x.x.x 等）直接使用
      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (ipPattern.test(hostname)) {
        return `ws://${hostname}:8080`;
      }

      // 其他情况（域名）也尝试使用
      return `ws://${hostname}:8080`;
    }
  } catch (error) {
    console.warn("[chat] failed to get location", error);
  }
  
  return "ws://localhost:8080";
}

/**
 * 格式化时间戳为时间标签，例如 `19:30`
 */
export function formatTimeLabel(timestamp: number): string {
  const date = new Date(timestamp);
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

