import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import type { EventStatusType } from "../../events/types/eventTypes";
import { db } from "../../../libs/firebase";

// イベントのステータス更新
const updateLiveEventStatus = async (
  eventId: string,
  status: EventStatusType,
) => {
  const eventRef = doc(db, `events/${eventId}`);

  await runTransaction(db, async (transaction) => {
    const ss = await transaction.get(eventRef);

    if (!ss.exists()) {
      throw new Error("イベントが見つかりませんでした");
    }

    transaction.update(eventRef, { status, updatedAt: serverTimestamp() });
  });
};

// evenIdをquizIdを指定して eventData の currentQuizId を更新する
const updatePresentQuiz = async (eventId: string, quizid: string) => {
  const eventRef = doc(db, `events/${eventId}`);
  const quizRef = doc(db, `events/${eventId}/quizzes/${quizid}`);

  await runTransaction(db, async (transaction) => {
    const eventSnapshot = await transaction.get(eventRef);
    const quizSnapshot = await transaction.get(quizRef);

    if (!eventSnapshot.exists()) {
      throw new Error("イベントが見つかりませんでした");
    }
    if (!quizSnapshot.exists()) {
      throw new Error("クイズが見つかりませんでした");
    }

    transaction.update(eventRef, {
      currentQuizId: quizid,
      updatedAt: serverTimestamp(),
    });
    transaction.update(quizRef, {
      hasPresented: true,
      updatedAt: serverTimestamp(),
    });
  });
};

export { updateLiveEventStatus, updatePresentQuiz };
