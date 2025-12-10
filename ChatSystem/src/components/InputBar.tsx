import { useRef } from "@lynx-js/react";
import type { ConnectionStatus } from "../types";

interface InputBarProps {
  userId: string;
  pendingMessage: string;
  connectionStatus: ConnectionStatus;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
}

export function InputBar({
  userId,
  pendingMessage,
  connectionStatus,
  onMessageChange,
  onSendMessage,
}: InputBarProps) {
  const messageInputRef = useRef<any>(null);
  const isConnected = connectionStatus === "open";
  const isDisabled = !isConnected || !userId;

  const getPlaceholder = () => {
    if (!userId) {
      return "先在上方填写一个你的 ID，再开始聊天";
    }
    if (!isConnected) {
      return "等待服务器连接...";
    }
    return "输入想说的话，点击右侧发送";
  };

  return (
    <view className="InputBar">
      <input
        className={`TextInput TextInput--message ${isDisabled ? "TextInput--disabled" : ""}`}
        ref={messageInputRef}
        placeholder={getPlaceholder()}
        bindinput={(event: any) => {
          if (!isDisabled) {
            onMessageChange(event?.detail?.value ?? "");
          }
        }}
      />
      <view
        className={`PrimaryButton ${isDisabled ? "PrimaryButton--disabled" : ""}`}
        bindtap={isDisabled ? () => {} : onSendMessage}
      >
        <text className="PrimaryButton__text">发送</text>
      </view>
    </view>
  );
}

