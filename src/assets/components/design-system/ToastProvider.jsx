import PropTypes from "prop-types";
import { createContext, useCallback, useRef, useState } from "react";
import Toast from "./Toast.jsx";

export const ToastContext = createContext();

/**
 * Provider que gerencia notificações toast em toda a aplicação
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  /**
   * Adiciona novo toast
   * @param {Object} config - Configuração do toast
   * @param {string} config.message - Mensagem a exibir
   * @param {string} config.variant - 'success', 'error', 'warning', 'info', 'confirm'
   * @param {number} config.duration - Duração em ms (0 = sem auto-close)
   * @param {Function} config.action - Callback do botão de ação
   * @param {string} config.actionLabel - Label do botão
   */
  const addToast = useCallback(
    ({
      message,
      variant = "info",
      duration = 4000,
      action,
      actionLabel = "OK",
    }) => {
      const id = toastIdRef.current++;

      setToasts((prev) => [...prev, { id, message, variant, duration, action, actionLabel }]);

      return id;
    },
    [],
  );

  /**
   * Atalhos para tipos específicos de toast
   */
  const toast = {
    success: (message, duration = 4000) =>
      addToast({ message, variant: "success", duration }),
    error: (message, duration = 4000) =>
      addToast({ message, variant: "error", duration }),
    warning: (message, duration = 4000) =>
      addToast({ message, variant: "warning", duration }),
    info: (message, duration = 4000) =>
      addToast({ message, variant: "info", duration }),
    confirm: (message, action, actionLabel = "Confirmar", duration = 0) =>
      addToast({
        message,
        variant: "confirm",
        duration,
        action,
        actionLabel,
      }),
  };

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, toast, removeToast, clearAll }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-3 max-w-sm z-50 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast
              message={t.message}
              variant={t.variant}
              duration={t.duration}
              action={t.action}
              actionLabel={t.actionLabel}
              onClose={() => removeToast(t.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
