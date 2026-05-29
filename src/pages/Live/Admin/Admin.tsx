// hooks
import { useLiveEventContext } from "../../../features/live/hooks/useLiveEventContext";
import { useUserAuth } from "../../../features/auth/hooks/useUserAuth";
import { Loading } from "../../../components/Loading";

// Panels
import ReadyPanel from "./Panels/ReadyPanel";
import SelectQuizPanel from "./Panels/SelectQuizPanel";
import PresentQuizPanel from "./Panels/PresentQuizPanel";
import PresentUsersAnswerPanel from "./Panels/PresentUserAnswers";
import PresentCorrectAnswersPanel from "./Panels/PresentCorrectAnswersPanel";
import FinishPanel from "../FinishPanel";
import NotOwner from "../../NotOwner";

const AdminScreen = () => {
  const { eventData, status } = useLiveEventContext();
  const { authUser, isAuthLoading } = useUserAuth();

  if (authUser?.uid !== eventData?.ownerId) return <NotOwner />;

  if (isAuthLoading || status === "loading") return <Loading />;
  if (eventData?.status === "ready") return <ReadyPanel />;
  if (eventData?.status === "selectQuiz") return <SelectQuizPanel />;
  if (eventData?.status === "presentQuiz") return <PresentQuizPanel />;
  if (eventData?.status === "presentUsersAnswer")
    return <PresentUsersAnswerPanel />;
  if (eventData?.status === "presentCorrectAnswers")
    return <PresentCorrectAnswersPanel />;
  if (eventData?.status === "finished") return <FinishPanel />;
};

export default AdminScreen;
