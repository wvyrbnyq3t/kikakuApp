// components
import { PageContent, PageFooter } from "../../../../components/PageLayout";
import { PlayerHeader } from "../PlayerComponents";
import { QuizInfo } from "../../../../components/Live/QuizInfo";
import {
  FormField,
  FormLabel,
  FormRadio,
  FormText,
} from "../../../../components/Form";

// hooks
import { useLiveEventContext } from "../../../../features/live/hooks/useLiveEventContext";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "../../../../components/Toast";

// types
import type { QuizOptionType } from "../../../../features/quizzes/types/quizTypes";
import { Section } from "../../../../components/Section";
import { Button } from "../../../../components/Button";
import { updateUserAnswer } from "../../../../features/live/api/answerApi";
import { useUserAuth } from "../../../../features/auth/hooks/useUserAuth";

const PresentQuizPanel = () => {
  const [answer, setAnswer] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { quizData } = useLiveEventContext();
  const { eventId } = useParams();
  const { authUser } = useUserAuth();
  const { showToast } = useToast();

  return (
    <>
      <PlayerHeader />
      <PageContent>
        <Section>
          <QuizInfo quizData={quizData} />
        </Section>
        {quizData?.type === "single" && (
          <Section>
            <ul>
              {quizData?.options &&
                quizData.options.map((option: QuizOptionType) => {
                  return (
                    <li key={option.optionId} className="p-quizList__item">
                      <FormRadio
                        style={{
                          borderBottom: ".1rem solid var(--c-active)",
                          padding: "1.6em 1em",
                          width: "100%",
                        }}
                        name="selectPresentQuiz"
                        id={option.optionId}
                        checked={answer?.value === option.optionId}
                        onChange={() =>
                          setAnswer({
                            value: option.optionId,
                            label: option.label,
                          })
                        }
                      >
                        <p className="p-quizList__itemTitle">{option.label}</p>
                      </FormRadio>
                    </li>
                  );
                })}
            </ul>
          </Section>
        )}
        {quizData?.type === "text" && (
          <Section>
            <FormField>
              <FormLabel htmlFor="answer">回答を入力する</FormLabel>
              <FormText
                id="answer"
                placeholder="回答"
                value={answer?.label}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAnswer(() => ({
                    value: authUser?.uid || "",
                    label: String(e.target.value),
                  }));
                }}
              />
            </FormField>
          </Section>
        )}
      </PageContent>
      <PageFooter>
        <Button
          variant="primary"
          className="u-width--full"
          aria-disabled={!answer || isSubmitting}
          onClick={async () => {
            try {
              if (!answer) return;
              setIsSubmitting(true);
              await updateUserAnswer(
                eventId || "",
                authUser?.uid || "",
                answer.value,
                answer.label,
              );

              showToast({
                title: "回答を送信しました",
                icon: "send",
              });
            } catch (err) {
              console.error(err);
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          回答を送信する
        </Button>
      </PageFooter>
    </>
  );
};

export default PresentQuizPanel;
