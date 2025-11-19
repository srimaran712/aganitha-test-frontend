import React from "react";

const baseClasses =
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500";

export function Button({ className = "", children, ...props }) {
  return (
    <button className={`${baseClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}
