import { useContext } from "react";
import { ToastContext } from "@/assets/components/design-system";

/**
 * Hook to access toast functionality
 * @returns {Object} Object containing toast methods
 */
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
