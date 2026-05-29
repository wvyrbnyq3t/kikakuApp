import { useNavigate } from "react-router-dom";
import { IconButton } from "../components/Button";
import { PageContent, PageHeader } from "../components/PageLayout";
import { Section, SectionTitle } from "../components/Section";

const NotFound = () => {
  const nav = useNavigate();

  return (
    <>
      <PageHeader position="sticky">
        <IconButton
          variant="ghost"
          className="u-mrgn--left-auto"
          onClick={() => nav("/")}
        >
          close
        </IconButton>
      </PageHeader>
      <PageContent>
        <Section>
          <SectionTitle level={2} style={{ textAlign: "center" }}>
            お探しのページは見つかりませんでした
          </SectionTitle>
        </Section>
      </PageContent>
    </>
  );
};

export default NotFound;