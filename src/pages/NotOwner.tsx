import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { PageContent } from "../components/PageLayout";
import { Section, SectionTitle } from "../components/Section";

const NotOwner = () => {
  return (
    <>
      <PageContent>
        <Section>
          <SectionTitle level={2}>権限がありません</SectionTitle>
          <Button variant="primary" className="u-width--full" asChild>
            <Link to="/">トップに戻る</Link>
          </Button>
        </Section>
      </PageContent>
    </>
  );
};

export default NotOwner;
