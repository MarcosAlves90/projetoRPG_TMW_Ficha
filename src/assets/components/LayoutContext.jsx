/* eslint-disable react-refresh/only-export-components */
import PropTypes from "prop-types";
import { createContext, useContext, useState } from "react";

const LayoutContext = createContext(null);

export const useLayout = () => useContext(LayoutContext);

export function LayoutProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <LayoutContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </LayoutContext.Provider>
  );
}

LayoutProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LayoutContext;
