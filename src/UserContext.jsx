import PropTypes from "prop-types";
import {
  createContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useSyncData } from "@/hooks/useSync.js";
import { syncService } from "@/services/storage/SyncService.js";
import { auth } from "@/firebase.js";

export const UserContext = createContext();

const STORAGE_KEY_USER_DATA = "rogue_userData";
const DEFAULT_USER_DATA = { nivel: 0, sheetCode: null };

/**
 * Provider que gerencia estado global de usuário com sincronização automática
 * Features:
 * - Sincronização automática com Firebase
 * - Fallback automático para localStorage se Firebase falhar
 * - Debounce de 500ms para evitar múltiplas requisições
 * - Retry automático com backoff exponencial
 */
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // Sincroniza dados do usuário com Firebase
  const [userData, setUserData, userDataStatus] = useSyncData(
    STORAGE_KEY_USER_DATA,
    DEFAULT_USER_DATA,
    { debounceMs: 500 },
  );

  /**
   * Monitora mudanças de autenticação
   */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.info("[UserContext] Usuário autenticado:", authUser.uid);
        syncService.setUserId(authUser.uid);
        setUser(authUser);
      } else {
        console.info("[UserContext] Usuário desautenticado");
        syncService.setUserId(null);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  /**
   * Limpa todos os dados do usuário
   */
  const clearUserData = useCallback(async () => {
    try {
      await syncService.clearAll();
      setUserData(DEFAULT_USER_DATA);
      console.info("[UserContext] Dados do usuário limpos");
    } catch (error) {
      console.error("[UserContext] Erro ao limpar dados:", error);
    }
  }, [setUserData]);

  /**
   * Força sincronização imediata
   */
  const forceSync = useCallback(async () => {
    return await userDataStatus.forceSync();
  }, [userDataStatus]);

  const contextValue = useMemo(
    () => ({
      // Estado
      userData,
      user,
      isLoadingUserData: userDataStatus.isLoading,
      isSyncing: userDataStatus.isSyncing,
      syncError: userDataStatus.error,

      // Setters
      setUserData,
      setUser,

      // Controle (forceSync é o novo padrão, forceSave mantido para compatibilidade)
      forceSync,
      forceSave: forceSync,
      clearUserData,
    }),
    [userData, user, userDataStatus, setUserData, forceSync, clearUserData],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
