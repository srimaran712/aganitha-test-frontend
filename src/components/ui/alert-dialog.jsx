import React, { createContext, useContext } from "react";

const AlertDialogContext = createContext({ open: false, onOpenChange: () => {} });

export function AlertDialog({ open, onOpenChange, children }) {
  return (
    <AlertDialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

export function AlertDialogContent({ className = "", children, ...props }) {
  const { open } = useContext(AlertDialogContext);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
      <div
        className={`w-full max-w-md rounded-lg bg-background text-foreground shadow-lg p-6 ${className}`}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

export function AlertDialogHeader({ className = "", children, ...props }) {
  return (
    <div className={`mb-4 space-y-1 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function AlertDialogFooter({ className = "", children, ...props }) {
  return (
    <div className={`mt-6 flex justify-end gap-2 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function AlertDialogTitle({ className = "", children, ...props }) {
  return (
    <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
      {children}
    </h2>
  );
}

export function AlertDialogDescription({ className = "", children, ...props }) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`} {...props}>
      {children}
    </p>
  );
}

export function AlertDialogAction({ className = "", children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground shadow-sm hover:bg-destructive/90 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function AlertDialogCancel({ className = "", children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-muted ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
