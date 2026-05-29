import type { ComponentProps, HTMLAttributes } from "react";

const Section = ({ className, ...props }: ComponentProps<"section">) => {
  const classNames = ["l-section", className].filter(Boolean).join(" ");

  return <section className={classNames} {...props} />;
};

type SectionTitleProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
} & HTMLAttributes<HTMLHeadingElement>;

const SectionTitle = ({ level, className, ...props }: SectionTitleProps) => {
  const classNames = ["l-section__title", className].filter(Boolean).join(" ");
  const Tag = `h${level}` as const;

  return <Tag className={classNames} {...props} />;
};

export { Section, SectionTitle };
