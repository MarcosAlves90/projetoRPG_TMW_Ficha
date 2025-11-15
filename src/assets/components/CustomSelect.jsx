import PropTypes from 'prop-types';
import styles from './CustomSelect.module.css';

export default function CustomSelect({
    label,
    value,
    onChange,
    options = [],
    placeholder = 'Selecione...',
    disabled = false,
    required = false,
    fullWidth = true,
    className = '',
    ...props
}) {
    const selectId = `select-${label.replace(/\s+/g, '-').toLowerCase()}`;

    return (
        <div className={`${styles.selectContainer} ${fullWidth ? styles.fullWidth : ''} ${className}`}>
            {label && (
                <label htmlFor={selectId} className={styles.label}>
                    {label}
                </label>
            )}
            <div className={styles.selectWrapper}>
                <select
                    id={selectId}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    className={styles.select}
                    {...props}
                >
                    {placeholder && <option value="" disabled>{placeholder}</option>}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className={styles.arrow} aria-hidden="true">▼</div>
            </div>
        </div>
    );
}

CustomSelect.propTypes = {
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
};