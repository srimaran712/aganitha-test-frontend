import React, { createContext, useContext } from "react";

const DialogContext = createContext({ open: false, onOpenChange: () => {} });

export function Dialog({ open, onOpenChange, children }) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ asChild = false, children }) {
  const { open, onOpenChange } = useContext(DialogContext);

  if (!children) return null;

  const handleClick = () => {
    onOpenChange && onOpenChange(!open);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => {
        children.props.onClick && children.props.onClick(e);
        handleClick();
      },
    });
  }

  return (
    <button type="button" onClick={handleClick}>
      {children}
    </button>
  );
}

export function DialogContent({ className = "", children, ...props }) {
  const { open } = useContext(DialogContext);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
      <div
        className={`w-full max-w-lg rounded-lg bg-background text-foreground shadow-lg p-6 ${className}`}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className = "", children, ...props }) {
  return (
    <div className={`mb-4 space-y-1 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function DialogFooter({ className = "", children, ...props }) {
  return (
    <div className={`mt-6 flex justify-end gap-2 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function DialogTitle({ className = "", children, ...props }) {
  return (
    <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
      {children}
    </h2>
  );
}

export function DialogDescription({ className = "", children, ...props }) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`} {...props}>
      {children}
    </p>
  );
}
