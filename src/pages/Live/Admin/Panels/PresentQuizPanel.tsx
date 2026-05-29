// components
import {
  PageContent,
  PageFooter,
  PageHeader,
  PageHeaderTitle,
} from "../../../../components/PageLayout";
import { QuizInfo } from "../../../../components/Live/QuizInfo";
import Flexbox from "../../../../components/Flexbox";

// hooks
import { useLiveEventContext } from "../../../../features/live/hooks/useLiveEventContext";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// types
import { Section, SectionTitle } from "../../../../components/Section";
import type { QuizOptionType } from "../../../../features/quizzes/types/quizTypes";
import { Icon } from "../../../../components/Icon";
import { mergeUsersWithAnswers } from "../../../../features/live/api/mergeUsersWithAnswers";
import type { UserDataType } from "../../../../features/live/types/userTypes";
import type { AnswerDataType } from "../../../../features/live/types/answerTypes";
import { Button } from "../../../../components/Button";
import { AppConfirm } from "../../../../libs/dialog/AppConfirm";
import { updateEventStatus } from "../../../../features/events/api/eventApi";
import {
  evaluateAnswerTypeSingle,
  updateScore,
} from "../../../../features/live/api/answerApi";
import { useUserAuth } from "../../../../features/auth/hooks/useUserAuth";
import { Loading } from "../../../../components/Loading";

type MergedDataType = UserDataType & {
  answer: AnswerDataType;
};

const PresentQuizPanel = () => {
  const { eventData, quizzesData, usersData, quizData, status, answersData } =
    useLiveEventContext();
  const { isAuthLoading } = useUserAuth();
  const [answers, setAnswers] = useState<MergedDataType[] | null>(null);
  const { eventId } = useParams();

  useEffect(() => {
    if (!quizzesData || !usersData) return;

    const mergedData = mergeUsersWithAnswers(usersData, answersData || []);

    setAnswers(mergedData as MergedDataType[]);
  }, [answersData, usersData, quizzesData]);

  if (status === "loading" || isAuthLoading || !eventData) return <Loading />;

  return (
    <>
      <PageHeader position="sticky">
        <PageHeaderTitle>{eventData?.eventTitle}</PageHeaderTitle>
      </PageHeader>
      <PageContent>
        <Section>
          <QuizInfo quizData={quizData} />
        </Section>
        <Section>
          <SectionTitle level={2}>選択肢</SectionTitle>
          <ul>
            {quizData?.options &&
              quizData.options.map((option: QuizOptionType) => {
                return (
                  <li key={option.optionId} className="p-quizList__item">
                    <Flexbox
                      style={{
                        borderBottom: ".1rem solid var(--c-active)",
                        padding: "1.6em 1em",
                        width: "100%",
                      }}
                    >
                      <Icon
                        variant="ghost"
                        style={{
                          color: option.isCorrect
                            ? "var(--c-lime)"
                            : "var(--c-red)",
                        }}
                      >
                        {option.isCorrect ? "circle" : "close"}
                      </Icon>
                      <p className="p-quizList__itemTitle">{option.label}</p>
                    </Flexbox>
                  </li>
                );
              })}
          </ul>
        </Section>
        <Section>
          <SectionTitle level={2}>回答状況</SectionTitle>
          <Section
            style={{
              paddingInline: "0",
            }}
          >
            <SectionTitle level={3}>回答済み</SectionTitle>
            {answers && (
              <ul>
                {answers
                  .filter((t: any) => t.answer)
                  .map((answer: MergedDataType) => (
                    <li
                      key={answer.userId}
                      style={{
                        borderBottom: ".1rem solid var(--c-active)",
                        padding: "1em",
                        width: "100%",
                      }}
                    >
                      <Flexbox>
                        <Flexbox style={{ gap: "0.4em", width: "max-content" }}>
                          <Icon variant="ghost">person</Icon>
                          <p>{answer.userName}</p>
                        </Flexbox>
                        <p
                          className="u-mrgn--left-auto"
                          style={{ fontWeight: "700" }}
                        >
                          {answer.answer?.label}
                        </p>
                      </Flexbox>
                    </li>
                  ))}
              </ul>
            )}
          </Section>
          <Section
            style={{
              paddingInline: "0",
            }}
          >
            <SectionTitle level={3}>未回答</SectionTitle>
            {answers && (
              <ul>
                {answers
                  .filter((t: any) => {
                    return t.role == "player" && !t.answer;
                  })
                  .map((answer: MergedDataType) => (
                    <li
                      key={answer.userId}
                      style={{
                        borderBottom: ".1rem solid var(--c-active)",
                        padding: "1em",
                        width: "100%",
                      }}
                    >
                      <Flexbox style={{ gap: "0.4em", width: "max-content" }}>
                        <Icon variant="ghost">person</Icon>
                        <p>{answer.userName}</p>
                      </Flexbox>
                    </li>
                  ))}
              </ul>
            )}
          </Section>
        </Section>
      </PageContent>
      <PageFooter>
        <Button
          variant="primary"
          className="u-width--full"
          onClick={async () => {
            try {
              const confirm = await AppConfirm({
                title: "回答を締め切りますか？",
                description: "締め切った後は回答の変更ができなくなります。",
                confirmText: "締め切る",
              });

              if (!confirm) return;

              if (quizData?.type === "single") {
                usersData.map(async (user: UserDataType) => {
                  await evaluateAnswerTypeSingle(eventId || "");
                  await updateScore(eventId || "", user.userId);
                });
              }
              await updateEventStatus(eventId || "", "presentUsersAnswer");
            } catch (err) {
              console.error(err);
            }
          }}
        >
          回答を締め切る
        </Button>
      </PageFooter>
    </>
  );
};

export default PresentQuizPanel;
