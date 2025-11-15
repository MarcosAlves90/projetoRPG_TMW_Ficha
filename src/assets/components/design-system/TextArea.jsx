import PropTypes from "prop-types";

export default function TextArea({
  placeholder = "",
  value,
  onChange,
  disabled = false,
  className = "",
  label,
  error,
  rows = 4,
  variant = "default",
  icon: Icon,
  ...props
}) {
  const variantStyles = {
    default: "bg-white/5 border-white/10 focus:border-blue-500/50",
    positive: "bg-green-600/5 border-green-500/20 focus:border-green-500/50",
    negative: "bg-red-600/5 border-red-500/20 focus:border-red-500/50",
  };

  const textareaClass = disabled
    ? "w-full px-4 py-3 rounded-lg border-2 border-white/10 bg-white/5 text-white placeholder-gray-500 transition-all duration-200 cursor-not-allowed resize-none"
    : `w-full px-4 py-3 rounded-lg border-2 bg-white/5 text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-none ${variantStyles[variant]}`;

  return (
    <div className="flex flex-col gap-2">
      {(label || Icon) && (
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase">
          {Icon && <Icon size={16} />}
          {label}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        className={`${textareaClass} ${className}`}
        spellCheck="true"
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}

TextArea.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  rows: PropTypes.number,
  variant: PropTypes.oneOf(["default", "positive", "negative"]),
  icon: PropTypes.elementType,
};
