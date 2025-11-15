import PropTypes from "prop-types";
import styles from "./VitalResource.module.css";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function VitalResource({
  label,
  icon,
  currentKey,
  currentValue,
  maxValue,
  color,
  lightColor,
  onResourceChange,
  onInputChange,
}) {
  // Mapa de cores para variantes de card
  const colorVariants = {
    "#e74c3c": "bg-red-600/5 border-red-500/30",
    "#9b59b6": "bg-purple-600/5 border-purple-500/30",
    "#f39c12": "bg-yellow-600/5 border-yellow-500/30",
    "#3498db": "bg-blue-600/5 border-blue-500/30",
  };

  const cardColorClass = colorVariants[color] || "bg-slate-600/5 border-slate-500/30";

  const percentage = (currentValue / maxValue) * 100;
  const isCritical = percentage > 80;

  return (
    <div className={`${cardColorClass} rounded-lg border-2 transition-all duration-300 ${styles.vitalResourceContainer} ${isCritical ? "animate-pulse" : ""}`}>
      <div className={styles.vitalResourceHeader}>
        <div className={styles.resourceLabel}>
          {icon && <span className={styles.resourceIcon}>{icon}</span>}
          <span className="font-semibold">{label}</span>
        </div>
        <span className={styles.resourceValue}>
          {Math.round(currentValue)} / {Math.round(maxValue)}
        </span>
      </div>

      <div className={styles.vitalResourceBar} style={{ borderColor: color }}>
        <div
          className={styles.barFill}
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${color} 0%, ${lightColor} 100%)`,
          }}
        />
        <div className={styles.barText}>{Math.round(percentage)}%</div>
      </div>

      <div className={styles.vitalResourceControls}>
        <button
          className={styles.controlButton}
          onClick={() => onResourceChange(currentKey, maxValue, -10)}
          disabled={currentValue === 0}
          title="Diminuir 10"
        >
          <ChevronDown size={14} />
        </button>
        <button
          className={styles.controlButton}
          onClick={() => onResourceChange(currentKey, maxValue, -1)}
          disabled={currentValue === 0}
          title="Diminuir 1"
        >
          −
        </button>
        <input
          className={styles.resourceInput}
          type="number"
          value={currentValue}
          onChange={(e) => onInputChange(currentKey, maxValue, e)}
          min={0}
          max={maxValue}
          style={{ borderColor: `${color}50` }}
        />
        <button
          className={styles.controlButton}
          onClick={() => onResourceChange(currentKey, maxValue, 1)}
          disabled={currentValue >= maxValue}
          title="Aumentar 1"
        >
          +
        </button>
        <button
          className={styles.controlButton}
          onClick={() => onResourceChange(currentKey, maxValue, 10)}
          disabled={currentValue >= maxValue}
          title="Aumentar 10"
        >
          <ChevronUp size={14} />
        </button>
      </div>
    </div>
  );
}

VitalResource.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
  currentKey: PropTypes.string.isRequired,
  currentValue: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  lightColor: PropTypes.string.isRequired,
  onResourceChange: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
};
