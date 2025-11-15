import PropTypes from "prop-types";
import {
  createContext,
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useSaveNotification } from "@/hooks/useSaveNotification.jsx";

export const UserContext = createContext();

const STORAGE_KEY = "rogue_userData";
const DEFAULT_USER_DATA = { nivel: 0, sheetCode: null };

/**
 * Carrega dados do localStorage
 * @returns {Object}
 */
const getInitialUserData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_USER_DATA;
  } catch (error) {
    console.error("[UserContext] Erro ao carregar dados iniciais:", error);
    return DEFAULT_USER_DATA;
  }
};

/**
 * Provider que gerencia estado global de usuário com salvamento manual
 * Features:
 * - Notificação toast quando há mudanças
 * - Usuário escolhe quando salvar
 * - Salvamento simples em localStorage
 */
export function UserProvider({ children }) {
  const [userData, setUserDataState] = useState(DEFAULT_USER_DATA);
  const [user, setUser] = useState(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  // Ref para rastrear dados para salvamento
  const userDataRef = useRef(DEFAULT_USER_DATA);
  const isMountedRef = useRef(true);
  const notifyChangeRef = useRef(null);

  /**
   * Callback para salvar dados no localStorage
   */
  const performSave = useCallback(async () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userDataRef.current));
      console.info("[UserContext] Dados salvos com sucesso");
      return true;
    } catch (error) {
      console.error("[UserContext] Erro ao salvar dados:", error);
      throw error;
    }
  }, []);

  /**
   * Hook de notificação com salvamento
   */
  const { notifyChange, forceSave } = useSaveNotification(performSave, 1000);

  // Armazena notifyChange em ref para evitar loop infinito
  useEffect(() => {
    notifyChangeRef.current = notifyChange;
  }, [notifyChange]);

  /**
   * Inicializa dados ao montar o provider
   */
  useEffect(() => {
    let isMounted = true;

    try {
      const initialData = getInitialUserData();
      if (isMounted) {
        setUserDataState(initialData);
        userDataRef.current = initialData;
        setIsLoadingUserData(false);
      }
    } catch (error) {
      console.error("[UserContext] Erro ao inicializar dados:", error);
      if (isMounted) {
        setIsLoadingUserData(false);
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Setter com notificação de mudanças
   * Atualiza estado imediatamente e notifica usuário
   * NOTA: Não tem notifyChange nas dependências para evitar loop infinito
   */
  const setUserData = useCallback((newValue) => {
    setUserDataState((prevData) => {
      const updatedData =
        typeof newValue === "function" ? newValue(prevData) : newValue;

      userDataRef.current = updatedData;
      console.debug("[UserContext] Dados atualizados, notificando mudança");

      // Notifica sobre mudanças (usando ref para evitar loop)
      if (notifyChangeRef.current) {
        notifyChangeRef.current();
      }

      return updatedData;
    });
  }, []);

  /**
   * Limpa todos os dados do usuário
   */
  const clearUserData = useCallback(() => {
    try {
      setUserDataState(DEFAULT_USER_DATA);
      userDataRef.current = DEFAULT_USER_DATA;
      localStorage.removeItem(STORAGE_KEY);
      console.info("[UserContext] Dados do usuário limpos");
    } catch (error) {
      console.error("[UserContext] Erro ao limpar dados:", error);
      throw error;
    }
  }, []);

  /**
   * Carrega dados salvos (para recarregar após atualizações)
   */
  const reloadUserData = useCallback(() => {
    try {
      const initialData = getInitialUserData();
      setUserDataState(initialData);
      userDataRef.current = initialData;
    } catch (error) {
      console.error("[UserContext] Erro ao recarregar dados:", error);
    }
  }, []);

  /**
   * Cleanup ao desmontar: força salvamento se houver mudanças
   */
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      // Tenta salvar dados pendentes
      forceSave();
    };
  }, [forceSave]);

  const contextValue = useMemo(
    () => ({
      // Estado
      userData,
      user,
      isLoadingUserData,

      // Setters
      setUserData,
      setUser,
      setIsLoadingUserData,

      // Controle
      forceSave,
      clearUserData,
      reloadUserData,
    }),
    [
      userData,
      user,
      isLoadingUserData,
      setUserData,
      forceSave,
      clearUserData,
      reloadUserData,
    ],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
