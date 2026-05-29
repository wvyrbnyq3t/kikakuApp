// api
import { mergeUsersWithAnswers } from "../../../../features/live/api/mergeUsersWithAnswers";
import { fetchUsersAnaswer } from "../../../../features/live/api/answerApi";

// components
import { QuizInfo } from "../../../../components/Live/QuizInfo";
import { PageContent } from "../../../../components/PageLayout";
import { PlayerHeader } from "../PlayerComponents";
import Flexbox from "../../../../components/Flexbox";
import { Icon } from "../../../../components/Icon";
import { Section, SectionTitle } from "../../../../components/Section";

// hooks
import { useLiveEventContext } from "../../../../features/live/hooks/useLiveEventContext";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// types
import type { AnswerDataType } from "../../../../features/live/types/answerTypes";
import type { UserDataType } from "../../../../features/live/types/userTypes";

type MergedDataType = UserDataType & {
  answer: AnswerDataType;
};

const PresentCorrectAnswersPanel = () => {
  const [answers, setAnswers] = useState<MergedDataType[] | null>(null);

  const { eventId } = useParams();
  const { eventData, usersData, quizData, answersData } = useLiveEventContext();

  const onMounted = async () => {
    if (!eventData?.currentQuizId) return;

    try {
      // ユーザーデータとマージする
      const mergedData = mergeUsersWithAnswers(
        usersData.filter((user) => user.role === "player"),
        answersData ||
          (await fetchUsersAnaswer(eventId || "", eventData.currentQuizId)) ||
          [],
      ) as MergedDataType[];
      setAnswers(mergedData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    onMounted();
  }, [eventData?.currentQuizId]);

  return (
    <>
      <PlayerHeader />
      <PageContent>
        <Section>
          <QuizInfo quizData={quizData} />
        </Section>
        <Section>
          <SectionTitle level={2}>みんなの回答</SectionTitle>
          {answers && (
            <ul>
              {answers.map((answer: MergedDataType) => (
                <li
                  key={answer.userId}
                  style={{
                    borderBottom: ".1rem solid var(--c-active)",
                    color: answer.answer?.isCorrect
                      ? "var(--c-lime)"
                      : "var(--c-red)",
                    padding: "1em",
                    width: "100%",
                  }}
                >
                  <Flexbox>
                    <Icon variant="ghost">
                      {answer.answer?.isCorrect ? "circle" : "close"}
                    </Icon>
                    <div>
                      <Flexbox style={{ gap: "0.4em", width: "max-content" }}>
                        <Icon variant="ghost">person</Icon>
                        <p>{answer.userName}</p>
                      </Flexbox>
                      <p
                        className="u-mrgn--left-auto"
                        style={{ fontSize: "1.25em", fontWeight: "700" }}
                      >
                        {answer.answer?.label || "未回答"}
                      </p>
                    </div>
                  </Flexbox>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </PageContent>
    </>
  );
};

export default PresentCorrectAnswersPanel;
