import { useEffect, useRef } from "react";
import { saveUserData } from "@/firebaseUtils.js";

/**
 * Hook para salvamento automático com debounce
 * Salva dados automaticamente após mudanças com delay configurável
 * @param {Object} data - Dados a serem salvos automaticamente
 * @param {number} delayMs - Delay em ms antes de salvar (default: 2000)
 * @returns {Object} { isSaving, error, lastSaved }
 */
export const useAutoSave = (data, delayMs = 2000) => {
  const timeoutRef = useRef(null);
  const stateRef = useRef({
    isSaving: false,
    error: null,
    lastSaved: null,
  });

  useEffect(() => {
    // Limpa timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Configura novo timeout para salvar
    timeoutRef.current = setTimeout(async () => {
      stateRef.current.isSaving = true;

      try {
        const success = await saveUserData(data);
        if (success) {
          stateRef.current.lastSaved = new Date();
          stateRef.current.error = null;
          console.info("[AutoSave] Dados salvos automaticamente");
        } else {
          stateRef.current.error = "Falha ao salvar dados";
        }
      } catch (err) {
        stateRef.current.error = err.message || "Erro desconhecido";
        console.error("[AutoSave] Erro ao salvar:", err);
      } finally {
        stateRef.current.isSaving = false;
      }
    }, delayMs);

    // Cleanup: limpa timeout ao desmontar
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delayMs]);

  return stateRef.current;
};
