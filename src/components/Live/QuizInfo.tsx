import type { QuizDataType } from "../../features/quizzes/types/quizTypes";

const QuizInfo = ({ quizData }: { quizData: QuizDataType | null }) => {
  if (!quizData) {
    return null;
  }
  return (
    <header className="p-quizInfo">
      <h2 className="p-quizInfo__title">{quizData.quizTitle}</h2>
      {quizData.description && (
        <p className="p-quizInfo__description">{quizData.description}</p>
      )}
    </header>
  );
};

export { QuizInfo };
