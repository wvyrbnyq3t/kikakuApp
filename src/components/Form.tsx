import type { ComponentProps } from "react";

import "../css/Form.css";

const FormField = ({ className, ...props }: ComponentProps<"div">) => {
  const classNames = ["c-formField", className].filter(Boolean).join(" ");

  return <div className={classNames} {...props} />;
};

const FormLabel = ({ className, ...props }: ComponentProps<"label">) => {
  const classNames = ["c-form__label", className].filter(Boolean).join(" ");

  return <label className={classNames} {...props} />;
};

type FormTextProps = {
  icon?: string;
  maxLength?: number;
} & ComponentProps<"input">;

const FormText = ({ className, style, icon, ...props }: FormTextProps) => {
  const classNames = ["c-form__text", className].filter(Boolean).join(" ");

  return (
    <div className={classNames} style={style}>
      <input
        type="text"
        className={props.value ? "is--filled" : undefined}
        {...props}
      />
    </div>
  );
};

const FormTextarea = ({
  className,
  style,
  ...props
}: ComponentProps<"textarea">) => {
  const classNames = ["c-form__textarea", className].filter(Boolean).join(" ");
  return (
    <div className={classNames} style={style}>
      <textarea className={props.value ? "is--filled" : undefined} {...props} />
    </div>
  );
};

type FormSelectProps = {
  options: { value: string; label: string }[];
} & ComponentProps<"select">;

const FormSelect = ({
  className,
  options,
  style,
  ...props
}: FormSelectProps) => {
  const classNames = ["c-form__select", className].filter(Boolean).join(" ");
  return (
    <div className={classNames} style={style}>
      <select className={props.value ? "is--selected" : undefined} {...props}>
        <option value="">選択してください</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const FormCheckBox = ({
  children,
  className,
  style,
  ...props
}: ComponentProps<"input">) => {
  const classNames = ["c-form__checkbox", className].filter(Boolean).join(" ");

  return (
    <div className={classNames}>
      <label htmlFor={props.id} style={style}>
        <input type="checkbox" {...props} />
        {children}
      </label>
    </div>
  );
};

const FormRadio = ({
  children,
  className,
  style,
  ...props
}: ComponentProps<"input">) => {
  const classNames = ["c-form__radio", className].filter(Boolean).join(" ");

  return (
    <div className={classNames}>
      <label htmlFor={props.id} style={style}>
        <input type="radio" {...props} />
        {children}
      </label>
    </div>
  );
};

export {
  FormField,
  FormLabel,
  FormText,
  FormTextarea,
  FormSelect,
  FormCheckBox,
  FormRadio,
};
