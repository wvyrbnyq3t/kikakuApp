import type { ComponentProps } from "react";

const SpectatorLayout = ({ children }: ComponentProps<"div">) => {
  return <div className="l-sp">{children}</div>;
};

const Header = ({ children }: ComponentProps<"header">) => {
  return <header className="l-sp-header">{children}</header>;
};

const HeaderTitle = ({ children }: ComponentProps<"h1">) => {
  return <h1 className="l-sp__title">{children}</h1>;
};

const HeaderQuizTitle = ({ children }: ComponentProps<"h1">) => {
  return <h1 className="l-sp__quizTitle">{children}</h1>;
};

const Content = ({ children }: ComponentProps<"main">) => {
  return <main className="l-sp-content">{children}</main>;
};

export { SpectatorLayout, Header, HeaderTitle, HeaderQuizTitle, Content };
