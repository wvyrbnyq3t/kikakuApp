import { Button, IconButton } from "../components/Button";
import {
  PageContent,
  PageHeader,
  PageHeaderTitle,
} from "../components/PageLayout";

import { useNavigate } from "react-router-dom";
import { signOut } from "../features/auth/api/authApi";
import { useToast } from "../components/Toast";
import { Section } from "../components/Section";
import { useUserAuth } from "../features/auth/hooks/useUserAuth";
import RequiredSignIn from "./RequiredSignIn";

const Account = () => {
  const nav = useNavigate();
  const { showToast } = useToast();
  const { authUser } = useUserAuth();

  if (!authUser) return <RequiredSignIn />;

  return (
    <>
      <PageHeader position="sticky">
        <PageHeaderTitle>アカウント設定</PageHeaderTitle>
        <IconButton variant="ghost" onClick={() => nav("/")}>
          close
        </IconButton>
      </PageHeader>
      <PageContent>
        <Section>
          <Button
            variant="secondary"
            className="u-mrgn--left-auto"
            onClick={async () => {
              try {
                await signOut();
                nav("/");
              } catch (err) {
                console.error(err);
                showToast({
                  title: "サインアウトに失敗しました",
                  message: "もう一度お試しください",
                });
              }
            }}
          >
            サインアウトする
          </Button>
        </Section>
      </PageContent>
    </>
  );
};

export default Account;
