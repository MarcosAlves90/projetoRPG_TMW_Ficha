import PropTypes from "prop-types";

export default function StatCard({
  label,
  value,
  icon,
  color = "blue",
  className = "",
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
    <div className={`card ${colorClass} hover-lift ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
        {icon && <span className="text-2xl opacity-80">{icon}</span>}
      </div>
      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
  color: PropTypes.oneOf(["blue", "purple", "cyan", "green", "red", "yellow"]),
  className: PropTypes.string,
};
