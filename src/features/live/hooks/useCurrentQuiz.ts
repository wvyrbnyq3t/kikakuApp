// hooks
import { useEffect, useState } from "react";

// types
import type { QuizDataType } from "../../quizzes/types/quizTypes";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../libs/firebase";

const useCurrentQuiz = (eventId: string, quizId: string) => {
  const [quizData, setQuizData] = useState<QuizDataType | null>(null);

  useEffect(() => {
    if (!eventId || !quizId) return;

    const eventDocRef = doc(db, `events/${eventId}`);

    const unsubscribe = onSnapshot(eventDocRef, (ss) => {
      if (!ss.exists()) {
        setQuizData(null);
        return;
      }

      setQuizData(ss.data() as QuizDataType);
    });

    return () => unsubscribe();
  }, [eventId, quizId]);

  return quizData;
};

export { useCurrentQuiz };
