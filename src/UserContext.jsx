import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from 'uuid';

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [sheetCode, setSheetCode] = useState(localStorage.getItem('sheetCode') || "");

    useEffect(() => {
        console.log("Verificando ficha...");
        if (!sheetCode) {
            console.log("Criando nova ficha...");
            const newSheetCode = uuidv4();
            localStorage.setItem('sheetCode', newSheetCode);
        }
    }, [sheetCode]);

    return (
        <UserContext.Provider value={{ sheetCode, setSheetCode }}>
            {children}
        </UserContext.Provider>
    );
}

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};