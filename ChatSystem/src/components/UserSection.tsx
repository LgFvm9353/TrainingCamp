import { useRef } from "@lynx-js/react";

interface UserSectionProps {
  userId: string;
  userIdInput: string;
  onUserIdInputChange: (value: string) => void;
  onConfirmUserId: () => void;
}

export function UserSection({
  userId,
  userIdInput,
  onUserIdInputChange,
  onConfirmUserId,
}: UserSectionProps) {
  const userIdInputRef = useRef<any>(null);

  return (
    <view className="UserSection">
      <text className="Label">你的 ID</text>
      <view className="UserRow">
        <input
          className="TextInput TextInput--user"
          ref={userIdInputRef}
          placeholder="例如：Alice、Bob、前端同学"
          bindinput={(event: any) => {
            onUserIdInputChange(event?.detail?.value ?? "");
          }}
        />
        <view className="PrimaryButton" bindtap={onConfirmUserId}>
          <text className="PrimaryButton__text">
            {userId ? "修改" : "确定"}
          </text>
        </view>
      </view>
      {userId ? (
        <text className="UserHint">
          当前身份：<text className="UserHint__name">{userId}</text>
        </text>
      ) : (
        <text className="UserHint">
          设置一个简单的昵称，方便在群聊中区分彼此。
        </text>
      )}
    </view>
  );
}

