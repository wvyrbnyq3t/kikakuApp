import { LoadingFootPrint } from "../../../../components/Loading";
import { PageContent } from "../../../../components/PageLayout";
import { Section, SectionTitle } from "../../../../components/Section";
import { PlayerHeader } from "../PlayerComponents";

const WaitingPanel = () => {
  return (
    <>
      <PlayerHeader />
      <PageContent>
        <Section>
          <SectionTitle level={2} style={{textAlign: "center"}}>
            イベントが開始するまでお待ちください
          </SectionTitle>
          <div style={{ margin: "var(--space-lg) auto 0" }}>
            <LoadingFootPrint />
          </div>
        </Section>
      </PageContent>
    </>
  );
};

export default WaitingPanel;
