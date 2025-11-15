import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// ============================================================================
// Constants
// ============================================================================

const COLLECTION_NAME = "userData";
const DATA_TYPES = {
  DATA: "data",
  SHEETS: "sheets",
};

// ============================================================================
// Private Helper Functions
// ============================================================================

/**
 * Retrieves the authenticated user's ID.
 * @returns {string | null} User ID if authenticated, null otherwise.
 */
const getAuthenticatedUserId = () => {
  const user = auth.currentUser;
  if (!user) {
    console.warn("[Auth] Usuário não autenticado");
    return null;
  }
  return user.uid;
};

/**
 * Logs error messages with consistent formatting.
 * @param {string} context - Context where the error occurred.
 * @param {Error} error - The error object.
 */
const logError = (context, error) => {
  const errorCode = error?.code ? ` (${error.code})` : "";
  console.error(
    `[Firebase Utils] ${context}${errorCode}`,
    error?.message || error,
  );
};

/**
 * Executes an async function with error handling.
 * @param {Function} fn - Async function to execute.
 * @param {string} errorContext - Context message for error logging.
 * @returns {Promise<any | null>} Result of the function or null on error.
 */
const executeWithErrorHandling = async (fn, errorContext) => {
  try {
    return await fn();
  } catch (error) {
    logError(errorContext, error);
    return null;
  }
};

/**
 * Creates a Firestore document reference for the current user.
 * @param {string} userId - The user's ID.
 * @returns {DocumentReference} Firestore document reference.
 */
const getUserDocRef = (userId) => doc(db, COLLECTION_NAME, userId);

// ============================================================================
// Public API Functions
// ============================================================================

/**
 * Retrieves user data from Firestore.
 * @param {'data' | 'sheets'} type - Type of data to retrieve.
 * @returns {Promise<Object | null>} User data or null if not found/error.
 */
export const getUserData = async (type) => {
  const userId = getAuthenticatedUserId();
  if (!userId) return null;

  if (!Object.values(DATA_TYPES).includes(type)) {
    const validTypes = Object.values(DATA_TYPES).join('" ou "');
    console.warn(
      `[getUserData] Tipo inválido: "${type}". Use "${validTypes}".`,
    );
    return null;
  }

  return executeWithErrorHandling(async () => {
    const userDocRef = getUserDocRef(userId);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      console.info("[getUserData] Documento não encontrado");
      return null;
    }

    return docSnap.data()?.[type] ?? null;
  }, "Erro ao recuperar dados do usuário");
};

/**
 * Saves user data to Firestore.
 * @param {Object} data - Data to save.
 * @returns {Promise<boolean>} True if successful, false otherwise.
 */
export const saveUserData = async (data) => {
  const userId = getAuthenticatedUserId();
  if (!userId) return false;

  return (
    executeWithErrorHandling(async () => {
      const userDocRef = getUserDocRef(userId);
      try {
        await updateDoc(userDocRef, { [DATA_TYPES.DATA]: data });
      } catch (error) {
        if (error.code === "not-found") {
          await setDoc(userDocRef, {
            [DATA_TYPES.DATA]: data,
            [DATA_TYPES.SHEETS]: [],
          });
        } else {
          throw error;
        }
      }
      console.info("[saveUserData] Dados salvos com sucesso");
      return true;
    }, "Erro ao salvar dados do usuário") ?? false
  );
};

/**
 * Creates initial user data structure in Firestore.
 * @returns {Promise<boolean>} True if successful, false otherwise.
 */
export const createUserData = async () => {
  const userId = getAuthenticatedUserId();
  if (!userId) return false;

  return (
    executeWithErrorHandling(async () => {
      const userDocRef = getUserDocRef(userId);
      await setDoc(userDocRef, {
        [DATA_TYPES.DATA]: {},
        [DATA_TYPES.SHEETS]: [],
      });
      console.info("[createUserData] Documento do usuário criado com sucesso");
      return true;
    }, "Erro ao criar dados do usuário") ?? false
  );
};

/**
 * Saves user sheets to Firestore.
 * @param {Array} sheets - Array of sheets to save.
 * @returns {Promise<boolean>} True if successful, false otherwise.
 */
export const saveUserSheets = async (sheets) => {
  const userId = getAuthenticatedUserId();
  if (!userId) return false;

  if (!Array.isArray(sheets)) {
    console.warn('[saveUserSheets] O parâmetro "sheets" deve ser um array');
    return false;
  }

  return (
    executeWithErrorHandling(async () => {
      const userDocRef = getUserDocRef(userId);
      try {
        await updateDoc(userDocRef, { [DATA_TYPES.SHEETS]: sheets });
      } catch (error) {
        if (error.code === "not-found") {
          await setDoc(userDocRef, {
            [DATA_TYPES.DATA]: {},
            [DATA_TYPES.SHEETS]: sheets,
          });
        } else {
          throw error;
        }
      }
      console.info("[saveUserSheets] Fichas salvas com sucesso");
      return true;
    }, "Erro ao salvar fichas do usuário") ?? false
  );
};
