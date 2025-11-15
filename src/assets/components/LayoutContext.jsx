import { createContext, useContext, useState } from 'react';

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

export default LayoutContext;
