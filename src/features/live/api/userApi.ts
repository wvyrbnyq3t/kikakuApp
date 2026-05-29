import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../libs/firebase";
import { signInWithAnonymously } from "../../auth/api/authApi";
import { signOut } from "../../auth/api/authApi";

const entryEvent = async (
  eventId: string,
  userId: string,
  userName: string,
  role: "player" | "spectator",
) => {
  try {
    const uid = userId || (await signInWithAnonymously()).uid;
    const docRef = doc(db, `events/${eventId}/users/${uid}`);

    await runTransaction(db, async (transaction) => {
      const ss = await transaction.get(docRef);

      if (ss.exists()) {
        throw new Error("既にイベントに参加しています");
      }

      await transaction.set(docRef, {
        createdAt: serverTimestamp(),
        role,
        score: 0,
        updatedAt: serverTimestamp(),
        userId: uid,
        userName,
      });
    });
  } catch (err) {
    console.error(err);
  }
};

const leaveEvent = async (eventId: string, userId: string) => {
  const docRef = doc(db, `events/${eventId}/users/${userId}`);

  await runTransaction(db, async (transaction) => {
    const ss = await transaction.get(docRef);

    if (!ss.exists()) {
      throw new Error("イベントに参加していません");
    }

    await transaction.delete(docRef);

    const ls = JSON.parse(localStorage.getItem("user") || "{}");
    const signInMethod = ls.signInMethod || "";
    if (signInMethod === "anonymous") {
      await signOut();
    }
  });
};

const isEntryEvent = async (eventId: string, userId: string) => {
  try {
    if (!userId) return false;
    const docRef = doc(db, `events/${eventId}/users/${userId || ""}`);
    const ss = await getDoc(docRef);

    if (!ss.exists()) {
      return false;
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const kickUser = async (eventId: string, userId: string) => {
  const docRef = doc(db, `events/${eventId}/users/${userId}`);

  await runTransaction(db, async (transaction) => {
    const ss = await transaction.get(docRef);

    if (!ss.exists()) {
      throw new Error("ユーザーがイベントに参加していません");
    }

    transaction.delete(docRef);
  });
};

export { entryEvent, leaveEvent, kickUser, isEntryEvent };
