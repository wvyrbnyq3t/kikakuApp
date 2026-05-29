import {
  Content,
  Header,
  HeaderTitle,
  SpectatorLayout,
} from "../components/SpectatorLayout";

import { useLiveEventContext } from "../../../../features/live/hooks/useLiveEventContext";
import { Section, SectionTitle } from "../../../../components/Section";
import UsersList from "../components/UsersList";

const ReadyPanel = () => {
  const { eventData, usersData } = useLiveEventContext();

  return (
    <SpectatorLayout>
      <Header>
        <HeaderTitle>{eventData?.eventTitle}</HeaderTitle>
      </Header>
      <Content>
        <Section>
          <SectionTitle level={2}>プレイヤー</SectionTitle>
          <UsersList users={usersData.filter((t) => t.role === "player")} />
        </Section>
      </Content>
    </SpectatorLayout>
  );
};

export default ReadyPanel;
