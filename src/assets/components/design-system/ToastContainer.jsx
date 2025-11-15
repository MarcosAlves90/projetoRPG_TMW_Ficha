import { useState, useCallback, useRef } from "react";
import Toast from "./Toast.jsx";

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  const addToast = useCallback(
    ({
      message,
      variant = "info",
      duration = 4000,
      action,
      actionLabel = "OK",
    }) => {
      const id = toastIdRef.current++;

      setToasts((prev) => [
        ...prev,
        {
          id,
          message,
          variant,
          duration,
          action,
          actionLabel,
        },
      ]);

      return id;
    },
    [],
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    ToastComponent: (
      <div className="fixed bottom-4 right-4 flex flex-col gap-3 max-w-sm z-50">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            variant={toast.variant}
            duration={toast.duration}
            action={toast.action}
            actionLabel={toast.actionLabel}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    ),
    addToast,
    removeToast,
    clearAll,
    toastCount: toasts.length,
  };
}
