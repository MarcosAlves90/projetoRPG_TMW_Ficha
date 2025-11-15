import PropTypes from "prop-types";
import { createContext, useMemo, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [userData, setUserData] = useState({ nivel: 0 });
    const [user, setUser] = useState(null);
    const [isLoadingUserData, setIsLoadingUserData] = useState(true);

    return (
        <UserContext.Provider value={useMemo(() => ({ 
            userData, 
            setUserData, 
            user, 
            setUser,
            isLoadingUserData,
            setIsLoadingUserData
        }), [userData, user, isLoadingUserData])}>
            {children}
        </UserContext.Provider>
    );
}

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};