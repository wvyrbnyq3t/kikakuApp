import { FieldValue } from "firebase/firestore";

type AnswerDataType = {
  isCorrect: boolean;
  label: string;
  updatedAt: FieldValue | null;
  userId: string;
  userName: string;
  value: string;
};

export type { AnswerDataType };
