import { FieldValue } from "firebase/firestore";

type UserDataType = {
  createdAt: FieldValue | null;
  role: "player" | "spectator" | "admin" | "owner";
  score: number;
  updatedAt: FieldValue | null;
  userId: string;
  userName: string;
};

export type { UserDataType };
