// apis
import { updatePresentQuiz } from "../../../../features/live/api/liveEventApi";

// components
import {
  PageContent,
  PageFooter,
  PageHeader,
  PageHeaderTitle,
} from "../../../../components/PageLayout";
import { Button, IconButton } from "../../../../components/Button";
import Flexbox from "../../../../components/Flexbox";
import { Link } from "react-router-dom";
import { FormRadio } from "../../../../components/Form";
import { Section, SectionTitle } from "../../../../components/Section";

// hooks
import { useLiveEventContext } from "../../../../features/live/hooks/useLiveEventContext";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useToast } from "../../../../components/Toast";

// types
import type { QuizDataType } from "../../../../features/quizzes/types/quizTypes";
import { updateEventStatus } from "../../../../features/events/api/eventApi";
import { AppConfirm } from "../../../../libs/dialog/AppConfirm";

const SelectQuizPanel = () => {
  const { eventId } = useParams();
  const { quizzesData, usersData } = useLiveEventContext();
  const { showToast } = useToast();

  const [presentQuizId, setPresentQuizId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  return (
    <>
      <PageHeader position="sticky">
        <PageHeaderTitle>出題するクイズを選択</PageHeaderTitle>
      </PageHeader>
      <PageContent>
        <Section>
          <SectionTitle level={2}>クイズ一覧</SectionTitle>
          <ul>
            {quizzesData.filter((quiz) => !quiz.hasPresented).length === 0 ? (
              <p>未出題のクイズがありません</p>
            ) : (
              quizzesData
                .filter((quiz) => !quiz.hasPresented)
                .map((quiz: QuizDataType) => {
                  return (
                    <li
                      key={quiz.quizId}
                      className="p-quizList__item"
                      style={{
                        borderBottom: ".1rem solid var(--c-active)",
                        padding: "1em",
                      }}
                    >
                      <Flexbox>
                        <div style={{ width: "100%" }}>
                          <FormRadio
                            name="selectPresentQuiz"
                            id={quiz.quizId}
                            checked={presentQuizId === quiz.quizId}
                            onChange={() => setPresentQuizId(quiz.quizId)}
                            style={{ width: "100%" }}
                          >
                            <p className="p-quizList__itemTitle">
                              {quiz.quizTitle}
                            </p>
                          </FormRadio>
                        </div>
                        <IconButton
                          variant="ghost"
                          asChild
                          className="u-mrgn--left-auto"
                        >
                          <Link
                            to={`/events/${eventId}/quizzes/${quiz.quizId}`}
                          >
                            edit
                          </Link>
                        </IconButton>
                      </Flexbox>
                    </li>
                  );
                })
            )}
          </ul>
          <Button variant="secondary" className="u-mrgn--left-auto" asChild>
            <Link to={`/events/${eventId}/create-quiz`}>クイズを追加する</Link>
          </Button>
        </Section>
        <Section>
          <SectionTitle level={3}>既に出題したクイズ</SectionTitle>
          <ul>
            {quizzesData
              .filter((quiz) => quiz.hasPresented)
              .map((quiz: QuizDataType) => {
                return (
                  <li
                    key={quiz.quizId}
                    className="p-quizList__item"
                    style={{
                      borderBottom: ".1rem solid var(--c-active)",
                      padding: "1em",
                    }}
                  >
                    <Flexbox>
                      <div
                        style={{
                          width: "100%",
                        }}
                      >
                        <FormRadio
                          name="selectPresentQuiz"
                          id={quiz.quizId}
                          checked={presentQuizId === quiz.quizId}
                          onChange={() => {
                            setPresentQuizId(quiz.quizId);
                          }}
                          style={{ width: "100%" }}
                        >
                          <p className="p-quizList__itemTitle">
                            {quiz.quizTitle}
                          </p>
                        </FormRadio>
                      </div>
                      <IconButton
                        variant="ghost"
                        asChild
                        className="u-mrgn--left-auto"
                      >
                        <Link to={`/events/${eventId}/quizzes/${quiz.quizId}`}>
                          edit
                        </Link>
                      </IconButton>
                    </Flexbox>
                  </li>
                );
              })}
          </ul>
        </Section>
        <Section>
          <SectionTitle level={2}>得点ランキング</SectionTitle>
          {usersData
            .filter((user) => user.role === "player")
            .sort((a, b) => b.score - a.score)
            .map((user, index) => (
              <Flexbox
                key={user.userId}
                style={{
                  alignItems: "center",
                  borderBottom: ".1rem solid var(--c-active)",
                  padding: "1em",
                }}
              >
                <p>{`${index + 1}位`}</p>
                <p>{user.userName}</p>
                <p className="u-mrgn--left-auto" style={{ fontWeight: "700" }}>
                  {user.score}点
                </p>
              </Flexbox>
            ))}
        </Section>
        <Section>
          <Button
            variant="danger"
            className="u-mrgn--left-auto"
            onClick={async () => {
              try {
                const confirm = await AppConfirm({
                  title: "イベントを終了しますか？",
                  description:
                    "一度イベントを終了すると、再度イベントを開始することはできません",
                  confirmText: "終了する",
                });

                if (!confirm) return;

                await updateEventStatus(eventId || "", "finished");
                showToast({
                  title: "イベントを終了しました",
                });
              } catch (err) {
                showToast({
                  title: "エラーが発生しました",
                  message: "時間をおいて再度お試しください",
                  icon: "error",
                });
              }
            }}
          >
            イベントを終了する
          </Button>
        </Section>
      </PageContent>
      <PageFooter>
        <Button
          variant="primary"
          aria-disabled={!presentQuizId || isSubmitting}
          className="u-width--full"
          onClick={async () => {
            try {
              setIsSubmitting(true);

              await updatePresentQuiz(eventId || "", presentQuizId);
              await updateEventStatus(eventId || "", "presentQuiz");
            } catch (err) {
              console.error(err);
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          出題する
        </Button>
      </PageFooter>
    </>
  );
};

export default SelectQuizPanel;
