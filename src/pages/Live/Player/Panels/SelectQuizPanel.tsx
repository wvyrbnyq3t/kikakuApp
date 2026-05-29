// components
import { PageContent } from "../../../../components/PageLayout";
import { PlayerHeader } from "../PlayerComponents";
import { Section, SectionTitle } from "../../../../components/Section";
import Flexbox from "../../../../components/Flexbox";

// hooks
import { useLiveEventContext } from "../../../../features/live/hooks/useLiveEventContext";
import { LoadingFootPrint } from "../../../../components/Loading";

const SelectQuizPanel = () => {
  const { usersData } = useLiveEventContext();

  return (
    <>
      <PlayerHeader />
      <PageContent>
        <Section>
          <SectionTitle level={2}>得点ランキング</SectionTitle>
          <ul>
            {usersData
              .filter((user) => user.role === "player")
              .sort((a, b) => b.score - a.score)
              .map((user, index) => (
                <li key={user.userId}>
                  <Flexbox
                    style={{
                      alignItems: "center",
                      borderBottom: ".1rem solid var(--c-active)",
                      padding: "1em",
                    }}
                  >
                    <p>{`${index + 1}位`}</p>
                    <p>{user.userName}</p>
                    <p
                      className="u-mrgn--left-auto"
                      style={{ fontWeight: "700" }}
                    >
                      {user.score}点
                    </p>
                  </Flexbox>
                </li>
              ))}
          </ul>
        </Section>
        <Section style={{ textAlign: "center" }}>
          <p>次の問題が出題されるまでお待ちください</p>
          <div style={{ margin: "var(--space-lg) auto 0" }}>
            <LoadingFootPrint />
          </div>
        </Section>
      </PageContent>
    </>
  );
};

export default SelectQuizPanel;
