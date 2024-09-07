import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AnchorProps {
  to: string;
  title?: string;
  children?: ReactNode;
  className?: string;
  position?: "bottom" | "top" | "left" | "right";
}

export const Anchor = ({
  to,
  title,
  children,
  className,
  position = "top",
}: AnchorProps) => {
  // @ts-expect-error it's here just so tailwind doesn't garbage collect these classes
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const usedClasses = [
    "sidebar-bottom",
    "sidebar-top",
    "sidebar-left",
    "sidebar-right",
  ];
  return (
    <Link className={`sidebar-icon group ${className}`} to={to}>
      {children}
      <span
        className={`sidebar-tooltip sidebar-${position} group-hover:scale-100`}
      >
        {title}
      </span>
    </Link>
  );
};
