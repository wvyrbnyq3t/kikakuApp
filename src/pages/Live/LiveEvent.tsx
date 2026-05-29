// apis
import { signOut } from "../../features/auth/api/authApi";

// components
import { Section, SectionTitle } from "../../components/Section";
import { Loading } from "../../components/Loading";
import { PageContent } from "../../components/PageLayout";
import { Button } from "../../components/Button";

// firebase
import { db } from "../../libs/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";

// hooks
import { useEffect, useState } from "react";
import { useParams, Outlet, useNavigate } from "react-router-dom";

// types
import type { EventDataType } from "../../features/events/types/eventTypes";
import type { QuizDataType } from "../../features/quizzes/types/quizTypes";
import type { UserDataType } from "../../features/live/types/userTypes";
import type { AnswerDataType } from "../../features/live/types/answerTypes";

type LiveEventContextType = {
  answersData: AnswerDataType[] | null;
  eventData: EventDataType | null;
  usersData: UserDataType[];
  quizzesData: QuizDataType[];
  quizData: QuizDataType | null;
  status: LoadStatus;
  error: Error | null;
};

type LoadStatus = "loading" | "success" | "error" | "notFound";

const LiveEvent = () => {
  const { eventId } = useParams();
  const nav = useNavigate();

  const [answersData, setAnswersData] = useState<AnswerDataType[] | null>(null);
  const [eventData, setEventData] = useState<EventDataType | null>(null);
  const [usersData, setUsersData] = useState<UserDataType[]>([]);
  const [quizzesData, setQuizzesData] = useState<QuizDataType[]>([]);
  const [quizData, setQuizData] = useState<QuizDataType | null>(null);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      if (!eventId) {
        setStatus("notFound");
        return;
      }

      setStatus("loading");
      setError(null);

      let isEventLoaded = false;
      let isUsersLoaded = false;
      let isQuizzesLoaded = false;

      const updateStatusIfReady = () => {
        if (isEventLoaded && isUsersLoaded && isQuizzesLoaded) {
          setStatus("success");
        }
      };

      const answersCollectionRef = collection(
        db,
        `events/${eventId}/quizzes/${eventData?.currentQuizId || "0"}/answers`,
      );
      const eventDocRef = doc(collection(db, "events"), eventId);
      const usersCollectionRef = collection(db, `events/${eventId}/users`);
      const quizzesCollectionRef = collection(db, `events/${eventId}/quizzes`);
      const quizDocRef = doc(
        db,
        `events/${eventId}/quizzes/${eventData?.currentQuizId || "0"}`,
      );

      const unsubscribeEventData = onSnapshot(eventDocRef, (ss) => {
        if (!ss.exists()) {
          setStatus("notFound");
          return;
        }

        const data = ss.data() as EventDataType;
        setEventData(data);
        isEventLoaded = true;
        updateStatusIfReady();
      });

      const unsubscribeUsersData = onSnapshot(
        usersCollectionRef,
        (querySnapshot) => {
          const users: UserDataType[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data() as UserDataType;
            users.push(data);
          });
          setUsersData(users);
          isUsersLoaded = true;
          updateStatusIfReady();
        },
      );

      const unsubscribeQuizzesData = onSnapshot(
        quizzesCollectionRef,
        (querySnapshot) => {
          const quizzes: QuizDataType[] = [];
          querySnapshot.forEach((doc) => {
            quizzes.push(doc.data() as QuizDataType);
          });
          setQuizzesData(quizzes);
          isQuizzesLoaded = true;
          updateStatusIfReady();
        },
      );

      const unsubscribeQuizData = onSnapshot(quizDocRef, (ss) => {
        if (!ss.exists()) {
          setQuizData(null);
          return;
        }

        const data = ss.data() as QuizDataType;
        setQuizData(data);
      });

      const unsubscribeAnswersData = onSnapshot(
        answersCollectionRef,
        (querySnapshot) => {
          const answers: AnswerDataType[] = [];
          querySnapshot.forEach((doc) => {
            answers.push(doc.data() as AnswerDataType);
          });
          setAnswersData(answers);
        },
      );

      return () => {
        unsubscribeEventData();
        unsubscribeUsersData();
        unsubscribeQuizzesData();
        unsubscribeQuizData();
        unsubscribeAnswersData();
      };
    } catch (err) {
      console.error(err);
      setError(err as Error);
      setStatus("error");
    }
  }, [eventId, eventData?.currentQuizId]);

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "notFound") {
    return (
      <>
        <PageContent>
          <Section>
            <SectionTitle level={2}>
              イベントが見つかりませんでした
            </SectionTitle>
            <Button
              variant="secondary"
              className="u-width--full"
              onClick={async () => {
                try {
                  const signInMethod = JSON.parse(
                    localStorage.getItem("user") || "[]",
                  ).signInMethod;

                  if (signInMethod === "anonymous") {
                    await signOut();
                  }

                  nav("/");
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              Home に戻る
            </Button>
          </Section>
        </PageContent>
      </>
    );
  }

  return (
    <Outlet
      context={{
        eventData,
        usersData,
        quizzesData,
        quizData,
        status,
        error,
        answersData,
      }}
    />
  );
};

export { LiveEvent };
export type { LiveEventContextType };
