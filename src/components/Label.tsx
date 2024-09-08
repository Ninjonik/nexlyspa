import { ReactNode } from "react";

interface LabelProps {
  title?: string;
  children?: ReactNode;
  className?: string;
  position?: "bottom" | "top" | "left" | "right";
}

export const Label = ({
  title,
  children,
  className,
  position = "top",
}: LabelProps) => {
  // @ts-expect-error it's here just so tailwind doesn't garbage collect these classes
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const usedClasses = [
    "sidebar-bottom",
    "sidebar-top",
    "sidebar-left",
    "sidebar-right",
  ];
  return (
    <span className={`sidebar-icon group ${className}`}>
      {children}
      <span
        className={`sidebar-tooltip sidebar-${position} group-hover:scale-100`}
      >
        {title}
      </span>
    </span>
  );
};
