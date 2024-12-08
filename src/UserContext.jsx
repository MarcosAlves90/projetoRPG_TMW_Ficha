import PropTypes from "prop-types";
import { v4 as uuidv4 } from 'uuid';
import { getUserData } from './firebaseUtils';
import { createContext, useMemo, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [sheetCode, setSheetCode] = useState(localStorage.getItem('sheetCode') || "");
    const [userData, setUserData] = useState({ nivel: 0 });
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!sheetCode) {
            const newSheetCode = uuidv4();
            localStorage.setItem('sheetCode', newSheetCode);
            setSheetCode(newSheetCode);
        }
    }, [sheetCode]);

    const fetchUserData = async (isMounted) => {
        try {
            const data = await getUserData('data');
            if (data && isMounted) {
                setUserData(data);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        let isMounted = true;
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                fetchUserData(isMounted);
            } else {
                setUser(null);
            }
        });

        return () => {
            isMounted = false;
            unsubscribeAuth();
        };
    }, []);

    return (
        <UserContext.Provider value={useMemo(() => ({ sheetCode, setSheetCode, userData, setUserData, user }), [sheetCode, userData, user])}>
            {children}
        </UserContext.Provider>
    );
}

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};