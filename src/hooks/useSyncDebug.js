import { useContext, useCallback } from "react";
import { UserContext } from "@/UserContext.jsx";

/**
 * Hook para forçar salvamento manual
 * Útil para testes e controle explícito de quando salvar
 *
 * @returns {Function} Função para forçar salvamento
 *
 * @example
 * const forceSave = useForceSave();
 * await forceSave(); // Salva dados imediatamente
 */
export function useForceSave() {
  const { forceSave } = useContext(UserContext);

  return useCallback(async () => {
    if (!forceSave) {
      console.warn("[useForceSave] forceSave não disponível no contexto");
      return false;
    }

    try {
      console.log("[💾 FORCE SAVE] Salvando dados...");
      await forceSave();
      console.log("[💾 FORCE SAVE] ✅ Sucesso");
      return true;
    } catch (error) {
      console.error("[💾 FORCE SAVE] ❌ Erro:", error);
      throw error;
    }
  }, [forceSave]);
}
