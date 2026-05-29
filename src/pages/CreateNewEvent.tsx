// components
import { Button, IconButton } from "../components/Button";
import {
  FormField,
  FormLabel,
  FormText,
  FormTextarea,
} from "../components/Form";
import {
  PageContent,
  PageFooter,
  PageHeader,
  PageHeaderTitle,
} from "../components/PageLayout";
import { Section } from "../components/Section";

// hooks
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../features/events/api/eventApi";
import { useUserAuth } from "../features/auth/hooks/useUserAuth";
import { Loading } from "../components/Loading";
import { useToast } from "../components/Toast";
import RequiredSignIn from "./RequiredSignIn";

const CreateNewEvent = () => {
  const { authUser } = useUserAuth();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [eventData, setEventData] = useState<{
    eventTitle: string;
    description: string;
  }>({
    eventTitle: "",
    description: "",
  });
  const nav = useNavigate();

  if (isSubmitting) {
    return <Loading />;
  }
  if (!authUser) return <RequiredSignIn />;

  return (
    <>
      <PageHeader position="sticky">
        <PageHeaderTitle>新規イベント作成</PageHeaderTitle>
        <IconButton
          variant="ghost"
          onClick={() => {
            nav("/");
          }}
        >
          close
        </IconButton>
      </PageHeader>
      <PageContent>
        <Section>
          <FormField>
            <FormLabel htmlFor="eventTitle">イベント名</FormLabel>
            <FormText
              id="eventTitle"
              name="eventTitle"
              value={eventData.eventTitle}
              placeholder="イベント名"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEventData((prev) => ({
                  ...prev,
                  eventTitle: e.target.value,
                }))
              }
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="description">イベント説明文</FormLabel>
            <FormTextarea
              id="description"
              name="description"
              rows={3}
              value={eventData.description}
              placeholder="イベント説明文"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setEventData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </FormField>
        </Section>
      </PageContent>
      <PageFooter>
        <Button
          variant="primary"
          aria-disabled={!eventData.eventTitle || isSubmitting}
          className="u-width--full"
          onClick={async () => {
            try {
              setIsSubmitting(true);
              const eventId = await createEvent(
                eventData.eventTitle,
                authUser,
                eventData.description,
              );
              showToast({
                title: "イベントを作成しました",
                icon: "check",
              });
              nav(`/events/${eventId}`);
            } catch (err) {
              showToast({
                message: "イベントの作成に失敗しました",
                icon: "error",
                title: "エラー",
              });
              throw err;
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          新規イベント作成
        </Button>
      </PageFooter>
    </>
  );
};

export default CreateNewEvent;
