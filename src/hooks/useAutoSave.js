import { useEffect, useRef, useState, useCallback } from "react";
import { saveUserData } from "@/firebaseUtils.js";

/**
 * Hook para salvamento automático com debounce e retry
 * Salva dados automaticamente após mudanças com delay configurável
 * @param {Object} data - Dados a serem salvos automaticamente
 * @param {number} delayMs - Delay em ms antes de salvar (default: 2000)
 * @param {number} maxRetries - Número máximo de tentativas (default: 3)
 * @returns {Object} { isSaving, error, lastSaved, saveNow }
 */
export const useAutoSave = (data, delayMs = 2000, maxRetries = 3) => {
  const timeoutRef = useRef(null);
  const retryCountRef = useRef(0);
  const saveQueueRef = useRef(false);
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);

  /**
   * Executa o salvamento com retry automático
   */
  const executeSave = useCallback(async (dataToSave, retryCount = 0) => {
    // Previne saves simultâneos
    if (saveQueueRef.current) {
      console.info("[AutoSave] Save já em andamento, aguardando...");
      return;
    }

    saveQueueRef.current = true;
    setIsSaving(true);
    setError(null);

    try {
      const success = await saveUserData(dataToSave);
      if (success) {
        setLastSaved(new Date());
        setError(null);
        retryCountRef.current = 0;
        console.info("[AutoSave] Dados salvos automaticamente");
      } else {
        throw new Error("Falha ao salvar dados");
      }
    } catch (err) {
      const errorMsg = err.message || "Erro desconhecido";
      console.error("[AutoSave] Erro ao salvar:", err);

      // Retry com backoff exponencial
      if (retryCount < maxRetries) {
        const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 10000);
        console.info(
          `[AutoSave] Tentando novamente em ${backoffDelay}ms (tentativa ${retryCount + 1}/${maxRetries})`,
        );
        
        setTimeout(() => {
          executeSave(dataToSave, retryCount + 1);
        }, backoffDelay);
      } else {
        setError(errorMsg);
        retryCountRef.current = 0;
      }
    } finally {
      setIsSaving(false);
      saveQueueRef.current = false;
    }
  }, [maxRetries]);

  /**
   * Força salvamento imediato
   */
  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    executeSave(data);
  }, [data, executeSave]);

  useEffect(() => {
    // Limpa timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Configura novo timeout para salvar
    timeoutRef.current = setTimeout(() => {
      executeSave(data);
    }, delayMs);

    // Cleanup: limpa timeout ao desmontar
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delayMs, executeSave]);

  return { isSaving, error, lastSaved, saveNow };
};
