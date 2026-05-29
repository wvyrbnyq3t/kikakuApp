import type { QuizDataType } from "../../features/quizzes/types/quizTypes";
import { IconButton } from "../Button";
import Flexbox from "../Flexbox";
import { Link } from "react-router-dom";

import { useLiveEventContext } from "../../features/live/hooks/useLiveEventContext";

const QuizList = ({ eventId }: { eventId: string }) => {
  const { quizzesData } = useLiveEventContext();

  return (
    <ul className="p-quizList">
      {quizzesData === null ? (
        <p>クイズを取得中...</p>
      ) : quizzesData.length === 0 ? (
        <p>クイズがありません</p>
      ) : (
        quizzesData.map((quiz: QuizDataType) => {
          return (
            <li
              key={quiz.quizId}
              className="p-quizList__item"
              style={{
                borderBottom: ".1rem solid var(--c-active)",
                padding: "0.5em 1em",
              }}
            >
              <Flexbox>
                <p className="p-quizList__itemTitle">{quiz.quizTitle}</p>
                <IconButton
                  variant="ghost"
                  asChild
                  className="u-mrgn--left-auto"
                >
                  <Link to={`/events/${eventId}/quizzes/${quiz.quizId}`}>
                    edit
                  </Link>
                </IconButton>
              </Flexbox>
            </li>
          );
        })
      )}
    </ul>
  );
};

export { QuizList };
