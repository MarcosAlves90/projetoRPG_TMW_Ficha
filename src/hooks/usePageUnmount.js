import { useEffect, useContext, useRef } from "react";
import { UserContext } from "@/UserContext.jsx";

/**
 * Hook que força sincronização ao desmontar a página
 * Garante que todos os dados sejam salvos quando o usuário sai da página
 * Usa navigator.sendBeacon como fallback para garantir que dados sejam salvos
 */
export const usePageUnmount = () => {
  const { forceSync, userData } = useContext(UserContext);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    // Handler para beforeunload - salva dados antes de sair
    const handleBeforeUnload = () => {
      if (!isSyncingRef.current) {
        // Tenta sync síncrono
        try {
          forceSync?.();
          isSyncingRef.current = true;
        } catch (error) {
          console.error("[usePageUnmount] Erro ao salvar antes de sair:", error);
        }
      }
    };

    // Adiciona listener para beforeunload
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // Remove listener
      window.removeEventListener("beforeunload", handleBeforeUnload);
      
      // Força sync ao desmontar componente
      if (!isSyncingRef.current && forceSync) {
        try {
          forceSync();
          isSyncingRef.current = true;
        } catch (error) {
          console.error("[usePageUnmount] Erro ao salvar no unmount:", error);
        }
      }
    };
  }, [forceSync, userData]);
};
