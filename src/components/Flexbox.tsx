import type { HTMLAttributes } from "react";

type FlexboxProps = {
  gap?: "xs" | "sm" | "md" | "lg";
} & HTMLAttributes<HTMLDivElement>;

const Flexbox = ({ className, gap, style, ...props }: FlexboxProps) => {
  const classNames = ["l-flexbox", className].filter(Boolean).join(" ");

  return (
    <div
      className={classNames}
      style={
        {
          "--sz-gap": gap ? `var(--space-${gap})` : undefined,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export default Flexbox;
