import PropTypes from "prop-types";

export default function Badge({
  children,
  variant = "primary",
  className = "",
}) {
  const variants = {
    primary: "badge-primary",
    secondary: "badge-secondary",
    success: "badge-success",
    danger: "badge-danger",
  };

  const variantClass = variants[variant] || variants.primary;

  return (
    <span className={`badge ${variantClass} ${className}`}>{children}</span>
  );
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "success", "danger"]),
  className: PropTypes.string,
};
