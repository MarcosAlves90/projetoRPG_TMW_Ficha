import PropTypes from "prop-types";
import {
  createContext,
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  DataSyncManager,
  CompressionManager,
} from "@/services/storage/DataSyncManager.js";
import { LocalStorageAdapter } from "@/services/storage/StorageAdapter.js";

export const UserContext = createContext();

const STORAGE_KEY = "rogue_userData";
const DEFAULT_USER_DATA = { nivel: 0, sheetCode: null };

/**
 * Gerenciador singleton de sincronização de dados
 */
let dataSyncManager = null;

const getDataSyncManager = () => {
  if (!dataSyncManager) {
    const storage = new LocalStorageAdapter();
    dataSyncManager = new DataSyncManager(storage);
  }
  return dataSyncManager;
};

/**
 * Recupera dados do storage com descompressão automática
 */
const getInitialUserData = async () => {
  try {
    const syncManager = getDataSyncManager();
    const stored = await syncManager.loadData(STORAGE_KEY, DEFAULT_USER_DATA);
    return stored
      ? CompressionManager.decompressRecursive(stored)
      : DEFAULT_USER_DATA;
  } catch (error) {
    console.error("[UserContext] Erro ao carregar dados iniciais:", error);
    return DEFAULT_USER_DATA;
  }
};

export function UserProvider({ children }) {
  const [userData, setUserDataState] = useState(DEFAULT_USER_DATA);
  const [user, setUser] = useState(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const syncManagerRef = useRef(getDataSyncManager());
  const saveTimeoutRef = useRef(null);
  const userDataRef = useRef(DEFAULT_USER_DATA);

  /**
   * Carrega dados iniciais ao montar o provider
   */
  useEffect(() => {
    const initializeData = async () => {
      try {
        const initialData = await getInitialUserData();
        setUserDataState(initialData);
        userDataRef.current = initialData;
      } catch (error) {
        console.error("[UserContext] Erro ao inicializar dados:", error);
      } finally {
        setIsLoadingUserData(false);
      }
    };

    initializeData();
  }, []);

  /**
   * Synchronizes updated data to storage immediately (without debounce)
   * Garantiza que dados sejam salvos antes de navegar
   */
  const flushPendingSave = useCallback(async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      // Força salvamento imediato
      try {
        const compressedData = CompressionManager.compressRecursive(
          userDataRef.current,
        );
        await syncManagerRef.current.saveData(STORAGE_KEY, compressedData);
      } catch (error) {
        console.error("[UserContext] Erro ao fazer flush de dados:", error);
      }
    }
  }, []);

  /**
   * Setter wrapper que salva dados automaticamente com debounce
   */
  const setUserData = useCallback((newValue) => {
    setUserDataState((prevData) => {
      const updatedData =
        typeof newValue === "function" ? newValue(prevData) : newValue;

      // Atualiza a referência com o estado mais recente
      userDataRef.current = updatedData;

      // Limpa timeout anterior se existir
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Debounced: salva após 300ms (reduzido para melhor responsiveness)
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          const compressedData =
            CompressionManager.compressRecursive(updatedData);
          await syncManagerRef.current.saveData(STORAGE_KEY, compressedData);
        } catch (error) {
          console.error("[UserContext] Erro ao salvar dados:", error);
        }
      }, 300);

      return updatedData;
    });
  }, []);

  /**
   * Setter síncrono para casos urgentes (sem debounce)
   */
  const setUserDataImmediate = useCallback(
    async (newValue) => {
      const updatedData =
        typeof newValue === "function"
          ? newValue(userDataRef.current)
          : newValue;

      setUserDataState(updatedData);
      userDataRef.current = updatedData;

      // Cancela any pending debounced saves
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      try {
        const compressedData =
          CompressionManager.compressRecursive(updatedData);
        await syncManagerRef.current.saveData(
          STORAGE_KEY,
          compressedData,
          true,
        );
      } catch (error) {
        console.error(
          "[UserContext] Erro ao salvar dados imediatamente:",
          error,
        );
        throw error;
      }
    },
    [],
  );

  /**
   * Força sincronização com backend remoto
   */
  const forceSync = useCallback(async () => {
    try {
      // Primeiro, garante que dados pendentes sejam salvos
      await flushPendingSave();
      return await syncManagerRef.current.syncRemote();
    } catch (error) {
      console.error("[UserContext] Erro ao sincronizar:", error);
      return false;
    }
  }, [flushPendingSave]);

  /**
   * Limpa todos os dados do usuário
   */
  const clearUserData = useCallback(async () => {
    try {
      setUserDataState(DEFAULT_USER_DATA);
      userDataRef.current = DEFAULT_USER_DATA;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      await syncManagerRef.current.removeData(STORAGE_KEY);
    } catch (error) {
      console.error("[UserContext] Erro ao limpar dados:", error);
    }
  }, []);

  /**
   * Cleanup ao desmontar - garante que dados pendentes sejam salvos
   */
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      // Força salvamento imediato ao desmontar
      if (Object.keys(userDataRef.current).length > 0) {
        const compressedData = CompressionManager.compressRecursive(
          userDataRef.current,
        );
        syncManagerRef.current.saveData(STORAGE_KEY, compressedData).catch((err) => {
          console.error("[UserContext] Erro ao salvar dados no cleanup:", err);
        });
      }
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      userData,
      setUserData,
      setUserDataImmediate,
      user,
      setUser,
      isLoadingUserData,
      setIsLoadingUserData,
      forceSync,
      flushPendingSave,
      clearUserData,
      getSyncStatus: () => syncManagerRef.current.getSyncStatus(),
    }),
    [
      userData,
      user,
      isLoadingUserData,
      setUserData,
      setUserDataImmediate,
      forceSync,
      flushPendingSave,
      clearUserData,
    ],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
