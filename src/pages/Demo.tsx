import { Button, IconButton } from "../components/Button";
import {
  PageContent,
  PageFooter,
  PageHeader,
  PageHeaderTitle,
} from "../components/PageLayout";

const Demo = () => {
  return (
    <>
      <PageHeader position="sticky">
        <PageHeaderTitle>イベントを編集する</PageHeaderTitle>
        <IconButton variant="ghost">close</IconButton>
      </PageHeader>
      <PageContent></PageContent>
      <PageFooter>
        <Button
          variant="primary"
          className="u-width--full"
          onClick={() => {
            document.fullscreenElement
              ? document.exitFullscreen()
              : document.documentElement.requestFullscreen();
          }}
        >
          フルスクリーンにする
        </Button>
      </PageFooter>
    </>
  );
};

export default Demo;
