import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  transparent?: boolean;
  position?: "bottom" | "top" | "left" | "right";
  text?: string;
  hideText?: boolean;
}

export const Button = ({
  children,
  className,
  transparent = false,
  position = "top",
  text = "",
  hideText = false,
  ...props
}: ButtonProps) => {
  // @ts-expect-error it's here just so tailwind doesn't garbage collect these classes
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const usedClasses = [
    "sidebar-bottom",
    "sidebar-top",
    "sidebar-left",
    "sidebar-right",
  ];

  return (
    <button
      className={`sidebar-icon group button ${transparent && "transparent-button"} ${className}`}
      {...props}
    >
      {children}
      {!hideText && (
        <span
          className={`sidebar-tooltip sidebar-${position} group-hover:scale-100 no-underline`}
        >
          {text}
        </span>
      )}
    </button>
  );
};
