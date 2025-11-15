import PropTypes from "prop-types";

export default function StatCard({
  label,
  value,
  icon,
  color = "blue",
  className = "",
  compact = false,
}) {
  const colorVariants = {
    blue: "bg-blue-600/10 border-blue-500/30 text-blue-300",
    purple: "bg-purple-600/10 border-purple-500/30 text-purple-300",
    cyan: "bg-cyan-600/10 border-cyan-500/30 text-cyan-300",
    green: "bg-green-600/10 border-green-500/30 text-green-300",
    red: "bg-red-600/10 border-red-500/30 text-red-300",
    yellow: "bg-yellow-600/10 border-yellow-500/30 text-yellow-300",
  };

  const colorClass = colorVariants[color] || colorVariants.blue;

  return (
    <div className={`card ${colorClass} hover-lift ${compact ? "p-2" : ""} ${className}`}>
      <div className={`flex items-center justify-between ${compact ? "mb-1" : "mb-3"}`}>
        <span className={`text-gray-400 font-semibold uppercase tracking-wide ${compact ? "text-xs" : "text-xs"}`}>
          {label}
        </span>
        {icon && <span className={`opacity-80 ${compact ? "" : "text-2xl"}`}>{icon}</span>}
      </div>
      <p className={`font-bold ${compact ? "text-2xl" : "text-4xl"}`}>{value}</p>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
  color: PropTypes.oneOf(["blue", "purple", "cyan", "green", "red", "yellow"]),
  className: PropTypes.string,
  compact: PropTypes.bool,
};
