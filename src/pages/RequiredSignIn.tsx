// apis
import { signInWithGoogle } from "../features/auth/api/authApi";

// components
import {
  PageContent,
  PageFooter,
  PageHeader,
} from "../components/PageLayout";
import { Button, IconButton } from "../components/Button";
import { Section } from "../components/Section";

// hooks
import { useUserAuth } from "../features/auth/hooks/useUserAuth";
import { useNavigate } from "react-router-dom";

const RequiredSignIn = () => {
  const { authUser } = useUserAuth();
  const nav = useNavigate();


  if (!authUser) {
    return (
      <>
        <PageHeader position="sticky">
          <IconButton variant="ghost" onClick={() => nav(-1)}>
            arrow_back_ios_new
          </IconButton>
        </PageHeader>
        <PageContent>
          <Section>
            <p>サインインが必要です</p>
          </Section>
        </PageContent>
        <PageFooter>
          <Button
            variant="primary"
            className="u-width--full"
            onClick={async () => {
              try {
                await signInWithGoogle();
                window.location.reload();
              } catch (err) {
                console.log(err);
              }
            }}
          >
            Googleでサインインする
          </Button>
        </PageFooter>
      </>
    );
  }
};

export default RequiredSignIn;