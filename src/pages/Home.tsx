// apis
import { fetchOwnerEvents } from "../features/events/api/eventApi";

// components
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { PageContent } from "../components/PageLayout";
import { Section, SectionTitle } from "../components/Section";

// hooks
import { useEffect, useState } from "react";
import { useUserAuth } from "../features/auth/hooks/useUserAuth";

// types
import type { EventDataType } from "../features/events/types/eventTypes";
import Flexbox from "../components/Flexbox";
import { Avatar, AvatarImage } from "../components/Avatar";
import { signInWithGoogle } from "../features/auth/api/authApi";

const Home = () => {
  const [events, setEvents] = useState<EventDataType[]>([]);
  const { authUser, isAuthLoading } = useUserAuth();
  const onMounted = async () => {
    const events = (await fetchOwnerEvents(authUser)) as EventDataType[];
    setEvents(events);
  };

  useEffect(() => {
    onMounted();
  }, [isAuthLoading]);

  return (
    <>
      <PageContent>
        <Section>
          {authUser ? (
            <Flexbox>
              <Flexbox>
                <Avatar>
                  <AvatarImage src={authUser?.photoURL || ""} />
                </Avatar>
                <p style={{ fontWeight: "700", fontSize: "1.25em" }}>
                  {authUser?.displayName || "ゲストさん"}
                </p>
              </Flexbox>
              <Button variant="tertiary" asChild className="u-mrgn--left-auto">
                <Link to="/account">アカウント設定</Link>
              </Button>
            </Flexbox>
          ) : (
            <Flexbox>
              <Button
                variant="secondary"
                className="u-mrgn--left-auto"
                onClick={async () => {
                  try {
                    await signInWithGoogle();
                    window.location.reload();
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                サインインする
              </Button>
            </Flexbox>
          )}
        </Section>
        <Section>
          <SectionTitle level={2}>作成したイベント</SectionTitle>
          <div>
            {events.filter((t) => t.status === "draft").length === 0 ? (
              <p>イベントがありません</p>
            ) : (
              events
                .filter((t) => {
                  return t.status === "draft";
                })
                .map((event: EventDataType) => {
                  return (
                    <div key={event.eventId}>
                      <Link
                        to={`/events/${event.eventId}`}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "1.25em .5em",
                          borderBottom: ".1rem solid var(--c-text)",
                        }}
                      >
                        {event.eventTitle}
                      </Link>
                    </div>
                  );
                })
            )}
          </div>
          <Button variant="secondary" className="u-width--full" asChild>
            <Link to="/create-event">新しいイベントを作る</Link>
          </Button>
        </Section>
        <Section>
          <Link to="/demo">デモページへ</Link>
        </Section>
      </PageContent>
    </>
  );
};

export default Home;
