import LZString from "lz-string";
import { LocalStorageAdapter } from "./StorageAdapter.js";

/**
 * Gerenciador centralizado de dados com sincronização
 * Responsável pela persistência local e remota
 */
export class DataSyncManager {
  constructor(storageAdapter = null, remoteStorage = null) {
    this.localStorage = storageAdapter || new LocalStorageAdapter();
    this.remoteStorage = remoteStorage; // Pode ser Firebase ou outro backend
    this.syncQueue = [];
    this.isSyncing = false;
    this.lastSyncTime = null;
  }

  /**
   * Recupera dados com fallback: Remoto → Local → Padrão
   * @param {string} key - Chave dos dados
   * @param {any} defaultValue - Valor padrão se não encontrado
   * @returns {Promise<any>}
   */
  async loadData(key, defaultValue = null) {
    try {
      // Tenta carregar do storage remoto primeiro
      if (this.remoteStorage) {
        const remoteData = await this.remoteStorage.getItem(key);
        if (remoteData) {
          // Armazena localmente para offline
          await this.localStorage.setItem(key, remoteData);
          this.lastSyncTime = Date.now();
          return remoteData;
        }
      }

      // Fallback para storage local
      const localData = await this.localStorage.getItem(key);
      return localData ?? defaultValue;
    } catch (error) {
      console.error(`[DataSync] Erro ao carregar dados "${key}":`, error);
      // Último recurso: tenta local mesmo se remoto falhar
      return (await this.localStorage.getItem(key)) ?? defaultValue;
    }
  }

  /**
   * Salva dados localmente com enfileiramento para sincronização remota
   * @param {string} key - Chave dos dados
   * @param {any} value - Valor a salvar
   * @param {boolean} syncImmediately - Se deve sincronizar imediatamente
   * @returns {Promise<boolean>}
   */
  async saveData(key, value, syncImmediately = false) {
    try {
      // Salva localmente primeiro (garante que não há perda de dados)
      await this.localStorage.setItem(key, value);

      // Enfileira para sincronização remota
      if (this.remoteStorage) {
        this.syncQueue.push({ key, value, timestamp: Date.now() });
        if (syncImmediately) {
          await this.syncRemote();
        }
      }

      return true;
    } catch (error) {
      console.error(`[DataSync] Erro ao salvar dados "${key}":`, error);
      return false;
    }
  }

  /**
   * Sincroniza dados enfileirados com storage remoto
   * @returns {Promise<boolean>}
   */
  async syncRemote() {
    if (!this.remoteStorage || this.isSyncing || this.syncQueue.length === 0) {
      return false;
    }

    this.isSyncing = true;
    try {
      const queueToProcess = [...this.syncQueue];
      this.syncQueue = [];

      for (const item of queueToProcess) {
        try {
          await this.remoteStorage.setItem(item.key, item.value);
          this.lastSyncTime = Date.now();
        } catch (error) {
          console.error(
            `[DataSync] Falha ao sincronizar "${item.key}":`,
            error,
          );
          // Recoloca na fila para tentar novamente
          this.syncQueue.push(item);
        }
      }

      return this.syncQueue.length === 0;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Remove dados do storage
   * @param {string} key - Chave dos dados
   * @returns {Promise<void>}
   */
  async removeData(key) {
    await this.localStorage.removeItem(key);
    if (this.remoteStorage) {
      this.syncQueue.push({ key, value: null, isDelete: true });
    }
  }

  /**
   * Limpa todo o storage
   * @returns {Promise<void>}
   */
  async clearAll() {
    await this.localStorage.clear();
    if (this.remoteStorage) {
      this.syncQueue = [{ action: "clearAll", timestamp: Date.now() }];
    }
  }

  /**
   * Retorna status de sincronização
   * @returns {Object}
   */
  getSyncStatus() {
    return {
      isSyncing: this.isSyncing,
      pendingItems: this.syncQueue.length,
      lastSync: this.lastSyncTime,
    };
  }

  /**
   * Define novo adaptador remoto (útil para mudanças de backend)
   * @param {StorageAdapter} adapter
   */
  setRemoteStorage(adapter) {
    this.remoteStorage = adapter;
  }
}

/**
 * Gerenciador de compressão de dados
 * Reduz tamanho dos dados armazenados
 */
export class CompressionManager {
  static COMPRESSION_SIGNATURE = "[LZ]";
  static EXCLUDED_KEYS = [
    "skillsArray",
    "annotationsArray",
    "itemsArray",
    "sheetCode",
  ];

  /**
   * Comprime um valor se for string grande
   * @param {any} value - Valor a comprimir
   * @param {string} key - Chave do valor (para verificar se deve comprimir)
   * @returns {any}
   */
  static compress(value, key = "") {
    if (
      typeof value !== "string" ||
      value.length < 500 ||
      CompressionManager.EXCLUDED_KEYS.includes(key)
    ) {
      return value;
    }

    try {
      const compressed = LZString.compressToUTF16(value);
      return CompressionManager.COMPRESSION_SIGNATURE + compressed;
    } catch (error) {
      console.warn(`[Compression] Falha ao comprimir "${key}":`, error);
      return value;
    }
  }

  /**
   * Descomprime um valor se estiver comprimido
   * @param {any} value - Valor a descomprimir
   * @returns {any}
   */
  static decompress(value) {
    if (typeof value !== "string") return value;

    if (!value.startsWith(CompressionManager.COMPRESSION_SIGNATURE)) {
      return value;
    }

    try {
      const withoutSignature = value.slice(
        CompressionManager.COMPRESSION_SIGNATURE.length,
      );
      return LZString.decompressFromUTF16(withoutSignature);
    } catch (error) {
      console.warn("[Compression] Falha ao descomprimir:", error);
      return value;
    }
  }

  /**
   * Processa recursivamente objeto/array comprimindo valores
   * @param {any} input - Entrada a processar
   * @returns {any}
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
   * @returns {any}
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
