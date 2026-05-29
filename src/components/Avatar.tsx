import type { ComponentProps } from "react";

const Avatar = ({ className, ...props }: ComponentProps<"div">) => {
  const classNames = ["c-avatar", className].filter(Boolean).join(" ");

  return <span className={classNames} {...props} />;
};

const AvatarImage = ({ className, ...props }: ComponentProps<"img">) => {
  const classNames = ["c-avatar__img", className].filter(Boolean).join(" ");

  return <img className={classNames} {...props} />;
};

const AvatarIcon = ({ className, ...props }: ComponentProps<"span">) => {
  const classNames = ["c-avatar__icon", className].filter(Boolean).join(" ");

  return <span className={classNames} {...props} />;
};

export { Avatar, AvatarImage, AvatarIcon };
