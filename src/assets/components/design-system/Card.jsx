import PropTypes from "prop-types";

export default function Card({
  children,
  className = "",
  interactive = false,
  onClick,
}) {
  const cardClass = interactive ? "card-interactive" : "card";

  return (
    <div className={`${cardClass} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  interactive: PropTypes.bool,
  onClick: PropTypes.func,
};
