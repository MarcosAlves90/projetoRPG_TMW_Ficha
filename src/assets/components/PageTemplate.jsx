import PropTypes from "prop-types";
import NavBar from "./NavBar.jsx";
import { LayoutProvider } from "./LayoutContext.jsx";

/**
 * PageTemplate - wrapper that handles navbar (compactada/descompactada) and content layout.
 * It uses LayoutProvider to surface `isCollapsed` to children if they need to respond.
 */
export default function PageTemplate({
  children,
  showNav = true,
  className = "",
}) {
  return (
    <LayoutProvider>
      <div className={`page-template min-h-screen flex w-full ${className}`}>
        {/* NavBar outside main ensures the NavBar spacer controls width for content */}
        {showNav && <NavBar />}

        {/* Main area — children components should not need to know about the NavBar width because NavBar provides a spacer */}
        <div className="flex-1 p-2 md:p-6 lg:p-8 bg-background transition-all duration-300">
          {" "}
          {/* substitute background if needed */}
          {children}
        </div>
      </div>
    </LayoutProvider>
  );
}

PageTemplate.propTypes = {
  children: PropTypes.node,
  showNav: PropTypes.bool,
  className: PropTypes.string,
};
