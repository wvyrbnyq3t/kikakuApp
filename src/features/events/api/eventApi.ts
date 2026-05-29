// libs
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../libs/firebase";

// types
import type { EventDataType, EventStatusType } from "../types/eventTypes";
import type { User } from "firebase/auth";

const fetchOwnerEvents = async (authUser: User | null | undefined) => {
  try {
    const q = query(
      collection(db, "events"),
      where("ownerId", "==", authUser?.uid || ""),
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => doc.data());
  } catch (err) {
    throw err;
  }
};

const fetchEventById = async (eventId: string) => {
  try {
    const docRef = doc(db, `events/${eventId}`);
    const ss = await getDoc(docRef);

    if (!ss.exists()) {
      throw new Error("イベントが見つかりませんでした");
    }

    return ss.data();
  } catch (err) {
    throw err;
  }
};

const updateEventStatus = async (eventId: string, status: EventStatusType) => {
  try {
    const docRef = doc(db, `events/${eventId}`);
    const ss = await getDoc(docRef);

    if (!ss.exists()) {
      throw new Error("イベントが見つかりませんでした");
    }

    await updateDoc(docRef, { status });
  } catch (err) {
    throw err;
  }
};

const createEvent = async (
  eventTitle: string,
  authUser: User | null | undefined,
  description?: string,
) => {
  if (!authUser) {
    throw new Error("イベントを作成するためにはログインが必要です");
  }

  const eventId = crypto.randomUUID();
  const eventData: EventDataType = {
    createdAt: serverTimestamp(),
    currentQuizId: null,
    description: description || "",
    eventId,
    eventTitle,
    ownerId: authUser.uid,
    ownerName: authUser.displayName || "ゲストユーザー",
    status: "draft",
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, `events/${eventId}`), eventData);

    return eventId;
  } catch (err) {
    throw err;
  }
};

const deleteEvent = async (eventId: string) => {
  try {
    runTransaction(db, async (transaction) => {
      const eventDocRef = doc(db, `events/${eventId}`);
      const eventDoc = await transaction.get(eventDocRef);

      if (!eventDoc.exists()) {
        throw new Error("イベントが見つかりませんでした");
      }

      transaction.delete(eventDocRef);
    });
  } catch (err) {
    throw err;
  }
};

export {
  fetchOwnerEvents,
  fetchEventById,
  updateEventStatus,
  createEvent,
  deleteEvent,
};
