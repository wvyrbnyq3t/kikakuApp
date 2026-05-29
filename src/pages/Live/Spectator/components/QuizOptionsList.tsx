// css
import "../css/Spectator.css"

// types
import type { QuizOptionType } from "../../../../features/quizzes/types/quizTypes";

const QuizOptionsList = ({ options }: { options: QuizOptionType[] }) => {
  return (
    <ul className="p-options-list">
      {options?.map((option: QuizOptionType, index: number) => {
        return (
          <li key={option.optionId} className="p-option__item">
            <p className="p-option__item-number">{index + 1}</p>
            <p className="p-option__item-label">{option.label}</p>
          </li>
        );
      })}
    </ul>
  );
};

export { QuizOptionsList };