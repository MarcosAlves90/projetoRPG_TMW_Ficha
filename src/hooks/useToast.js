import { useContext } from "react";
import { ToastContext } from "@/assets/components/design-system/ToastProvider.jsx";

/**
 * Hook para usar toasts em componentes
 * @returns {Object} { toast, addToast, removeToast, clearAll }
 *
 * @example
 * const { toast } = useToast();
 * toast.success("Sucesso!");
 * toast.error("Erro!");
 * toast.confirm("Deseja continuar?", () => console.log("Confirmou"));
 */
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    console.warn(
      "[useToast] ToastProvider não encontrado. Certifique-se de envolver a aplicação com <ToastProvider>",
    );
    // Fallback para não quebrar a aplicação
    return {
      toast: {
        success: () => {},
        error: () => {},
        warning: () => {},
        info: () => {},
        confirm: () => {},
      },
      addToast: () => {},
      removeToast: () => {},
      clearAll: () => {},
    };
  }

  return context;
}
