// api
import { mergeUsersWithAnswers } from "../../../../features/live/api/mergeUsersWithAnswers";
import { updateEventStatus } from "../../../../features/events/api/eventApi";

// components
import { QuizInfo } from "../../../../components/Live/QuizInfo";
import {
  PageContent,
  PageFooter,
  PageHeader,
  PageHeaderTitle,
} from "../../../../components/PageLayout";
import Flexbox from "../../../../components/Flexbox";
import { Icon } from "../../../../components/Icon";
import { FormCheckBox } from "../../../../components/Form";
import { Button } from "../../../../components/Button";

// hooks
import { useLiveEventContext } from "../../../../features/live/hooks/useLiveEventContext";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// types
import { Section, SectionTitle } from "../../../../components/Section";
import type { AnswerDataType } from "../../../../features/live/types/answerTypes";
import type { UserDataType } from "../../../../features/live/types/userTypes";
import {
  evaluateAnswerTypeText,
  fetchUsersAnaswer,
  updateScore,
} from "../../../../features/live/api/answerApi";
import { Loading } from "../../../../components/Loading";

type MergedDataType = UserDataType & {
  answer: AnswerDataType;
};

const PresentUsersAnswer = () => {
  const [answers, setAnswers] = useState<MergedDataType[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { eventId } = useParams();
  const { quizData, eventData, usersData, status, answersData } =
    useLiveEventContext();

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
  }, [status, eventData, usersData, answersData]);

  if (!usersData || status === "loading" || !eventData) {
    return <Loading />;
  }

  return (
    <>
      <PageHeader position="sticky">
        <PageHeaderTitle>みんなの回答確認する</PageHeaderTitle>
      </PageHeader>
      <PageContent>
        <Section>
          <QuizInfo quizData={quizData} />
        </Section>
        <Section>
          <SectionTitle level={2}>みんなの回答</SectionTitle>
          <p>正解の回答にはチェックを入れてください</p>
          {answers && (
            <ul>
              {answers.map((answer: MergedDataType, index: number) => (
                <li key={answer.userId}>
                  <Flexbox>
                    <FormCheckBox
                      readOnly={quizData?.type === "single"}
                      className="u-width--full"
                      style={{
                        borderBottom: ".1rem solid var(--c-active)",
                        padding: "1em",
                        width: "100%",
                      }}
                      checked={answer.answer?.isCorrect || false}
                      disabled={answer.answer?.label ? false : true}
                      onChange={async (
                        e: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        try {
                          setIsSubmitting(true);
                          if (quizData?.type === "text") {
                            await evaluateAnswerTypeText(
                              eventId || "",
                              answer.userId,
                              e.target.checked,
                            );
                            await updateScore(eventId || "", answer.userId);
                          }
                          setAnswers((prev) => {
                            const newAnswers = [...prev!];
                            newAnswers[index] = {
                              ...newAnswers[index],
                              answer: {
                                ...newAnswers[index].answer,
                                isCorrect: e.target.checked,
                              },
                            };
                            return newAnswers;
                          });
                        } catch (err) {
                          console.error(err);
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                    >
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
                    </FormCheckBox>
                  </Flexbox>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </PageContent>
      <PageFooter>
        <Button
          variant="primary"
          className="u-width--full"
          aria-disabled={isSubmitting}
          onClick={async () => {
            try {
              setIsSubmitting(true);
              await updateEventStatus(eventId || "", "presentCorrectAnswers");
            } catch (err) {
              console.error(err);
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          正解を発表する
        </Button>
      </PageFooter>
    </>
  );
};

export default PresentUsersAnswer;
