import { useState, useEffect, useCallback, useRef } from "react";
import { syncService } from "@/services/storage/SyncService.js";

/**
 * Hook for syncing data with Firebase and localStorage
 * @param {string} storageKey - Key for localStorage
 * @param {*} defaultValue - Default value if no data exists
 * @param {Object} options - Options for sync behavior
 * @param {number} options.debounceMs - Debounce time in milliseconds
 * @returns {[*, Function, Object]} [data, setData, status]
 */
export function useSyncData(storageKey, defaultValue = null, options = {}) {
  const { debounceMs = 500 } = options;
  
  const [data, setData] = useState(() => {
    // Try to load from localStorage first
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error("[useSyncData] Error loading from localStorage:", error);
      return defaultValue;
    }
  });

  const [status, setStatus] = useState({
    isLoading: false,
    isSyncing: false,
    error: null,
    lastSync: null,
  });

  const debounceTimerRef = useRef(null);
  const dataRef = useRef(data);

  // Update ref when data changes
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  /**
   * Save data to localStorage and sync to Firebase
   */
  const syncData = useCallback(
    async (dataToSync) => {
      try {
        // Save to localStorage immediately
        localStorage.setItem(storageKey, JSON.stringify(dataToSync));

        // Sync to Firebase with debounce
        setStatus((prev) => ({ ...prev, isSyncing: true, error: null }));
        
        const success = await syncService.sync(storageKey, dataToSync);
        
        setStatus((prev) => ({
          ...prev,
          isSyncing: false,
          error: success ? null : "Sync failed",
          lastSync: success ? new Date() : prev.lastSync,
        }));
      } catch (error) {
        console.error("[useSyncData] Sync error:", error);
        setStatus((prev) => ({
          ...prev,
          isSyncing: false,
          error: error.message,
        }));
      }
    },
    [storageKey],
  );

  /**
   * Debounced data setter
   */
  const setDataWithSync = useCallback(
    (newData) => {
      const finalData = typeof newData === "function" ? newData(dataRef.current) : newData;
      
      setData(finalData);

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer for sync
      debounceTimerRef.current = setTimeout(() => {
        syncData(finalData);
      }, debounceMs);
    },
    [syncData, debounceMs],
  );

  /**
   * Force immediate sync
   */
  const forceSync = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    await syncData(dataRef.current);
  }, [syncData]);

  // Load data from Firebase on mount
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setStatus((prev) => ({ ...prev, isLoading: true }));
      
      try {
        const loaded = await syncService.load(storageKey);
        
        if (mounted && loaded) {
          setData(loaded);
          localStorage.setItem(storageKey, JSON.stringify(loaded));
        }
      } catch (error) {
        console.error("[useSyncData] Load error:", error);
      } finally {
        if (mounted) {
          setStatus((prev) => ({ ...prev, isLoading: false }));
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [storageKey]);

  // Return enhanced status object
  const enhancedStatus = {
    ...status,
    forceSync,
  };

  return [data, setDataWithSync, enhancedStatus];
}
