import PropTypes from "prop-types";

export default function Section({
  title,
  subtitle,
  children,
  className = "",
  headerAction,
}) {
  return (
    <section className={`section ${className}`}>
      {(title || headerAction) && (
        <div className="section-header mb-6 pb-4 border-b border-white/10">
          <div className="flex-1">
            {title && (
              <h2 className="section-title text-2xl lg:text-3xl font-bold text-white md:mb-2">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="section-subtitle text-sm text-gray-400 font-medium max-md:hidden">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && (
            <div className="flex items-center gap-3">{headerAction}</div>
          )}
        </div>
      )}
      <div className="section-content">{children}</div>
    </section>
  );
}

Section.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  headerAction: PropTypes.node,
};
