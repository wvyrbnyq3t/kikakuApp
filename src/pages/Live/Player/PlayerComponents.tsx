import { useLiveEventContext } from "../../../features/live/hooks/useLiveEventContext";
import { useUserAuth } from "../../../features/auth/hooks/useUserAuth";

import { PageHeader, PageHeaderTitle } from "../../../components/PageLayout";
import { IconButton } from "../../../components/Button";
import { AppConfirm } from "../../../libs/dialog/AppConfirm";
import { leaveEvent } from "../../../features/live/api/userApi";

import { useNavigate } from "react-router-dom";

const PlayerHeader = () => {
  const { eventData } = useLiveEventContext();
  const { authUser } = useUserAuth();
  const nav = useNavigate();

  return (
    <PageHeader position="sticky">
      <PageHeaderTitle>{eventData?.eventTitle}</PageHeaderTitle>
      <IconButton
        variant="ghost"
        onClick={async () => {
          try {
            const confirm = await AppConfirm({
              title: "イベントから退出しますか？",
              confirmText: "退出する",
            });

            if (!confirm) return;

            await leaveEvent(eventData?.eventId || "", authUser?.uid || "");
            nav(`/`);
          } catch (err) {
            console.error(err);
          }
        }}
      >
        logout
      </IconButton>
    </PageHeader>
  );
};

export { PlayerHeader };