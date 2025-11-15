import PropTypes from 'prop-types';
// MUI removed — using native buttons and simple icons
import styles from './VitalResource.module.css';

export default function VitalResource({
    label,
    icon,
    currentKey,
    currentValue,
    maxValue,
    color,
    lightColor,
    onResourceChange,
    onInputChange
}) {
    const percentage = (currentValue / maxValue) * 100;

    return (
        <div className={styles.vitalResourceContainer}>
            <div className={styles.vitalResourceHeader}>
                <div className={styles.resourceLabel}>
                    {icon && <span className={styles.resourceIcon}>{icon}</span>}
                    <span>{label}</span>
                </div>
                <span className={styles.resourceValue}>{currentValue} / {maxValue}</span>
            </div>
            <div 
                className={styles.vitalResourceBar}
                style={{borderColor: color}}
            >
                <div 
                    className={styles.barFill} 
                    style={{
                        width: `${percentage}%`,
                        background: `linear-gradient(90deg, ${color} 0%, ${lightColor} 100%)`
                    }}
                />
                <div className={styles.barText}>{Math.round(percentage)}%</div>
            </div>
            <div className={styles.vitalResourceControls}>
                <button
                    size="small"
                    onClick={() => onResourceChange(currentKey, maxValue, -10)}
                    disabled={currentValue === 0}
                >
                    −
                </button>
                <button
                    className={styles.iconButton}
                    onClick={() => onResourceChange(currentKey, maxValue, -1)}
                    disabled={currentValue === 0}
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
                    style={{borderColor: `${color}50`}}
                />
                <button
                    className={styles.iconButton}
                    onClick={() => onResourceChange(currentKey, maxValue, 1)}
                    disabled={currentValue >= maxValue}
                >
                    +
                </button>
                <button
                    className={styles.iconButton}
                    onClick={() => onResourceChange(currentKey, maxValue, 10)}
                    disabled={currentValue >= maxValue}
                >
                    ++
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
