import { useContext, useEffect, useCallback } from "react";
import { UserContext } from "@/UserContext.jsx";

/**
 * Hook para forçar salvamento de dados antes de desmontar a página
 * Garante que mudanças pendentes sejam salvas ao navegar/sair
 */
export function usePageUnmount() {
  const { forceSave } = useContext(UserContext);

  useEffect(() => {
    return () => {
      // Força salvamento ao desmontar
      forceSave?.();
    };
  }, [forceSave]);
}

/**
 * Hook para sincronização antes de executar ação crítica
 * Use quando precisa garantir salvamento de dados antes de uma operação
 *
 * @param {Function} callback - Função a executar após salvar
 * @returns {Function} Wrapper que salva antes de chamar callback
 *
 * @example
 * const handleLogout = useSyncedAction(async () => {
 *   await logout();
 * });
 */
export function useSyncedAction(callback) {
  const { forceSave } = useContext(UserContext);

  const wrappedCallback = useCallback(
    async (...args) => {
      // Força salvamento pendente primeiro
      if (forceSave) {
        try {
          await forceSave();
        } catch (err) {
          console.warn("[useSyncedAction] Erro ao salvar:", err.message);
        }
      }

      // Executa callback
      return callback(...args);
    },
    [forceSave, callback],
  );

  return wrappedCallback;
}
