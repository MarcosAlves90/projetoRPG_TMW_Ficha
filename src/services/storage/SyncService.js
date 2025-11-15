import { saveUserData, getUserData } from "@/firebaseUtils.js";

/**
 * Service for synchronizing data between localStorage and Firebase
 */
class SyncService {
  constructor() {
    this.userId = null;
    this.syncInProgress = new Map();
  }

  /**
   * Set the current user ID
   * @param {string|null} userId
   */
  setUserId(userId) {
    this.userId = userId;
  }

  /**
   * Sync data to Firebase
   * @param {string} key - Storage key
   * @param {*} data - Data to sync
   * @returns {Promise<boolean>} Success status
   */
  async sync(key, data) {
    if (!this.userId) {
      console.warn("[SyncService] No user ID set, skipping sync");
      return false;
    }

    try {
      await saveUserData(data);
      return true;
    } catch (error) {
      console.error("[SyncService] Sync failed:", error);
      return false;
    }
  }

  /**
   * Load data from Firebase
   * @param {string} key - Storage key
   * @returns {Promise<*>} Loaded data
   */
  async load(key) {
    if (!this.userId) {
      console.warn("[SyncService] No user ID set, skipping load");
      return null;
    }

    try {
      return await getUserData();
    } catch (error) {
      console.error("[SyncService] Load failed:", error);
      return null;
    }
  }

  /**
   * Clear all synced data
   * @returns {Promise<void>}
   */
  async clearAll() {
    // Clear localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("rogue_")) {
        localStorage.removeItem(key);
      }
    });
  }
}

export const syncService = new SyncService();
