// api
import { isEntryEvent } from "../../../features/live/api/userApi";

// components
import { Loading } from "../../../components/Loading";

// hooks
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserAuth } from "../../../features/auth/hooks/useUserAuth";
import { useLiveEventContext } from "../../../features/live/hooks/useLiveEventContext";

// Panels
import EntryPanel from "./Panels/EntryPanel";
import WaitingPanel from "./Panels/WaitingPanel";
import SelectQuizPanel from "./Panels/SelectQuizPanel";
import PresentQuizPanel from "./Panels/PresentQuizPanel";
import PresentUsersAnswerPanel from "./Panels/PresentUsersAnswerPanel";
import PresentCorrectAnswersPanel from "./Panels/PresentCorrectAnswersPanel";
import FinishPanel from "../FinishPanel";

const PlayerScreen = () => {
  const { eventData, status } = useLiveEventContext();
  const { authUser, isAuthLoading } = useUserAuth();
  const { eventId } = useParams();

  const [entryFlg, setEntryFlg] = useState<boolean>(false);

  const onMounted = async () => {
    // 既に参加しているかどうかを判定する
    const ls = JSON.parse(localStorage.getItem("currentEvent") || "{}");
    const userId = authUser?.uid || ls.userId || "";

    setEntryFlg(await isEntryEvent(eventId || "", userId));
  };

  useEffect(() => {
    onMounted();
  }, [status]);

  if (isAuthLoading || status === "loading") return <Loading />;

  if (eventData?.status === "ready") {
    if (entryFlg) {
      return <WaitingPanel />;
    } else {
      return <EntryPanel />;
    }
  }
  if (eventData?.status === "selectQuiz") return <SelectQuizPanel />;
  if (eventData?.status === "presentQuiz") return <PresentQuizPanel />;
  if (eventData?.status === "presentUsersAnswer")
    return <PresentUsersAnswerPanel />;
  if (eventData?.status === "presentCorrectAnswers")
    return <PresentCorrectAnswersPanel />;
  if (eventData?.status === "finished") return <FinishPanel />;
};

export default PlayerScreen;
