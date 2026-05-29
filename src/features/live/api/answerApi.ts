// api
import { fetchEventById } from "../../events/api/eventApi";
import { fetchQuizById } from "../../quizzes/api/quizApi";

// firebase
import {
  collection,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../libs/firebase";

// types
import type { QuizDataType } from "../../quizzes/types/quizTypes";
import type { EventDataType } from "../../events/types/eventTypes";
import type { AnswerDataType } from "../types/answerTypes";

const updateUserAnswer = async (
  eventId: string,
  userId: string,
  answerValue: string,
  aswerLabel: string,
) => {
  try {
    const eventData = (await fetchEventById(eventId)) as EventDataType;
    if (!eventData) throw new Error("イベントが見つかりませんでした");

    const quizData = await fetchQuizById(
      eventId,
      eventData.currentQuizId || "",
    );
    if (!quizData) throw new Error("クイズが見つかりませんでした");

    const userDocRef = doc(db, `events/${eventId}/users/${userId}`);
    const ss = await getDoc(userDocRef);

    if (!ss.exists()) throw new Error("ユーザーが見つかりませんでした");

    const answer: AnswerDataType = {
      isCorrect: false,
      label: aswerLabel,
      updatedAt: serverTimestamp(),
      userId,
      userName: ss.data()?.userName || "ゲストさん",
      value: answerValue,
    };

    await runTransaction(db, async (transaction) => {
      const answerDocRef = doc(
        db,
        `events/${eventId}/quizzes/${eventData.currentQuizId}/answers/${userId}`,
      );

      transaction.set(answerDocRef, answer);
    });
  } catch (err) {
    console.error(err);
  }
};

// userIdを指定して回答を取得する
const fetchUseAnswer = async (
  eventId: string,
  quizId: string,
  userId: string,
) => {
  const docRef = doc(
    db,
    `events/${eventId}/quizzes/${quizId}/answers/${userId}`,
  );
  const ss = await getDoc(docRef);

  if (!ss.exists()) return null;

  return ss.data() as AnswerDataType;
};

const fetchUsersAnaswer = async (eventId: string, quizId: string) => {
  try {
    const eventDocRef = doc(db, "events", eventId);
    const eventSnapshot = await getDoc(eventDocRef);
    if (!eventSnapshot.exists()) return;

    const answersCollectionRef = collection(
      db,
      `events/${eventId}/quizzes/${quizId}/answers`,
    );
    const ss = await getDocs(answersCollectionRef);

    return ss.docs.map((doc) => doc.data() as AnswerDataType);
  } catch (err) {
    console.error(err);
  }
};

// 得点を計算するだけ
const calculateScore = async (
  eventId: string,
  quizId: string,
  userId: string,
) => {
  try {
    const answerData = await fetchUseAnswer(eventId, quizId, userId);
    const isCorrect = answerData?.isCorrect || false;

    if (isCorrect) {
      return 1;
    }
    return 0;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

// 得点を更新するだけ
const updateScore = async (eventId: string, userId: string) => {
  try {
    const eventDocRef = doc(db, "events", eventId);
    const eventData: EventDataType = (
      await getDoc(eventDocRef)
    ).data() as EventDataType;

    if (!eventData) throw new Error("イベントが見つかりませんでした");

    await runTransaction(db, async (transaction) => {
      const userDocRef = doc(db, `events/${eventId}/users/${userId}`);
      const userDoc = await transaction.get(userDocRef);

      if (!userDoc.exists()) throw new Error("ユーザーが見つかりませんでした");

      const userData = userDoc.data();
      const prevScore = userData?.score || 0;
      const newScore =
        prevScore +
        (await calculateScore(eventId, eventData.currentQuizId || "", userId));
      await transaction.update(userDocRef, {
        score: newScore,
        updatedAt: serverTimestamp(),
      });
    });
  } catch (err) {
    console.error(err);
  }
};

const evaluateAnswerTypeSingle = async (eventId: string) => {
  // イベント情報を取得
  const eventDocRef = doc(db, "events", eventId);
  const eventSnapshot = await getDoc(eventDocRef);

  if (!eventSnapshot.exists()) return;
  const eventData = eventSnapshot.data() as EventDataType;

  // クイズの情報
  const quizDocRef = doc(
    db,
    "events",
    eventId,
    "quizzes",
    eventData.currentQuizId || "",
  );
  const quizSnapshot = await getDoc(quizDocRef);

  if (!quizSnapshot.exists()) return;
  const quizData = quizSnapshot.data() as QuizDataType;
  const correctOptionId = quizData.options?.find(
    (option) => option.isCorrect,
  )?.optionId;

  // 回答達を取得する
  const answersCollectionRef = collection(
    db,
    `events/${eventId}/quizzes/${eventData.currentQuizId}/answers`,
  );
  const answersSnapshot = await getDocs(answersCollectionRef);
  const answersData = answersSnapshot.docs.map(
    (doc) => doc.data() as AnswerDataType,
  );

  await runTransaction(db, async (transaction) => {
    answersData.forEach((answer) => {
      const answerDocRef = doc(
        db,
        `events/${eventId}/quizzes/${eventData.currentQuizId}/answers/${answer.userId}`,
      );

      transaction.update(answerDocRef, {
        isCorrect: answer.value === correctOptionId,
        updatedAt: serverTimestamp(),
      });
    });
  });
};

const evaluateAnswerTypeText = async (
  eventId: string,
  userId: string,
  isCorrect: boolean,
) => {
  try {
    const eventDocRef = doc(db, `events/${eventId}`);
    const eventSnapshot = await getDoc(eventDocRef);

    if (!eventSnapshot.exists())
      throw new Error("イベントが見つかりませんでした");
    const eventData = eventSnapshot.data() as EventDataType;

    await runTransaction(db, async (transaction) => {
      const answerDocRef = doc(
        db,
        `events/${eventId}/quizzes/${eventData.currentQuizId}/answers/${userId}`,
      );

      if (!answerDocRef) throw new Error("回答が見つかりませんでした");

      await transaction.update(answerDocRef, {
        isCorrect: isCorrect || false,
        updatedAt: serverTimestamp(),
      });
    });
  } catch (err) {
    console.error(err);
  }
};

export {
  updateUserAnswer,
  fetchUseAnswer,
  fetchUsersAnaswer,
  calculateScore,
  updateScore,
  evaluateAnswerTypeSingle,
  evaluateAnswerTypeText,
};
