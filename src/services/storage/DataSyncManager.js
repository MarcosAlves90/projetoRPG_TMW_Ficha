import LZString from "lz-string";
import { LocalStorageAdapter } from "./StorageAdapter.js";

/**
 * Gerenciador de compressão com suporte a campos customizados
 * Reduz tamanho dos dados armazenados de forma eficiente
 */
export class CompressionManager {
  static COMPRESSION_SIGNATURE = "[LZ]";
  static MIN_SIZE_FOR_COMPRESSION = 500;
  static EXCLUDED_KEYS = [
    "skillsArray",
    "annotationsArray",
    "itemsArray",
    "sheetCode",
  ];

  /**
   * Comprime um valor string se exceder limite de tamanho
   * @param {any} value - Valor a comprimir
   * @param {string} key - Chave do valor
   * @returns {any} Valor comprimido ou original
   */
  static compress(value, key = "") {
    // Não comprime valores pequenos ou tipos excluídos
    if (
      typeof value !== "string" ||
      value.length < this.MIN_SIZE_FOR_COMPRESSION ||
      this.EXCLUDED_KEYS.includes(key)
    ) {
      return value;
    }

    try {
      const compressed = LZString.compressToUTF16(value);
      // Verifica se compressão realmente reduziu o tamanho
      if (compressed.length < value.length) {
        return this.COMPRESSION_SIGNATURE + compressed;
      }
    } catch (error) {
      console.warn(`[Compression] Falha ao comprimir "${key}":`, error);
    }
    return value;
  }

  /**
   * Descomprime um valor se estiver comprimido
   * @param {any} value - Valor a descomprimir
   * @returns {any} Valor descomprimido
   */
  static decompress(value) {
    if (typeof value !== "string" || !value.startsWith(this.COMPRESSION_SIGNATURE)) {
      return value;
    }

    try {
      const withoutSignature = value.slice(this.COMPRESSION_SIGNATURE.length);
      return LZString.decompressFromUTF16(withoutSignature);
    } catch (error) {
      console.warn("[Compression] Falha ao descomprimir:", error);
      return value;
    }
  }

  /**
   * Processa recursivamente objeto/array comprimindo valores grandes
   * @param {any} input - Entrada a processar
   * @returns {any} Entrada com valores comprimidos
   */
  static compressRecursive(input) {
    if (Array.isArray(input)) {
      return input.map((item) => this.compressRecursive(item));
    }

    if (input && typeof input === "object") {
      const result = {};
      for (const [key, value] of Object.entries(input)) {
        if (typeof value === "object" && value !== null) {
          result[key] = this.compressRecursive(value);
        } else if (typeof value === "string") {
          result[key] = this.compress(value, key);
        } else {
          result[key] = value;
        }
      }
      return result;
    }

    return input;
  }

  /**
   * Processa recursivamente objeto/array descomprimindo valores
   * @param {any} input - Entrada a processar
   * @returns {any} Entrada com valores descomprimidos
   */
  static decompressRecursive(input) {
    if (Array.isArray(input)) {
      return input.map((item) => this.decompressRecursive(item));
    }

    if (input && typeof input === "object") {
      const result = {};
      for (const [key, value] of Object.entries(input)) {
        if (typeof value === "object" && value !== null) {
          result[key] = this.decompressRecursive(value);
        } else if (typeof value === "string") {
          result[key] = this.decompress(value);
        } else {
          result[key] = value;
        }
      }
      return result;
    }

    return input;
  }
}

/**
 * Gerenciador centralizado de sincronização de dados com retry automático
 * Responsável pela persistência local e remota com garantia de consistência
 */
export class DataSyncManager {
  constructor(storageAdapter = null, remoteStorage = null) {
    this.localStorage = storageAdapter || new LocalStorageAdapter();
    this.remoteStorage = remoteStorage;
    
    // Fila de sincronização com deduplicação por chave
    this.syncQueue = new Map();
    this.isSyncing = false;
    this.lastSyncTime = null;
    this.retryCount = new Map();
    this.maxRetries = 3;
    this.retryDelay = 1000; // ms
  }

