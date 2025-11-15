import { useContext } from "react";
import { ToastContext } from "@/assets/components/design-system";

/**
 * Hook para acessar funcionalidades de toast
 * @returns {Object} { addToast, toast, removeToast, clearAll }
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  
  return context;
};
