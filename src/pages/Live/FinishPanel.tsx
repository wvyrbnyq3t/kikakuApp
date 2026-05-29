// api
import { leaveEvent } from "../../features/live/api/userApi";

import { PageContent } from "../../components/PageLayout";
import { Section, SectionTitle } from "../../components/Section";
import { Button } from "../../components/Button";

import { useNavigate, useParams } from "react-router-dom";
import { useUserAuth } from "../../features/auth/hooks/useUserAuth";

const FinishPanel = () => {
  const nav = useNavigate();
  const { eventId } = useParams();
  const { authUser } = useUserAuth();

  return (
    <>
      <PageContent>
        <Section>
          <SectionTitle level={2} style={{ textAlign: "center" }}>
            参加ありがとうございました
          </SectionTitle>
          <Button
            variant="secondary"
            className="u-width--full"
            onClick={async () => {
              const ls = JSON.parse(localStorage.getItem("user") || "{}");
              const signInMethod = ls.signInMethod;

              if (signInMethod === "anonymous") {
                await leaveEvent(eventId || "", authUser?.uid || "");
              }

              nav("/");
            }}
          >
            Homeに戻る
          </Button>
        </Section>
      </PageContent>
    </>
  );
};

export default FinishPanel;
