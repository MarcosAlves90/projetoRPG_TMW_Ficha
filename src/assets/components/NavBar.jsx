import {useEffect, useState, useContext} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useSignOut} from "../systems/SaveLoad.jsx";
import {onAuthStateChanged} from "firebase/auth";
import { auth } from "../../firebase";
import { UserContext } from "../../UserContext.jsx";
import { saveUserData } from "../../firebaseUtils.js";

export default function NavBar() {
    const [headerBackground, setHeaderBackground] = useState(false);
    const [collapsed, setCollapsed] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const { userData, setUserData } = useContext(UserContext);

    const location = useLocation();
    const navigate = useNavigate();

    const signOut = useSignOut();

    function handleMenuToggle() {
        setCollapsed(!collapsed);
    }

    function handleLogoutClick() {
        saveUserData(userData);
        signOut();
        setUserData({ nivel: 0 });
    }

    function handleLoginClick() {
        currentUser ? handleLogoutClick() : navigate("/login");
    }

    function handleNavItemClick() {
        if (!collapsed) setCollapsed(true);
    }

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setHeaderBackground(scrollTop > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!collapsed) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }, [collapsed]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <nav className={`navbar ${collapsed ? "" : "show"} navbar-expand-lg navbar-light ${headerBackground || !collapsed ? "custom-theme" : "default-theme"} `}>
            <Link className={"navbar-brand"} to={"/"}>{collapsed ? "TMWCSE" : "The Mental World CSE"}</Link>
            <button className={`navbar-toggler ${!collapsed ? "active" : ""} ${location.pathname === "/login" ? "login-themed" : ""}`}
                    onClick={handleMenuToggle} type="button" data-toggle="collapse" data-target="#navbarText"
                    aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"/>
            </button>
            <div className={`collapse navbar-collapse ${collapsed ? "" : "show"}`} id="navbarText">
                <ul className="navbar-nav mr-auto">
                    <li className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
                        <Link className="nav-link" to={"/"} onClick={handleNavItemClick}>Início</Link>
                    </li>
                    <li className={`nav-item ${location.pathname === "/individual" ? "active" : ""}`}>
                        <Link className="nav-link" to={"/individual"} onClick={handleNavItemClick}>Individual</Link>
                    </li>
                    <li className={`nav-item ${location.pathname === "/caracteristicas" ? "active" : ""}`}>
                        <Link className="nav-link" to={"/caracteristicas"} onClick={handleNavItemClick}>Características</Link>
                    </li>
                    <li className={`nav-item ${location.pathname === "/status" ? "active" : ""}`}>
                        <Link className="nav-link" to={"/status"} onClick={handleNavItemClick}>Status</Link>
                    </li>
                    <li className={`nav-item ${location.pathname === "/skills" ? "active" : ""}`}>
                        <Link className="nav-link" to={"/skills"} onClick={handleNavItemClick}>Skills</Link>
                    </li>
                    <li className={`nav-item ${location.pathname === "/anotacoes" ? "active" : ""}`}>
                        <Link className="nav-link" to={"/anotacoes"} onClick={handleNavItemClick}>Anotações</Link>
                    </li>
                    <li className={`nav-item ${location.pathname === "/inventario" ? "active" : ""}`}>
                        <Link className={"nav-link"} to={"/inventario"} onClick={handleNavItemClick}>Inventário</Link>
                    </li>
                    <li className={`nav-item ${location.pathname === "/configuracoes" ? "active" : ""} config`}>
                        <Link className="nav-link" to={"/configuracoes"} onClick={handleNavItemClick}>⚙️</Link>
                    </li>
                    <li className={`nav-item sign-in ${!currentUser ? "login" : "sign-out"} ${location.pathname === "/login" ? "login-themed" : ""}`}
                        onClick={handleLoginClick}>
                        <p>{!currentUser ? "Login" : "Sair"}</p>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

NavBar.propTypes = {};