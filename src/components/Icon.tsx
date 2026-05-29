import type { ComponentProps } from "react";

type IconProps = {
  variant: "filled" | "outline" | "ghost";
  round?: boolean;
  size?: "sm" | "md" | "lg";
} & ComponentProps<"span">;

const Icon = ({ className, size, variant, round, ...props }: IconProps) => {
  const classNames = [
    "c-icon",
    size && `c-icon--${size}`,
    variant && `c-icon--${variant}`,
    round && "c-icon--round",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classNames} {...props} />;
};

export { Icon };
