/**
 * Interface abstrata para implementações de armazenamento
 * Permite trocar a estratégia de storage sem quebrar a aplicação
 */
export class StorageAdapter {
  /**
   * Recupera um item do armazenamento
   * @param {string} _key - Chave do item
   * @returns {Promise<any>} Valor armazenado ou null
   */
  // eslint-disable-next-line no-unused-vars
  async getItem(_key) {
    throw new Error("getItem() deve ser implementado");
  }

  /**
   * Armazena um item
   * @param {string} _key - Chave do item
   * @param {any} _value - Valor a ser armazenado
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line no-unused-vars
  async setItem(_key, _value) {
    throw new Error("setItem() deve ser implementado");
  }

  /**
   * Remove um item
   * @param {string} _key - Chave do item
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line no-unused-vars
  async removeItem(_key) {
    throw new Error("removeItem() deve ser implementado");
  }

  /**
   * Limpa todo o armazenamento
   * @returns {Promise<void>}
   */
  async clear() {
    throw new Error("clear() deve ser implementado");
  }

  /**
   * Verifica se a chave existe
   * @param {string} _key - Chave a verificar
   * @returns {Promise<boolean>}
   */
  // eslint-disable-next-line no-unused-vars
  async hasKey(_key) {
    throw new Error("hasKey() deve ser implementado");
  }
}

/**
 * Implementação de storage usando localStorage
 */
export class LocalStorageAdapter extends StorageAdapter {
  async getItem(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`[LocalStorage] Erro ao recuperar "${key}":`, error);
      return null;
    }
  }

  async setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`[LocalStorage] Erro ao salvar "${key}":`, error);
      if (error.name === "QuotaExceededError") {
        console.warn("[LocalStorage] Quota de armazenamento excedida");
      }
    }
  }

  async removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`[LocalStorage] Erro ao remover "${key}":`, error);
    }
  }

  async clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("[LocalStorage] Erro ao limpar:", error);
    }
  }

  async hasKey(key) {
    return localStorage.getItem(key) !== null;
  }
}

/**
 * Implementação de storage em memória (útil para testes)
 */
export class MemoryStorageAdapter extends StorageAdapter {
  constructor() {
    super();
    this.store = new Map();
  }

  async getItem(key) {
    return this.store.get(key) ?? null;
  }

  async setItem(key, value) {
    this.store.set(key, value);
  }

  async removeItem(key) {
    this.store.delete(key);
  }

  async clear() {
    this.store.clear();
  }

  async hasKey(key) {
    return this.store.has(key);
  }
}
