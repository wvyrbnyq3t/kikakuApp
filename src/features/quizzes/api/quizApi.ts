import {
  collection,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../libs/firebase";
import type { QuizDataType, QuizOptionType } from "../types/quizTypes";

const fetchQuizzesByEventId = async (eventId: string) => {
  try {
    const collectionRef = collection(db, `events/${eventId}/quizzes`);
    const ss = await getDocs(collectionRef);

    return ss.docs.map((doc) => doc.data());
  } catch (err) {
    throw err;
  }
};

const fetchQuizById = async (eventId: string, quizId: string) => {
  try {
    const docRef = doc(db, `events/${eventId}/quizzes/${quizId}`);
    const ss = await getDoc(docRef);

    if (!ss.exists()) {
      throw new Error("クイズが見つかりませんでした");
    }

    return ss.data();
  } catch (err) {
    throw err;
  }
};

const createQuiz = async (
  eventId: string,
  quizTitle: string,
  type: "single" | "text",
  description?: string,
  options?: QuizOptionType[] | null,
) => {
  try {
    const quizId = crypto.randomUUID();
    const quizData: QuizDataType = {
      createdAt: serverTimestamp(),
      description: description || "",
      hasPresented: false,
      options: options || null,
      updatedAt: serverTimestamp(),
      quizId,
      quizTitle,
      type,
    };
    const docRef = doc(db, `events/${eventId}/quizzes/${quizId}`);
    await setDoc(docRef, quizData);

    return quizData;
  } catch (err) {
    throw err;
  }
};

const updateQuiz = async (
  eventId: string,
  quizId: string,
  quizTitle?: string,
  type?: "single" | "text" | "vote",
  description?: string,
  options?: QuizOptionType[] | null,
) => {
  try {
    const docRef = doc(db, `events/${eventId}/quizzes/${quizId}`);

    await updateDoc(docRef, {
      quizTitle,
      description,
      options,
      type,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    throw err;
  }
};

const deleteQuiz = async (eventId: string, quizId: string) => {
  try {
    const docRef = doc(db, `events/${eventId}/quizzes/${quizId}`);
    await runTransaction(db, async (transaction) => {
      const ss = await transaction.get(docRef);

      if (!ss.exists()) {
        throw new Error("クイズが見つかりませんでした");
      }

      transaction.delete(docRef);
    });
  } catch (err) {
    throw err;
  }
};

export {
  fetchQuizzesByEventId,
  fetchQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
};
