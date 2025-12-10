import type { ConnectionStatus } from "../types";

interface ChatHeaderProps {
  connectionStatus: ConnectionStatus;
}

function getStatusText(status: ConnectionStatus): string {
  switch (status) {
    case "connecting":
      return "正在连接服务器…";
    case "open":
      return "已连接";
    case "closed":
      return "连接已关闭，可以稍后刷新重试";
    case "error":
      return "连接出错，请检查 Node.js 服务是否启动";
    default:
      return "";
  }
}

export function ChatHeader({ connectionStatus }: ChatHeaderProps) {
  return (
    <view className="ChatHeader">
      <view>
        <text className="ChatTitle">Lynx 聊天室</text>
        <text className="ChatSubtitle">
          使用 WebSocket + Node.js 的简单示例
        </text>
      </view>
      <text className={`Status Status--${connectionStatus}`}>
        {getStatusText(connectionStatus)}
      </text>
    </view>
  );
}

