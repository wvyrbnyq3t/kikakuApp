import { isValidElement } from "react";

// Types
import type { ComponentProps, HTMLAttributes } from "react";

// Components
import Slot from "./Slot";

type ButtonProps = {
  asChild?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
  variant: "primary" | "secondary" | "tertiary" | "danger";
} & (
  | ({ asChild: true } & HTMLAttributes<HTMLElement>)
  | ({ asChild?: false } & ComponentProps<"button">)
);

const Button = ({
  asChild,
  children,
  className,
  variant,
  icon,
  iconPosition,
  onClick,
  ...props
}: ButtonProps) => {
  const classNames = [
    "c-button",
    `c-button--${variant}`,
    iconPosition && `c-button--icon-${iconPosition}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleDisable = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    return;
  };

  if (asChild && isValidElement(children)) {
    return (
      <Slot
        className={classNames}
        onClick={props["aria-disabled"] ? handleDisable : onClick}
        aria-disabled={props["aria-disabled"]}
        {...props}
      >
        {children}
      </Slot>
    );
  }

  return (
    <button
      type="button"
      className={classNames}
      aria-disabled={props["aria-disabled"]}
      onClick={props["aria-disabled"] ? handleDisable : onClick}
      {...props}
    >
      {icon && <span className="c-icon c-button__icon">{icon}</span>}
      <span className="c-icon-button__label">{children}</span>
    </button>
  );
};

type IconButtonProps = {
  asChild?: boolean;
  variant: "filled" | "outlined" | "ghost" | "danger";
} & (
  | ({ asChild: true } & HTMLAttributes<HTMLElement>)
  | ({ asChild?: false } & ComponentProps<"button">)
);

const IconButton = ({
  asChild,
  children,
  className,
  onClick,
  variant,
  ...props
}: IconButtonProps) => {
  const classNames = ["c-icon-button", `c-icon-button--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  const handleDisable = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    return;
  };

  if (asChild && isValidElement(children)) {
    return (
      <Slot
        className={classNames}
        onClick={props["aria-disabled"] ? handleDisable : onClick}
        {...props}
      >
        {children}
      </Slot>
    );
  }

  return (
    <button
      type="button"
      className={classNames}
      onClick={props["aria-disabled"] ? handleDisable : onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button, IconButton };
