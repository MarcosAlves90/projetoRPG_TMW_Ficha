import PropTypes from "prop-types";

export default function Divider({
  variant = "subtle",
  className = "",
  withLabel = false,
  label = "",
}) {
  const variants = {
    subtle: "border-white/10",
    bright: "border-white/20",
    accent: "border-blue-500/30",
    gradient:
      "border-t border-transparent bg-gradient-to-r from-transparent via-blue-500/30 to-transparent",
  };

  const variantClass = variants[variant] || variants.subtle;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {variant === "gradient" ? (
        <div className={`flex-1 h-px ${variantClass}`} />
      ) : (
        <div className={`flex-1 border-t ${variantClass}`} />
      )}
      {withLabel && label && (
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-2 shrink-0">
          {label}
        </p>
      )}
      {variant === "gradient" ? (
        <div className={`flex-1 h-px ${variantClass}`} />
      ) : (
        <div className={`flex-1 border-t ${variantClass}`} />
      )}
    </div>
  );
}

Divider.propTypes = {
  variant: PropTypes.oneOf(["subtle", "bright", "accent", "gradient"]),
  className: PropTypes.string,
  withLabel: PropTypes.bool,
  label: PropTypes.string,
};
