import { ReactNode } from "react";

interface LabelInputProps {
  placeholder: string;
  type?: "text" | "password" | "email" | "number";
  id?: string;
  name?: string;
  max?: number;
  min?: number;
  step?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  required?: boolean;
  defaultValue?: string | number;
  className?: string;
  icon?: ReactNode;
  value?: any;
  onChange?: (value: any) => void;
}

export const LabelInput = ({
  placeholder,
  type = "text",
  id,
  name,
  icon,
  max,
  min,
  step,
  maxLength,
  minLength,
  pattern,
  defaultValue = "",
  className = "",
  required = true,
  value,
  onChange,
}: LabelInputProps) => {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className={"flex flex-row gap-2 items-center"}>
        {icon} {placeholder}
      </span>
      <input
        type={type}
        id={id}
        name={name}
        className="grow input input-default"
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
        max={max}
        min={min}
        step={step}
        required={required}
        defaultValue={defaultValue}
        pattern={pattern}
        value={value}
        onChange={onChange}
      />
    </label>
  );
};
