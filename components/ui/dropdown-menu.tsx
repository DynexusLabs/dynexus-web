import type { ReactNode } from "react";

export const DropdownMenu = ({ children }: { children: ReactNode }) => {
  return <div className="relative inline-block">{children}</div>;
};

export const DropdownMenuTrigger = ({
  asChild = false,
  children,
}: {
  asChild?: boolean;
  children: ReactNode;
}) => {
  return asChild ? children : <button type="button">{children}</button>;
};

export const DropdownMenuContent = ({
  children,
  align = "end",
  className = "",
}: {
  children: ReactNode;
  align?: "start" | "end";
  className?: string;
}) => {
  // Simple show/hide logic for demonstration
  // In a real app, you'd want to handle focus, click outside, etc.
  return (
    <div
      className={`absolute z-50 mt-2 min-w-40 ${
        align === "end" ? "right-0" : "left-0"
      } ${className}`}
      role="menu"
    >
      {children}
    </div>
  );
};

export const DropdownMenuItem = ({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <div
    className={`px-4 py-2 cursor-pointer select-none transition-colors rounded-sm ${className}`}
    role="menuitem"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick?.();
      }
    }}
  >
    {children}
  </div>
);

export const DropdownMenuSeparator = ({ className = "" }: { className?: string }) => (
  <div className={`my-1 h-px bg-border ${className}`} />
);
