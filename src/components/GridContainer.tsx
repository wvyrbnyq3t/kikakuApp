import type { HTMLAttributes } from "react";

type GridContainerProps = {
  rows?: number;
  columns?: number;
  gap?: number | string;
} & HTMLAttributes<HTMLDivElement>;

const GridContaienr = ({
  className,
  columns,
  gap,
  rows,
  style,
  ...props
}: GridContainerProps) => {
  const classNames = ["l-grid-container", className].filter(Boolean).join(" ");

  return (
    <div
      className={classNames}
      style={
        {
          "--grid-columns": columns || undefined,
          "--grid-rows": rows || undefined,
          "--grid-gap": gap
            ? typeof gap === "number"
              ? `${gap}px`
              : gap
            : undefined,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { GridContaienr };
