import { useEffect, useRef } from "@lynx-js/react";
import type { LocalChatMessage } from "../types";
import { EmptyState } from "./EmptyState";
import { MessageItem } from "./MessageItem";

interface MessageListProps {
  messages: LocalChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  const messageListRef = useRef<any>(null);

  // 每次新消息加入时，尽量把列表滚动到底部，方便查看最新内容
  useEffect(() => {
    const node: any = messageListRef.current;
    if (!node) return;

    try {
      if (typeof node.scrollTo === "function") {
        node.scrollTo({ top: 999999, behavior: "auto" });
      }
    } catch {
      // 某些运行环境可能不支持 scrollTo，这里可以忽略
    }
  }, [messages.length]);

  return (
    <scroll-view
      className="MessageList"
      scroll-y
      ref={messageListRef}
    >
      {messages.length === 0 ? (
        <EmptyState />
      ) : (
        messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))
      )}
    </scroll-view>
  );
}

