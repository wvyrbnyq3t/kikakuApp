import type { AnswerDataType } from "../types/answerTypes";
import type { UserDataType } from "../types/userTypes";

const mergeUsersWithAnswers = (
  users: UserDataType[],
  answers: AnswerDataType[],
) => {
  return users.map((user) => {
    const answer = answers.find((ans) => ans.userId === user.userId);
    return {
      ...user,
      answer: answer || null,
    };
  });
};

export { mergeUsersWithAnswers };
