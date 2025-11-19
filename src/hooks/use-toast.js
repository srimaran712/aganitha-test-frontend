export function useToast() {
  const toast = ({ title, description, variant }) => {
    // Placeholder implementation – logs to console for now.
    console[variant === "destructive" ? "error" : "log"](
      `[toast] ${title || ""} ${description || ""}`.trim()
    );
  };

  return { toast };
}
