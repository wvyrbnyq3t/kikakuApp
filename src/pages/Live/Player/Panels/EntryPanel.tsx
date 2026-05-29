// api
import { entryEvent } from "../../../../features/live/api/userApi";

// components
import { PageContent, PageFooter } from "../../../../components/PageLayout";
import { Button } from "../../../../components/Button";
import { Section } from "../../../../components/Section";
import { FormField, FormLabel, FormText } from "../../../../components/Form";
import { PlayerHeader } from "../PlayerComponents";

// hooks
import { useUserAuth } from "../../../../features/auth/hooks/useUserAuth";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "../../../../components/Toast";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../../../components/Loading";

const EntryPanel = () => {
  const { authUser } = useUserAuth();
  const { eventId } = useParams();
  const { showToast } = useToast();
  const nav = useNavigate();

  const [userName, setUserName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (isSubmitting) return <Loading />;

  return (
    <>
      <PlayerHeader />
      <PageContent>
        <Section>
          <FormField>
            <FormLabel>プレイヤー名を入力する</FormLabel>
            <FormText
              placeholder="プレイヤー名"
              value={userName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUserName(e.target.value)
              }
            />
          </FormField>
          <Button
            variant="tertiary"
            className="u-mrgn--left-auto"
            aria-disabled={isSubmitting || !userName}
            onClick={async () => {
              try {
                setIsSubmitting(true);
                await entryEvent(
                  eventId || "",
                  authUser?.uid || "",
                  userName,
                  "spectator",
                );
                nav(`/events/${eventId}/live/spectator`);
              } catch (err) {
                console.error(err);
                showToast({
                  title: "イベントへの参加に失敗しました",
                  icon: "error",
                });
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            観戦者モードで参加する
          </Button>
        </Section>
      </PageContent>
      <PageFooter>
        <Button
          variant="primary"
          className="u-width--full"
          aria-disabled={!userName || isSubmitting}
          onClick={async () => {
            try {
              setIsSubmitting(true);
              await entryEvent(
                eventId || "",
                authUser?.uid || "",
                userName,
                "player",
              );
              window.location.reload();
            } catch (err) {
              console.error(err);
              showToast({
                title: "イベントへの参加に失敗しました",
                icon: "error",
              });
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          参加する
        </Button>
      </PageFooter>
    </>
  );
};

export default EntryPanel;
