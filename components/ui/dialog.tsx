import React, { ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-background rounded-lg shadow-lg p-6 relative min-w-[300px]">
        <button
          className="absolute top-2 right-2 text-muted-foreground hover:text-primary"
          onClick={onClose}
          aria-label="Close dialog"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`relative bg-background rounded-lg shadow-lg p-6 ${className}`}
  >
    {children}
  </div>
);

export const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 border-b border-border pb-2">{children}</div>
);

export const DialogTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <h2 className={`font-bold text-lg ${className}`}>{children}</h2>;
