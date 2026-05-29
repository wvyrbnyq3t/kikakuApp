import { FieldValue } from "firebase/firestore";

type QuizDataType = {
  createdAt: FieldValue | null;
  description: string;
  hasPresented: boolean;
  options: QuizOptionType[] | null;
  updatedAt: FieldValue | null;
  quizId: string;
  quizTitle: string;
  type: "single" | "text" | null;
};

type QuizOptionType = {
  isCorrect: boolean;
  label: string;
  optionId: string;
  value: string;
};

export type { QuizDataType, QuizOptionType };
