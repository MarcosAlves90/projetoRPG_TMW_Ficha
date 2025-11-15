import {useEffect, useState, useContext, useCallback} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useSignOut} from "../systems/SaveLoad.jsx";
import {onAuthStateChanged} from "firebase/auth";
import { auth } from "../../firebase";
import { UserContext } from "../../UserContext.jsx";
import { SidebarContext } from "../../SidebarContext.jsx";
import { saveUserData } from "../../firebaseUtils.js";
import styles from './NavBar.module.css';

const navItems = [
    { label: "Individual", path: "/individual", icon: "👤" },
    { label: "Características", path: "/caracteristicas", icon: "🧬" },
    { label: "Status", path: "/status", icon: "❤️" },
    { label: "Skills", path: "/skills", icon: "⚔️" },
    { label: "Anotações", path: "/anotacoes", icon: "📋" },
    { label: "Inventário", path: "/inventario", icon: "🎒" },
    { label: "Configurações", path: "/configuracoes", icon: "⚙️" },
];

const getPageTitle = (pathname) => {
    const item = navItems.find(nav => nav.path === pathname);
    return item ? item.label : "MidNight";
};

export default function NavBar() {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isCompact, setIsCompact] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('sidebarCompact') === 'true';
        }
        return false;
    });
    const [currentUser, setCurrentUser] = useState(null);
    const { userData, setUserData } = useContext(UserContext);
    const { toggleCompact } = useContext(SidebarContext);

    const location = useLocation();
    const navigate = useNavigate();

    const signOut = useSignOut();

    const handleMenuToggle = useCallback(() => {
        setMenuOpen(prev => !prev);
    }, []);

    const handleCompactToggle = useCallback(() => {
        setIsCompact(prev => !prev);
        toggleCompact();
    }, [toggleCompact]);

    const handleLogoutClick = useCallback(() => {
        saveUserData(userData);
        signOut();
        setUserData({ nivel: 0 });
        setMenuOpen(false);
    }, [userData, signOut, setUserData]);

    const handleLoginClick = useCallback(() => {
        if (currentUser) {
            handleLogoutClick();
        } else {
            navigate("/login");
        }
        setMenuOpen(false);
    }, [currentUser, handleLogoutClick, navigate]);

    const handleNavItemClick = useCallback(() => {
        if (isMenuOpen) setMenuOpen(false);
    }, [isMenuOpen]);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }, [isMenuOpen]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <>
            <div className={styles.sidebarHeader}>
                <span className={styles.headerTitle}>{getPageTitle(location.pathname)}</span>
                <button className={styles.toggleButton} onClick={handleMenuToggle} aria-label="Alternar menu">
                    <span />
                    <span />
                    <span />
                </button>
            </div>
            <nav className={`${styles.sidebar} ${isMenuOpen ? styles.open : ""} ${isCompact ? styles.compact : ""}`} aria-label="Menu principal">
                <div className={styles.brandContainer}>
                    <Link to="/" className={styles.brand} onClick={handleNavItemClick}>
                        <span>MidNight</span>
                    </Link>
                    <div className={styles.buttonGroup}>
                        <button 
                            className={styles.compactButton} 
                            onClick={handleCompactToggle}
                            aria-label="Compactar/Expandir sidebar"
                            title={isCompact ? "Expandir" : "Compactar"}
                        >
                            <span className={styles.compactIcon}>{isCompact ? "▶" : "◀"}</span>
                        </button>
                        <button className={styles.toggleButton} onClick={handleMenuToggle} aria-label="Alternar menu">
                            <span />
                            <span />
                            <span />
                        </button>
                    </div>
                </div>
                <div className={styles.menu}>
                    {navItems.map(({label, path, icon}) => (
                        <Link
                            key={path}
                            to={path}
                            className={`${styles.menuItem} ${location.pathname === path ? styles.active : ""}`}
                            onClick={handleNavItemClick}
                            title={label}
                        >
                            {icon && <span className={styles.icon}>{icon}</span>}
                            <span className={styles.label}>{label}</span>
                        </Link>
                    ))}
                </div>
                <div className={styles.footer}>
                    <div className={styles.divider} />
                    <button 
                        className={styles.loginButton} 
                        onClick={handleLoginClick}
                        title={currentUser ? "Sair" : "Login"}
                    >
                        <span className={styles.icon}>{currentUser ? "🚪" : "🔑"}</span>
                        <span className={styles.label}>{currentUser ? "Sair" : "Login"}</span>
                    </button>
                </div>
            </nav>
            <div
                className={`${styles.backdrop} ${isMenuOpen ? styles.visible : ""}`}
                onClick={handleMenuToggle}
                aria-hidden={true}
            />
        </>
    );
}

NavBar.propTypes = {};