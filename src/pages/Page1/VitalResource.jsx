import PropTypes from 'prop-types';
import {IconButton} from "@mui/material";
import {Add, Remove} from '@mui/icons-material';
import styles from './VitalResource.module.css';

export default function VitalResource({
    label,
    icon: Icon,
    currentKey,
    currentValue,
    maxValue,
    color,
    lightColor,
    onResourceChange,
    onInputChange
}) {
    const percentage = maxValue > 0 ? Math.min(100, (currentValue / maxValue) * 100) : 0;
    const isOverLimit = currentValue > maxValue;

    return (
        <div className={styles.vitalResourceContainer}>
            <div className={styles.vitalResourceHeader}>
                <div className={styles.resourceLabel}>
                    {Icon && <Icon/>}
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
                        background: isOverLimit 
                            ? `linear-gradient(90deg, ${color} 0%, #ff4757 50%, #ff3838 100%)`
                            : `linear-gradient(90deg, ${color} 0%, ${lightColor} 100%)`
                    }}
                />
                <div className={styles.barText}>
                    {isOverLimit ? `${currentValue - maxValue}+` : `${Math.round(percentage)}%`}
                </div>
            </div>
            <div className={styles.vitalResourceControls}>
                <IconButton
                    size="small"
                    onClick={() => onResourceChange(currentKey, maxValue, -10)}
                    disabled={currentValue === 0}
                >
                    <Remove fontSize="small"/>
                </IconButton>
                <IconButton
                    size="small"
                    onClick={() => onResourceChange(currentKey, maxValue, -1)}
                    disabled={currentValue === 0}
                >
                    <Remove fontSize="inherit"/>
                </IconButton>
                <input
                    className={styles.resourceInput}
                    type="number"
                    value={currentValue}
                    onChange={(e) => onInputChange(currentKey, maxValue, e)}
                    min={0}
                    style={{borderColor: `${color}50`}}
                />
                <IconButton
                    size="small"
                    onClick={() => onResourceChange(currentKey, maxValue, 1)}
                >
                    <Add fontSize="inherit"/>
                </IconButton>
                <IconButton
                    size="small"
                    onClick={() => onResourceChange(currentKey, maxValue, 10)}
                >
                    <Add fontSize="small"/>
                </IconButton>
            </div>
        </div>
    );
}

VitalResource.propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.elementType,
    currentKey: PropTypes.string.isRequired,
    currentValue: PropTypes.number.isRequired,
    maxValue: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    lightColor: PropTypes.string.isRequired,
    onResourceChange: PropTypes.func.isRequired,
    onInputChange: PropTypes.func.isRequired,
};
