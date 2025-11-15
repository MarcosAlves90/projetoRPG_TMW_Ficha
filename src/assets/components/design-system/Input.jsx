import PropTypes from "prop-types";

export default function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  disabled = false,
  className = "",
  label,
  error,
  ...props
}) {
  const inputClass = disabled ? "input-disabled" : "input-focus";

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-300">{label}</label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${inputClass} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
};
