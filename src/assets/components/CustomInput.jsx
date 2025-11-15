import PropTypes from 'prop-types';
import styles from './CustomInput.module.css';

export default function CustomInput({
    label,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    disabled = false,
    required = false,
    min,
    max,
    step,
    endAdornment,
    startAdornment,
    fullWidth = true,
    className = '',
    ...props
}) {
    const inputId = `input-${label.replace(/\s+/g, '-').toLowerCase()}`;

    return (
        <div className={`${styles.inputContainer} ${fullWidth ? styles.fullWidth : ''} ${className}`}>
            {label && (
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                </label>
            )}
            <div className={styles.inputWrapper}>
                {startAdornment && (
                    <div className={styles.adornment} aria-hidden="true">
                        {startAdornment}
                    </div>
                )}
                <input
                    id={inputId}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    min={min}
                    max={max}
                    step={step}
                    className={styles.input}
                    {...props}
                />
                {endAdornment && (
                    <div className={styles.adornment} aria-hidden="true">
                        {endAdornment}
                    </div>
                )}
            </div>
        </div>
    );
}

CustomInput.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    endAdornment: PropTypes.node,
    startAdornment: PropTypes.node,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
};