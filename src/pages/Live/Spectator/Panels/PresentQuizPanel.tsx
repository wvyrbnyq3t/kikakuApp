// components
import {
  SpectatorLayout,
  Header,
  HeaderTitle,
  Content,
} from "../components/SpectatorLayout";
import { Section, SectionTitle } from "../../../../components/Section";
import { QuizOptionsList } from "../components/QuizOptionsList";

// types
import { useLiveEventContext } from "../../../../features/live/hooks/useLiveEventContext";

const PresentQuizPanel = () => {
  const { quizData } = useLiveEventContext();

  return (
    <SpectatorLayout>
      <Header>
        <HeaderTitle>{quizData?.quizTitle}</HeaderTitle>
      </Header>
      <Content>
        <Section>
          <SectionTitle className="u-text--center" level={2}>
            選択肢
          </SectionTitle>
          <QuizOptionsList options={quizData?.options || []} />
        </Section>
      </Content>
    </SpectatorLayout>
  );
};

export default PresentQuizPanel;
