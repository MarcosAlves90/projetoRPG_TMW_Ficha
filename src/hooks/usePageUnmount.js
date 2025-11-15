import { useContext, useEffect } from "react";
import { UserContext } from "@/UserContext.jsx";

/**
 * Hook para garantir sincronização de dados ao sair da página
 * Previne perda de dados ao navegar entre rotas
 *
 * @returns {void}
 */
export function usePageUnmount() {
  const { flushPendingSave } = useContext(UserContext);

  useEffect(() => {
    // Sincroniza dados quando a página está prestes a desmontar
    const handleBeforeUnload = () => {
      // Flush síncrono de dados em processamento
      if (flushPendingSave) {
        flushPendingSave().catch((err) => {
          console.warn("[usePageUnmount] Erro ao sincronizar ao sair:", err);
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // Limpa dados pendentes ao desmontar
      if (flushPendingSave) {
        flushPendingSave().catch((err) => {
          console.warn(
            "[usePageUnmount] Erro ao sincronizar no cleanup:",
            err,
          );
        });
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [flushPendingSave]);
}

/**
 * Hook para sincronização imediata com fallback
 * Use quando precisa garantir salvamento antes de ação crítica
 *
 * @param {Function} callback - Função a executar após sincronizar
 * @returns {Function} Wrapper que sincroniza antes de executar callback
 */
export function useSyncedAction(callback) {
  const { flushPendingSave } = useContext(UserContext);

  const wrappedCallback = async (...args) => {
    if (flushPendingSave) {
      try {
        await flushPendingSave();
      } catch (err) {
        console.warn("[useSyncedAction] Erro ao sincronizar:", err);
      }
    }
    return callback(...args);
  };

  return wrappedCallback;
}
