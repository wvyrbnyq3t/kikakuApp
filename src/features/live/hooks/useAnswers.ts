// hooks
import { useEffect, useState } from "react";
import type { AnswerDataType } from "../types/answerTypes";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../libs/firebase";

const useAnswers = (eventId: string, quizId: string) => {
  const [answers, setAnswers] = useState<AnswerDataType[] | null>([]);

  useEffect(() => {
    const answersCollectionRef = collection(
      db,
      `events/${eventId}/quizzes/${quizId}/answers`,
    );

    const unsubscribe = onSnapshot(answersCollectionRef, (ss) => {
      const answersData: AnswerDataType[] = [];

      ss.docs.map((doc) => {
        const data = doc.data() as AnswerDataType;
        answersData.push(data);
      });

      setAnswers(answersData);
    });

    return () => unsubscribe();
  }, [eventId, quizId]);

  return answers;
};

export { useAnswers };
