import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Check, AlertCircle, Loader } from "lucide-react";

/**
 * Componente de feedback de salvamento automático
 * Mostra status de sincronização em tempo real
 */
export const AutoSaveIndicator = ({ isSaving, error, lastSaved }) => {
  AutoSaveIndicator.propTypes = {
    isSaving: PropTypes.bool,
    error: PropTypes.string,
    lastSaved: PropTypes.instanceOf(Date),
  };
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    if (isSaving || error || lastSaved) {
      setShowIndicator(true);
      const timeout = setTimeout(() => {
        if (!error) setShowIndicator(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isSaving, error, lastSaved]);

  if (!showIndicator && !error) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 ${
        error
          ? "bg-red-500/20 text-red-300 border border-red-500/30"
          : isSaving
            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
            : "bg-green-500/20 text-green-300 border border-green-500/30"
      }`}
    >
      {isSaving ? (
        <>
          <Loader className="w-4 h-4 animate-spin" />
          <span className="text-sm font-medium">Salvando...</span>
        </>
      ) : error ? (
        <>
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Erro ao salvar</span>
        </>
      ) : (
        <>
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">Salvo</span>
        </>
      )}
    </div>
  );
};

AutoSaveIndicator.propTypes = {
  isSaving: PropTypes.bool,
  error: PropTypes.string,
  lastSaved: PropTypes.instanceOf(Date),
};
