import {
  PageContent,
  PageFooter,
  PageHeader,
  PageHeaderTitle,
} from "../../../../components/PageLayout";
import { UserList } from "../../../../components/Live/UserList";
import { Button } from "../../../../components/Button";

// hooks
import { useLiveEventContext } from "../../../../features/live/hooks/useLiveEventContext";
import { Section, SectionTitle } from "../../../../components/Section";
import { useToast } from "../../../../components/Toast";

import { updateEventStatus } from "../../../../features/events/api/eventApi";
import { QuizList } from "../../../../components/Live/QuizList";
import { Link } from "react-router-dom";

const ReadyPanel = () => {
  const { eventData, usersData } = useLiveEventContext();
  const { showToast } = useToast();

  return (
    <>
      <PageHeader position="sticky">
        <PageHeaderTitle>{eventData?.eventTitle}</PageHeaderTitle>
      </PageHeader>
      <PageContent>
        <Section>
          <SectionTitle level={2}>プレイヤー</SectionTitle>
          <UserList users={usersData.filter((t) => t.role === "player")} />
          <Button
            variant="secondary"
            className="u-width--full"
            icon="link_2"
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/kikakuApp/#/events/${eventData?.eventId}/live/player`,
              );
              showToast({
                title: "参加URLをコピーしました",
                icon: "link_2",
                duration: 2000,
              });
            }}
          >
            参加URLをコピーする
          </Button>
        </Section>
        <Section>
          <SectionTitle level={2}>出題するクイズ</SectionTitle>
          <QuizList eventId={eventData?.eventId || ""} />
          <Button variant="secondary" className="u-width--full" asChild>
            <Link to={`/events/${eventData?.eventId || ""}/create-quiz`}>
              クイズを追加する
            </Link>
          </Button>
        </Section>
      </PageContent>
      <PageFooter>
        <Button
          variant="primary"
          className="u-width--full"
          aria-disabled={!usersData.length}
          onClick={async () => {
            try {
              await updateEventStatus(eventData?.eventId || "", "selectQuiz");
            } catch (err) {
              console.error(err);
            }
          }}
        >
          イベントをスタートする
        </Button>
      </PageFooter>
    </>
  );
};

export default ReadyPanel;
