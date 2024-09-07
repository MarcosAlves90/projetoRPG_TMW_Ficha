import {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useSignOut} from "../systems/SaveLoad.jsx";
import {onAuthStateChanged} from "firebase/auth";
import { auth } from "../../firebase";

export default function Header() {
    const [headerBackground, setHeaderBackground] = useState(false);
    const [collapsed, setCollapsed] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    const signOut = useSignOut();

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
            <Link className={"navbar-brand"} to={"/"}>TMWCSE</Link>
            <button className={`navbar-toggler ${!collapsed ? "active" : ""} ${location.pathname === "/login" ? "login-themed" : ""}`} onClick={() => setCollapsed(!collapsed)} type="button" data-toggle="collapse" data-target="#navbarText"
                    aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`collapse navbar-collapse ${collapsed ? "" : "show"}`} id="navbarText">
                <ul className="navbar-nav mr-auto">
                    <li className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
                        <Link className="nav-link" to={"/"}>Início</Link>
                    </li>
                    <li className={`nav-item ${location.pathname === "/individual" ? "active" : ""}`}>
                        <Link className="nav-link" to={"/individual"}>Individual</Link>
                    </li>
                    <li className={`nav-item ${location.pathname === "/caracteristicas" ? "active" : ""}`}>
                        <Link className="nav-link" to={"/caracteristicas"}>Características</Link>
                    </li>
                    <li className={`nav-item ${location.pathname === "/status" ? "active" : ""}`}>
                        <Link className="nav-link" to={"/status"}>Status</Link>
                    </li>
                    <li className={`nav-item ${location.pathname === "/skills" ? "active" : ""}`}>
                        <Link className="nav-link" to={"/skills"}>Skills</Link>
                    </li>
                    <li className={`nav-item ${location.pathname === "/anotacoes" ? "active" : ""}`}>
                        <Link className="nav-link" to={"/anotacoes"}>Anotações</Link>
                    </li>
                    <li className={`nav-item sign-in ${!currentUser ? "login" : "sign-out"} ${location.pathname === "/login" ? "login-themed" : ""}`}
                    onClick={() => currentUser ? signOut() : navigate("/login")}>
                        <p>{!currentUser ? "Login" : "Sair"}</p>
                    </li>
                </ul>
            </div>
        </nav>

    );
}

Header.propTypes = {};