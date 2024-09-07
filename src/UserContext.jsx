import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const UserContext = createContext(undefined);

export function UserProvider({ children }) {

    return (
        <UserContext.Provider value={{ }}>
            {children}
        </UserContext.Provider>
    );
}

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};