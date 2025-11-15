import { useEffect, useContext } from "react";
import { UserContext } from "@/UserContext.jsx";

/**
 * Hook que força sincronização ao desmontar a página
 * Garante que todos os dados sejam salvos quando o usuário sai da página
 */
export const usePageUnmount = () => {
  const { forceSync } = useContext(UserContext);

  useEffect(() => {
    return () => {
      forceSync?.();
    };
  }, [forceSync]);
};
