import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { X, Check, AlertCircle, Info } from "lucide-react";

export default function Toast({
  message,
  variant = "info",
  duration = 4000,
  onClose,
  action,
  actionLabel = "OK",
}) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (duration && variant !== "confirm") {
      const timer = setTimeout(() => {
        setIsClosing(true);
        setTimeout(onClose, 200);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose, variant]);

  const variants = {
    success: {
      bg: "bg-gradient-to-r from-green-600/20 to-emerald-600/20",
      border: "border-green-500/30",
      icon: Check,
      iconColor: "text-green-400",
      textColor: "text-green-50",
    },
    error: {
      bg: "bg-gradient-to-r from-red-600/20 to-rose-600/20",
      border: "border-red-500/30",
      icon: AlertCircle,
      iconColor: "text-red-400",
      textColor: "text-red-50",
    },
    warning: {
      bg: "bg-gradient-to-r from-yellow-600/20 to-amber-600/20",
      border: "border-yellow-500/30",
      icon: AlertCircle,
      iconColor: "text-yellow-400",
      textColor: "text-yellow-50",
    },
    info: {
      bg: "bg-gradient-to-r from-blue-600/20 to-cyan-600/20",
      border: "border-blue-500/30",
      icon: Info,
      iconColor: "text-blue-400",
      textColor: "text-blue-50",
    },
    confirm: {
      bg: "bg-gradient-to-r from-purple-600/20 to-blue-600/20",
      border: "border-purple-500/30",
      icon: AlertCircle,
      iconColor: "text-purple-400",
      textColor: "text-purple-50",
    },
  };

  const config = variants[variant] || variants.info;
  const IconComponent = config.icon;

  return (
    <div
      className={`
        ${config.bg}
        ${config.border}
        border-2 rounded-lg p-4
        flex items-start gap-3
        backdrop-blur-md
        shadow-lg shadow-black/20
        transition-all duration-200
        ${isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"}
      `}
    >
      {/* Icon */}
      <IconComponent className={`w-5 h-5 shrink-0 mt-0.5 ${config.iconColor}`} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${config.textColor} break-all`}>
          {message}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {action && (
          <button
            onClick={() => {
              action();
              setIsClosing(true);
              setTimeout(onClose, 200);
            }}
            className={`
              px-3 py-1.5 rounded
              text-xs font-semibold
              ${
                variant === "confirm"
                  ? "bg-blue-600/80 hover:bg-blue-600 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }
              transition-colors duration-200
            `}
          >
            {actionLabel}
          </button>
        )}

        <button
          onClick={() => {
            setIsClosing(true);
            setTimeout(onClose, 200);
          }}
          className={`
            p-1 rounded
            text-white/60 hover:text-white
            transition-colors duration-200
            shrink-0
          `}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["success", "error", "warning", "info", "confirm"]),
  duration: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  action: PropTypes.func,
  actionLabel: PropTypes.string,
};
