import { useCallback, useRef } from "react";
import { useToast } from "./useToast.js";

/**
 * Hook para gerenciar notificações de salvamento com confirmação
 * Integrado com o sistema de design Toast
 *
 * @param {Function} onSave - Callback chamado quando usuário confirma salvamento
 * @param {number} debounceMs - Delay em ms para detectar mudanças finais
 * @returns {Object} { notifyChange, hasPendingChanges, clearPending, forceSave }
 */
export function useSaveNotification(onSave, debounceMs = 1000) {
  const { toast } = useToast();
  const debounceTimeoutRef = useRef(null);
  const hasPendingRef = useRef(false);
  const onSaveRef = useRef(onSave);
  const toastRef = useRef(toast);
  const debounceMs_Ref = useRef(debounceMs);

  // Atualiza refs quando mudam
  onSaveRef.current = onSave;
  toastRef.current = toast;
  debounceMs_Ref.current = debounceMs;

  /**
   * Notifica usuário sobre mudanças pendentes
   * Sem dependências para evitar loops infinitos
   */
  const notifyChange = useCallback(() => {
    hasPendingRef.current = true;

    // Limpa timeout anterior
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Agenda exibição do toast após o debounce
    debounceTimeoutRef.current = setTimeout(() => {
      console.debug("[useSaveNotification] Exibindo notificação de mudanças");

      // Exibe toast com opções de salvar/descartar
      toastRef.current.confirm(
        "Você tem mudanças não salvas",
        async () => {
          try {
            console.debug("[useSaveNotification] Salvando mudanças");
            hasPendingRef.current = false;
            await onSaveRef.current();
            toastRef.current.success("Dados salvos com sucesso!");
          } catch (error) {
            console.error("[useSaveNotification] Erro ao salvar:", error);
            toastRef.current.error("Erro ao salvar dados");
          }
        },
        "Salvar",
        0, // Sem auto-close
      );
    }, debounceMs_Ref.current);
  }, []);

  /**
   * Limpa notificação e marca como sem mudanças pendentes
   */
  const clearPending = useCallback(() => {
    hasPendingRef.current = false;
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
  }, []);

  /**
   * Força salvamento imediato de mudanças pendentes
   */
  const forceSave = useCallback(async () => {
    if (hasPendingRef.current) {
      clearPending();
      try {
        console.debug("[useSaveNotification] Força salvamento em andamento");
        await onSaveRef.current();
        toastRef.current.success("Dados salvos com sucesso!");
      } catch (error) {
        console.error("[useSaveNotification] Erro ao salvar:", error);
        toastRef.current.error("Erro ao salvar dados");
      }
    }
  }, [clearPending]);

  return {
    notifyChange,
    hasPendingChanges: () => hasPendingRef.current,
    clearPending,
    forceSave,
  };
}


