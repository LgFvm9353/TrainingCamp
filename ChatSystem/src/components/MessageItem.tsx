import type { LocalChatMessage } from "../types";

interface MessageItemProps {
  message: LocalChatMessage;
}

export function MessageItem({ message }: MessageItemProps) {
  return (
    <view
      className={
        message.self ? "MessageRow MessageRow--self" : "MessageRow"
      }
    >
      <view
        className={
          message.self
            ? "MessageBubble MessageBubble--self"
            : "MessageBubble"
        }
      >
        <text className="MessageMeta">
          {message.self ? "我" : message.userId} · {message.timeLabel}
        </text>
        <text className="MessageText">{message.text}</text>
      </view>
    </view>
  );
}

