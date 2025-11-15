import { useEffect, useRef, useCallback, useState } from "react";

/**
 * Hook para persistência de dados com sincronização
 * Gerencia estado local com salvamento automático
 *
 * @param {DataSyncManager} syncManager - Gerenciador de sincronização
 * @param {string} storageKey - Chave para armazenar dados
 * @param {any} initialValue - Valor inicial padrão
 * @param {Object} options - Opções de configuração
 * @returns {[any, Function, Object]} [valor, setter, status]
 */
export function usePersistentData(
  syncManager,
  storageKey,
  initialValue,
  options = {},
) {
  const { debounceMs = 500, syncImmediately = false, onError = null } = options;

  const [data, setData] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const debounceTimeoutRef = useRef(null);
  const isInitializedRef = useRef(false);

  /**
   * Carrega dados do storage na montagem
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const loadedData = await syncManager.loadData(storageKey, initialValue);
        setData(loadedData);
        isInitializedRef.current = true;
      } catch (err) {
        const errorMsg = `Erro ao carregar dados: ${err.message}`;
        console.error(`[usePersistentData] ${errorMsg}`);
        setError(err);
        if (onError) onError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Cleanup
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [storageKey, initialValue, syncManager, onError]);

  /**
   * Setter com salvamento debounced
   */
  const setPersistentData = useCallback(
    (newValue) => {
      try {
        const valueToSet =
          typeof newValue === "function" ? newValue(data) : newValue;

        // Atualiza estado imediatamente
        setData(valueToSet);

        // Debounced: salva após delay
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(async () => {
          try {
            await syncManager.saveData(storageKey, valueToSet, syncImmediately);
          } catch (err) {
            console.error(`[usePersistentData] Erro ao salvar dados:`, err);
            setError(err);
            if (onError) onError(err);
          }
        }, debounceMs);
      } catch (err) {
        console.error(`[usePersistentData] Erro ao atualizar dados:`, err);
        setError(err);
        if (onError) onError(err);
      }
    },
    [data, storageKey, syncManager, debounceMs, syncImmediately, onError],
  );

  const status = {
    isLoading,
    error,
    isSyncing: syncManager.getSyncStatus().isSyncing,
    pendingSync: syncManager.getSyncStatus().pendingItems,
  };

  return [data, setPersistentData, status];
}

/**
 * Hook para sincronização manual com controle explícito
 * @param {DataSyncManager} syncManager - Gerenciador de sincronização
 * @returns {Object} { sync, status, clearError }
 */
export function useSyncManager(syncManager) {
  const [syncStatus, setSyncStatus] = useState(() =>
    syncManager.getSyncStatus(),
  );

  const sync = useCallback(async () => {
    try {
      const result = await syncManager.syncRemote();
      setSyncStatus(syncManager.getSyncStatus());
      return result;
    } catch (error) {
      console.error("[useSyncManager] Erro durante sincronização:", error);
      throw error;
    }
  }, [syncManager]);

  const clearError = useCallback(() => {
    setSyncStatus(syncManager.getSyncStatus());
  }, [syncManager]);

  return {
    sync,
    status: syncStatus,
    clearError,
  };
}

/**
 * Hook para múltiplas chaves de dados
 * @param {DataSyncManager} syncManager
 * @param {Object} dataKeys - Objeto com chaves e valores iniciais
 * @returns {Object} Objeto com dados, setters e status unificado
 */
export function usePersistentDataMultiple(syncManager, dataKeys) {
  const [dataMap, setDataMap] = useState(() => {
    const initial = {};
    for (const [key, value] of Object.entries(dataKeys)) {
      initial[key] = value;
    }
    return initial;
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  /**
   * Carrega múltiplas chaves ao inicializar
   */
  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        const loaded = {};

        for (const [key, initialValue] of Object.entries(dataKeys)) {
          try {
            loaded[key] = await syncManager.loadData(key, initialValue);
          } catch (err) {
            console.error(`Erro ao carregar "${key}":`, err);
            setErrors((prev) => ({ ...prev, [key]: err }));
            loaded[key] = initialValue;
          }
        }

        setDataMap(loaded);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [syncManager, dataKeys]);

  /**
   * Setter para uma chave específica
   */
  const setDataByKey = useCallback(
    (key) => async (newValue) => {
      const valueToSet =
        typeof newValue === "function" ? newValue(dataMap[key]) : newValue;

      setDataMap((prev) => ({ ...prev, [key]: valueToSet }));

      try {
        await syncManager.saveData(key, valueToSet, false);
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated[key];
          return updated;
        });
      } catch (err) {
        console.error(`Erro ao salvar "${key}":`, err);
        setErrors((prev) => ({ ...prev, [key]: err }));
      }
    },
    [dataMap, syncManager],
  );

  return {
    data: dataMap,
    setDataByKey,
    loading,
    errors,
  };
}
