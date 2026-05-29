import { useLiveEventContext } from "../../../features/live/hooks/useLiveEventContext";
import PresentQuizPanel from "./Panels/PresentQuizPanel";
import PresentUsersAnswerPanel from "./Panels/PresentUsersAnswerPanel";
import PresentCorrectAnswers from "./Panels/PresentCorrectAnswers";
import ReadyPanel from "./Panels/ReadyPanel";

const SpectatorScreen = () => {
  const { eventData } = useLiveEventContext();

  if (eventData?.status === "ready" || eventData?.status === "selectQuiz")
    return <ReadyPanel />;
  if (eventData?.status === "presentQuiz") return <PresentQuizPanel />;
  if (eventData?.status === "presentUsersAnswer")
    return <PresentUsersAnswerPanel />;
  if (eventData?.status === "presentCorrectAnswers")
    return <PresentCorrectAnswers />;
};

export default SpectatorScreen;
