// components
import {
  Content,
  Header,
  HeaderQuizTitle,
  SpectatorLayout,
} from "../components/SpectatorLayout";
import { Section, SectionTitle } from "../../../../components/Section";

// hooks
import { useLiveEventContext } from "../../../../features/live/hooks/useLiveEventContext";

// types
import type { CSSProperties } from "react";
import type { AnswerDataType } from "../../../../features/live/types/answerTypes";
import Flexbox from "../../../../components/Flexbox";
import { Icon } from "../../../../components/Icon";

const PresentCorrectAnswers = () => {
  const { quizData, answersData } = useLiveEventContext();

  return (
    <SpectatorLayout>
      <Header>
        <HeaderQuizTitle>{quizData?.quizTitle}</HeaderQuizTitle>
      </Header>
      <Content>
        <Section>
          <SectionTitle level={2} className="u-text--center">
            みんなの回答
          </SectionTitle>
          <ul className="p-answersList">
            {answersData?.map((answer: AnswerDataType) => {
              return (
                <li
                  key={answer.userId}
                  className={`p-answersList__item ${answer.isCorrect ? "is--correct" : "is--incorrect"}`}
                >
                  <Flexbox>
                    <Icon
                      style={{ "--sz-icon": "4rem" } as CSSProperties}
                      variant="ghost"
                    >
                      person
                    </Icon>
                    <p>{answer.userName || "ゲストさん"}</p>
                  </Flexbox>
                  <p className="p-answersList__item-answer">{answer.label}</p>
                </li>
              );
            })}
          </ul>
        </Section>
      </Content>
    </SpectatorLayout>
  );
};

export default PresentCorrectAnswers;