  /**
   * Recupera dados com fallback: Remoto → Local → Padrão
   * Prioriza dados remotos para manter sincronização
   * @param {string} key - Chave dos dados
   * @param {any} defaultValue - Valor padrão se não encontrado
   * @returns {Promise<any>}
   */
  async loadData(key, defaultValue = null) {
    try {
      // Tenta carregar do storage remoto primeiro
      if (this.remoteStorage) {
        try {
          const remoteData = await this.remoteStorage.getItem(key);
          if (remoteData !== null && remoteData !== undefined) {
            // Sincroniza localmente para offline
            await this.localStorage.setItem(key, remoteData);
            this.lastSyncTime = Date.now();
            return remoteData;
          }
        } catch (remoteError) {
          console.warn(`[DataSync] Erro ao carregar remoto "${key}", tentando local:`, remoteError.message);
        }
      }

      // Fallback para storage local
      const localData = await this.localStorage.getItem(key);
      return localData ?? defaultValue;
    } catch (error) {
      console.error(`[DataSync] Erro ao carregar dados "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Salva dados localmente com enfileiramento automático para sincronização remota
   * Usa deduplicação para evitar múltiplas operações da mesma chave
   * @param {string} key - Chave dos dados
   * @param {any} value - Valor a salvar
   * @param {boolean} syncImmediately - Se deve sincronizar imediatamente
   * @returns {Promise<boolean>} Sucesso da operação
   */
  async saveData(key, value, syncImmediately = false) {
    try {
      // Salva localmente primeiro (garante que não há perda de dados)
      await this.localStorage.setItem(key, value);
      console.debug(`[DataSync] Dados "${key}" salvos localmente`);

      // Enfileira para sincronização remota (deduplicação automática)
      if (this.remoteStorage) {
        this.syncQueue.set(key, {
          key,
          value,
          timestamp: Date.now(),
          retries: 0,
        });
        console.debug(`[DataSync] "${key}" enfileirado para sincronização remota`);

        if (syncImmediately) {
          console.debug(`[DataSync] Sincronização imediata solicitada para "${key}"`);
          await this.syncRemote();
        }
      } else {
        console.debug(`[DataSync] Sem storage remoto configurado para "${key}"`);
      }

      return true;
    } catch (error) {
      console.error(`[DataSync] Erro ao salvar dados "${key}":`, error);
      return false;
    }
  }

  /**
   * Sincroniza dados enfileirados com storage remoto com retry automático
   * @returns {Promise<boolean>} true se todos os itens sincronizaram com sucesso
   */
  async syncRemote() {
    if (!this.remoteStorage) {
      console.warn("[DataSync] Nenhum storage remoto configurado");
      return false;
    }

    if (this.isSyncing) {
      console.debug("[DataSync] Sincronização já em andamento");
      return false;
    }

    if (this.syncQueue.size === 0) {
      console.debug("[DataSync] Fila de sincronização vazia");
      return false;
    }

    this.isSyncing = true;
    try {
      const itemsToSync = Array.from(this.syncQueue.values());
      console.info(`[DataSync] Iniciando sincronização de ${itemsToSync.length} item(ns)`);

      for (const item of itemsToSync) {
        await this._syncWithRetry(item);
      }

      const pendingCount = this.syncQueue.size;
      if (pendingCount === 0) {
        this.lastSyncTime = Date.now();
        console.info("[DataSync] ✅ Sincronização completada com sucesso");
        return true;
      }

      console.warn(`[DataSync] ⚠️ Sincronização parcial: ${pendingCount} item(ns) ainda na fila`);
      return false;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Sincroniza um item com retry automático exponencial
   * @private
   * @param {Object} item - Item a sincronizar
   */
  async _syncWithRetry(item) {
    const maxRetries = this.maxRetries;
    let lastError = null;

    while (item.retries < maxRetries) {
      try {
        console.debug(`[DataSync] Sincronizando "${item.key}" (tentativa ${item.retries + 1}/${maxRetries})`);
        await this.remoteStorage.setItem(item.key, item.value);
        
        // Remove da fila após sucesso
        this.syncQueue.delete(item.key);
        this.retryCount.delete(item.key);
        
        console.info(`[DataSync] "${item.key}" sincronizado com sucesso no Firebase`);
        return;
      } catch (error) {
        lastError = error;
        item.retries++;

        if (item.retries < maxRetries) {
          // Aguarda antes de tentar novamente (backoff exponencial)
          const delay = this.retryDelay * Math.pow(2, item.retries - 1);
          console.warn(
            `[DataSync] Erro ao sincronizar "${item.key}": ${error.message}. Tentando novamente em ${delay}ms...`
          );
          await this._sleep(delay);
        }
      }
    }

    // Log do erro final após todas as tentativas
    console.error(
      `[DataSync] Falha ao sincronizar "${item.key}" após ${maxRetries} tentativas. Erro: ${lastError?.message}`,
    );
  }

  /**
   * Utilitário para aguardar um tempo específico
   * @private
   * @param {number} ms - Milissegundos a aguardar
   */
  _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Remove dados do storage local e enfileira para remoção remota
   * @param {string} key - Chave dos dados
   * @returns {Promise<void>}
   */
  async removeData(key) {
    try {
      await this.localStorage.removeItem(key);
      if (this.remoteStorage) {
        this.syncQueue.set(key, {
          key,
          value: null,
          timestamp: Date.now(),
          isDelete: true,
          retries: 0,
        });
      }
    } catch (error) {
      console.error(`[DataSync] Erro ao remover "${key}":`, error);
    }
  }

  /**
   * Limpa todo o storage local e remoto
   * @returns {Promise<void>}
   */
  async clearAll() {
    try {
      await this.localStorage.clear();
      if (this.remoteStorage) {
        this.syncQueue.clear();
      }
    } catch (error) {
      console.error("[DataSync] Erro ao limpar dados:", error);
    }
  }

  /**
   * Retorna status atual de sincronização
   * @returns {Object} Status com isSyncing, pendingItems, lastSync
   */
  getSyncStatus() {
    return {
      isSyncing: this.isSyncing,
      pendingItems: this.syncQueue.size,
      lastSync: this.lastSyncTime,
    };
  }

  /**
   * Define novo adaptador remoto (útil para mudanças de backend)
   * @param {StorageAdapter|null} adapter - Novo adaptador remoto
   */
  setRemoteStorage(adapter) {
    this.remoteStorage = adapter;
    if (adapter) {
      console.info("[DataSync] ✅ Storage remoto configurado", adapter.constructor.name);
    } else {
      console.info("[DataSync] ❌ Storage remoto removido");
    }
  }

  /**
   * Força sincronização mesmo com fila vazia (para testes)
   * @returns {Promise<boolean>}
   */
  async forceSync() {
    return await this.syncRemote();
  }
}
