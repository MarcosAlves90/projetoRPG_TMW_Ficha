import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { StorageAdapter } from "./StorageAdapter.js";

/**
 * Adaptador para sincronização com Firebase Firestore
 * Integra persistência remota com a aplicação
 */
export class FirebaseStorageAdapter extends StorageAdapter {
  constructor(db, userId) {
    super();
    this.db = db;
    this.userId = userId;
    this.collectionName = "userData";
  }

  /**
   * Recupera item do Firestore
   * @param {string} key - Campo a recuperar (ex: "data", "sheets")
   * @returns {Promise<any>}
   */
  async getItem(key) {
    if (!this.userId) {
      console.warn("[Firebase] Usuário não autenticado");
      return null;
    }

    try {
      const docRef = doc(this.db, this.collectionName, this.userId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.debug("[Firebase] Documento não encontrado");
        return null;
      }

      const data = docSnap.data();
      return data?.[key] ?? null;
    } catch (error) {
      // Ignora erros de bloqueador de cliente silenciosamente
      if (error.message?.includes("ERR_BLOCKED_BY_CLIENT")) {
        console.debug(`[Firebase] Carregamento bloqueado por extensão (offline/adblocker)`);
        return null;
      }
      console.error(`[Firebase] Erro ao recuperar "${key}":`, error);
      throw error;
    }
  }

  /**
   * Armazena item no Firestore
   * @param {string} key - Campo a atualizar
   * @param {any} value - Valor a armazenar
   * @returns {Promise<void>}
   */
  async setItem(key, value) {
    if (!this.userId) {
      console.warn("[Firebase] Usuário não autenticado");
      return;
    }

    try {
      const docRef = doc(this.db, this.collectionName, this.userId);

      // Tenta atualizar; se o doc não existe, cria
      await updateDoc(docRef, { [key]: value });
      console.debug(`[Firebase] Campo "${key}" atualizado com sucesso`);
    } catch (error) {
      // Ignora erros de bloqueador de cliente silenciosamente
      if (error.message?.includes("ERR_BLOCKED_BY_CLIENT")) {
        console.debug(`[Firebase] Sincronização bloqueada por extensão (offline/adblocker)`);
        return;
      }

      if (error.code === "not-found") {
        // Documento não existe, criar novo
        try {
          const docRef = doc(this.db, this.collectionName, this.userId);
          await setDoc(docRef, { [key]: value });
          console.debug(`[Firebase] Documento criado com campo "${key}"`);
        } catch (createError) {
          if (!createError.message?.includes("ERR_BLOCKED_BY_CLIENT")) {
            console.error(
              `[Firebase] Erro ao criar documento:`,
              createError,
            );
          }
          throw createError;
        }
      } else if (!error.message?.includes("ERR_BLOCKED_BY_CLIENT")) {
        console.error(`[Firebase] Erro ao salvar "${key}":`, error);
        throw error;
      }
    }
  }

  /**
   * Remove um item do Firestore (opcional)
   * @param {string} key - Campo a remover
   * @returns {Promise<void>}
   */
  async removeItem(key) {
    if (!this.userId) {
      console.warn("[Firebase] Usuário não autenticado");
      return;
    }

    try {
      const docRef = doc(this.db, this.collectionName, this.userId);
      // Firestore não tem deleteField direto, então usa null ou FieldValue.delete()
      await updateDoc(docRef, { [key]: null });
      console.debug(`[Firebase] Campo "${key}" removido`);
    } catch (error) {
      if (!error.message?.includes("ERR_BLOCKED_BY_CLIENT")) {
        console.error(`[Firebase] Erro ao remover "${key}":`, error);
        throw error;
      }
      console.debug(`[Firebase] Remoção bloqueada por extensão`);
    }
  }

  /**
   * Limpa todos os dados do usuário
   * @returns {Promise<void>}
   */
  async clear() {
    if (!this.userId) {
      console.warn("[Firebase] Usuário não autenticado");
      return;
    }

    try {
      const docRef = doc(this.db, this.collectionName, this.userId);
      // Define como vazio em vez de deletar para manter o histórico
      await setDoc(docRef, {});
      console.info("[Firebase] Todos os dados foram limpos");
    } catch (error) {
      console.error("[Firebase] Erro ao limpar dados:", error);
      throw error;
    }
  }

  /**
   * Verifica se uma chave existe
   * @param {string} key - Chave a verificar
   * @returns {Promise<boolean>}
   */
  async hasKey(key) {
    try {
      const data = await this.getItem(key);
      return data !== null && data !== undefined;
    } catch {
      return false;
    }
  }

  /**
   * Atualiza o userId (útil para mudanças de usuário)
   * @param {string} newUserId - Novo ID do usuário
   */
  setUserId(newUserId) {
    this.userId = newUserId;
  }
}
