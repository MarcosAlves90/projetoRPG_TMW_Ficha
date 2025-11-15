import { useEffect, useRef, useCallback, useState } from "react";

/**
 * Hook para persistência de dados com sincronização automática
 * Gerencia estado local com salvamento debounced
 *
 * @param {DataSyncManager} syncManager - Gerenciador de sincronização
 * @param {string} storageKey - Chave para armazenar dados
 * @param {any} initialValue - Valor inicial padrão
 * @param {Object} options - Opções de configuração
 * @param {number} options.debounceMs - Delay em ms para debounce (padrão: 500)
 * @param {boolean} options.syncImmediately - Sincronizar imediatamente com remoto
 * @param {Function} options.onError - Callback para erros
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

  /**
   * Carrega dados do storage na montagem
   */
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const loadedData = await syncManager.loadData(storageKey, initialValue);
        if (isMounted) {
          setData(loadedData);
        }
      } catch (err) {
        console.error(`[usePersistentData] Erro ao carregar "${storageKey}":`, err);
        if (isMounted) {
          setError(err);
          if (onError) onError(err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    // Cleanup
    return () => {
      isMounted = false;
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
        setError(null);

        // Debounced: salva após delay
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(async () => {
          try {
            await syncManager.saveData(storageKey, valueToSet, syncImmediately);
          } catch (err) {
            console.error(`[usePersistentData] Erro ao salvar "${storageKey}":`, err);
            setError(err);
            if (onError) onError(err);
          }
        }, debounceMs);
      } catch (err) {
        console.error(`[usePersistentData] Erro ao atualizar "${storageKey}":`, err);
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
 *
 * @param {DataSyncManager} syncManager - Gerenciador de sincronização
 * @returns {Object} { sync, status, clearError }
 */
export function useSyncManager(syncManager) {
  const [syncStatus, setSyncStatus] = useState(() =>
    syncManager.getSyncStatus(),
  );
  const [isSyncing, setIsSyncing] = useState(false);

  const sync = useCallback(async () => {
    setIsSyncing(true);
    try {
      const result = await syncManager.syncRemote();
      setSyncStatus(syncManager.getSyncStatus());
      return result;
    } catch (error) {
      console.error("[useSyncManager] Erro durante sincronização:", error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, [syncManager]);

  const clearError = useCallback(() => {
    setSyncStatus(syncManager.getSyncStatus());
  }, [syncManager]);

  return {
    sync,
    status: { ...syncStatus, isSyncing },
    clearError,
  };
}

/**
 * Hook para múltiplas chaves de dados com gerenciamento otimizado
 *
 * @param {DataSyncManager} syncManager - Gerenciador de sincronização
 * @param {Object} dataKeys - Objeto com chaves e valores iniciais
 * @param {Object} options - Opções (debounceMs, etc)
 * @returns {Object} Objeto com dados, setters e status unificado
 */
export function usePersistentDataMultiple(syncManager, dataKeys, options = {}) {
  const { debounceMs = 500 } = options;
  const [dataMap, setDataMap] = useState(() => ({ ...dataKeys }));
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const debounceTimeoutsRef = useRef(new Map());

  /**
   * Carrega múltiplas chaves ao inicializar
   */
  useEffect(() => {
    let isMounted = true;

    const loadAll = async () => {
      try {
        setLoading(true);
        const loaded = {};

        for (const [key, initialValue] of Object.entries(dataKeys)) {
          try {
            loaded[key] = await syncManager.loadData(key, initialValue);
          } catch (err) {
            console.error(`[usePersistentDataMultiple] Erro ao carregar "${key}":`, err);
            if (isMounted) {
              setErrors((prev) => ({ ...prev, [key]: err }));
            }
            loaded[key] = initialValue;
          }
        }

        if (isMounted) {
          setDataMap(loaded);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAll();

    return () => {
      isMounted = false;
    };
  }, [syncManager, dataKeys]);

  /**
   * Setter para uma chave específica com debounce
   */
  const setDataByKey = useCallback(
    (key) => async (newValue) => {
      const valueToSet =
        typeof newValue === "function" ? newValue(dataMap[key]) : newValue;

      setDataMap((prev) => ({ ...prev, [key]: valueToSet }));
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });

      // Limpa timeout anterior se existir
      if (debounceTimeoutsRef.current.has(key)) {
        clearTimeout(debounceTimeoutsRef.current.get(key));
      }

      // Debounced save
      const timeout = setTimeout(async () => {
        try {
          await syncManager.saveData(key, valueToSet, false);
          debounceTimeoutsRef.current.delete(key);
        } catch (err) {
          console.error(`[usePersistentDataMultiple] Erro ao salvar "${key}":`, err);
          setErrors((prev) => ({ ...prev, [key]: err }));
        }
      }, debounceMs);

      debounceTimeoutsRef.current.set(key, timeout);
    },
    [dataMap, syncManager, debounceMs],
  );

  /**
   * Força sincronização de todas as chaves pendentes
   */
  const flushAll = useCallback(async () => {
    // Limpa todos os timeouts pendentes
    for (const [, timeout] of debounceTimeoutsRef.current) {
      clearTimeout(timeout);
    }
    debounceTimeoutsRef.current.clear();

    // Sincroniza com remoto
    return await syncManager.syncRemote();
  }, [syncManager]);

  // Cleanup
  useEffect(() => {
    return () => {
      for (const [, timeout] of debounceTimeoutsRef.current) {
        clearTimeout(timeout);
      }
      debounceTimeoutsRef.current.clear();
    };
  }, []);

  return {
    data: dataMap,
    setDataByKey,
    loading,
    errors,
    flushAll,
  };
}
