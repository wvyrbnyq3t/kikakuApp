import type { FieldValue } from "firebase/firestore";

type EventDataType = {
  createdAt: FieldValue | null;
  currentQuizId: string | null;
  description: string;
  eventId: string;
  eventTitle: string;
  ownerId: string;
  ownerName: string;
  status: EventStatusType;
  updatedAt: FieldValue | null;
};

type EventStatusType =
  | "draft"
  | "ready"
  | "selectQuiz"
  | "presentQuiz"
  | "presentUsersAnswer"
  | "presentCorrectAnswers"
  | "finished"
  ;

export type { EventDataType, EventStatusType };
