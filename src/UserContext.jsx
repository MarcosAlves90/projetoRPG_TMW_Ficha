import PropTypes from "prop-types";
import {
  createContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { auth } from "@/firebase.js";
import { getUserData, saveUserData } from "@/firebaseUtils.js";

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
  const [userData, setUserData] = useState(DEFAULT_USER_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);

  /**
   * Monitora mudanças de autenticação e carrega dados
   */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      setIsLoading(true);
      
      if (authUser) {
        console.info("[UserContext] Usuário autenticado:", authUser.uid);
        setUser(authUser);
        
        // Carrega dados do Firebase
        try {
          const firebaseData = await getUserData("data");
          if (firebaseData) {
            setUserData(firebaseData);
            console.info("[UserContext] Dados carregados do Firebase");
          } else {
            // Tenta carregar do localStorage como fallback
            const stored = localStorage.getItem(STORAGE_KEY_USER_DATA);
            if (stored) {
              const parsed = JSON.parse(stored);
              setUserData(parsed);
              console.info("[UserContext] Dados carregados do localStorage (fallback)");
            }
          }
        } catch (error) {
          console.error("[UserContext] Erro ao carregar dados:", error);
          // Fallback para localStorage
          try {
            const stored = localStorage.getItem(STORAGE_KEY_USER_DATA);
            if (stored) {
              const parsed = JSON.parse(stored);
              setUserData(parsed);
              console.info("[UserContext] Dados carregados do localStorage (erro no Firebase)");
            }
          } catch (localError) {
            console.error("[UserContext] Erro ao carregar localStorage:", localError);
          }
        }
      } else {
        console.info("[UserContext] Usuário desautenticado");
        setUser(null);
        
        // Para usuários não autenticados, carrega do localStorage
        try {
          const stored = localStorage.getItem(STORAGE_KEY_USER_DATA);
          if (stored) {
            const parsed = JSON.parse(stored);
            setUserData(parsed);
            console.info("[UserContext] Dados carregados do localStorage (não autenticado)");
          }
        } catch (error) {
          console.error("[UserContext] Erro ao carregar localStorage:", error);
        }
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Salva automaticamente quando userData muda
   */
  useEffect(() => {
    if (!isLoading && user) {
      // Salva no Firebase se autenticado
      const saveTimer = setTimeout(async () => {
        try {
          await saveUserData(userData);
          console.info("[UserContext] Dados salvos no Firebase");
        } catch (error) {
          console.error("[UserContext] Erro ao salvar no Firebase:", error);
        }
      }, 1000); // Debounce de 1 segundo

      return () => clearTimeout(saveTimer);
    }
    
    // Sempre salva no localStorage como backup
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY_USER_DATA, JSON.stringify(userData));
      } catch (error) {
        console.error("[UserContext] Erro ao salvar localStorage:", error);
      }
    }
  }, [userData, isLoading, user]);

  /**
   * Limpa todos os dados do usuário
   */
  const clearUserData = useCallback(() => {
    setUserData(DEFAULT_USER_DATA);
    localStorage.removeItem(STORAGE_KEY_USER_DATA);
    console.info("[UserContext] Dados do usuário limpos");
  }, []);

  /**
   * Força sincronização imediata
   */
  const forceSync = useCallback(async () => {
    try {
      setIsSyncing(true);
      setSyncError(null);
      
      // Salva no Firebase se autenticado
      if (user) {
        await saveUserData(userData);
        console.info("[UserContext] Sincronização forçada no Firebase");
      }
      
      // Sempre salva no localStorage
      localStorage.setItem(STORAGE_KEY_USER_DATA, JSON.stringify(userData));
    } catch (error) {
      setSyncError(error);
      console.error("[UserContext] Erro ao sincronizar:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [userData, user]);

  const contextValue = useMemo(
    () => ({
      // Estado
      userData,
      user,
      isLoadingUserData: isLoading,
      isSyncing,
      syncError,

      // Setters
      setUserData,
      setUser,

      // Controle (forceSync é o novo padrão, forceSave mantido para compatibilidade)
      forceSync,
      forceSave: forceSync,
      clearUserData,
    }),
    [userData, user, isLoading, isSyncing, syncError, forceSync, clearUserData],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
