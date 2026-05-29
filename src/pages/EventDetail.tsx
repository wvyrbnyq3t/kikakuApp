// apis
import {
  deleteEvent,
  fetchEventById,
  updateEventStatus,
} from "../features/events/api/eventApi";
import { fetchQuizzesByEventId } from "../features/quizzes/api/quizApi";

// components
import {
  PageContent,
  PageFooter,
  PageHeader,
  PageHeaderTitle,
} from "../components/PageLayout";
import { Button, IconButton } from "../components/Button";
import { Link } from "react-router-dom";
import { AppConfirm } from "../libs/dialog/AppConfirm";

// hooks
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";

// types
import type { EventDataType } from "../features/events/types/eventTypes";
import { Section, SectionTitle } from "../components/Section";
import type { QuizDataType } from "../features/quizzes/types/quizTypes";
import { useUserAuth } from "../features/auth/hooks/useUserAuth";
import RequiredSignIn from "./RequiredSignIn";

const EventDetail = () => {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState<EventDataType | null>(null);
  const [quizzes, setQuizzes] = useState<QuizDataType[]>([]);
  const { authUser} = useUserAuth();

  const nav = useNavigate();

  const { showToast } = useToast();

  const onMounted = async () => {
    if (!eventId) return;

    const event = (await fetchEventById(eventId)) as EventDataType;
    setEventData(event);

    const quizzes = (await fetchQuizzesByEventId(eventId)) as QuizDataType[];
    setQuizzes(quizzes);
  };

  useEffect(() => {
    onMounted();
  }, [eventId]);

  if (!authUser) return <RequiredSignIn />;
  return (
    <>
      <PageHeader position="sticky">
        <PageHeaderTitle>{eventData?.eventTitle}</PageHeaderTitle>
        <IconButton
          variant="ghost"
          onClick={() => {
            nav("/");
          }}
        >
          close
        </IconButton>
      </PageHeader>
      <PageContent>
        <Section>
          <SectionTitle level={2}>出題クイズ</SectionTitle>
          {quizzes.length === 0 ? (
            <p>クイズがありません</p>
          ) : (
            <div>
              {quizzes.map((quiz: QuizDataType) => {
                return (
                  <div key={quiz.quizId}>
                    <Link
                      to={`/events/${eventId}/quizzes/${quiz.quizId}`}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "1.25em .5em",
                        borderBottom: ".1rem solid var(--c-text)",
                      }}
                    >
                      {quiz.quizTitle}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
          <Button variant="secondary" className="u-width--full" asChild>
            <Link to={`/events/${eventId}/create-quiz`}>クイズを追加する</Link>
          </Button>
        </Section>
        <Section>
          <SectionTitle level={2}>設定</SectionTitle>
          <Button
            variant="danger"
            className="u-mrgn--left-auto"
            onClick={async () => {
              try {
                const confirm = await AppConfirm({
                  title: "イベントを削除しますか？",
                  description: "一度実行すると元には戻せません",
                });

                if (!confirm) return;

                await deleteEvent(eventId || "");
                showToast({
                  title: `${eventData?.eventTitle}を削除しました`,
                  icon: "check",
                });
                nav("/");
              } catch (err) {
                console.error(err);
                showToast({
                  title: "イベントの削除に失敗しました",
                  icon: "error",
                });
              }
            }}
          >
            イベントを削除する
          </Button>
        </Section>
      </PageContent>
      <PageFooter>
        <Button
          variant="primary"
          className="u-width--full"
          aria-disabled={eventData?.status !== "draft"}
          onClick={async () => {
            try {
              const confirm = await AppConfirm({
                title: "イベントを開始しまか？",
              });

              if (!confirm) return;

              await updateEventStatus(eventId || "", "ready");
              showToast({
                title: `${eventData?.eventTitle}を開始しました`,
                icon: "check",
              });
              nav(`/events/${eventId}/live/admin`);
            } catch (err) {
              console.error(err);
              showToast({
                title: "イベントの開始に失敗しました",
                message: "時間をおいて再度お試しください",
                icon: "error",
              });
            }
          }}
        >
          イベントをスタートする
        </Button>
      </PageFooter>
    </>
  );
};

export default EventDetail;
