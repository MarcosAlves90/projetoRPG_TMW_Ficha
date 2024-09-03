import {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";

export default function Header() {
    const [headerBackground, setHeaderBackground] = useState(false);
    const [collapsed, setCollapsed] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setHeaderBackground(scrollTop > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (

        <nav className={`navbar navbar-expand-lg navbar-light ${headerBackground || !collapsed ? "custom-theme" : "default-theme"}`}>
            <Link className={"navbar-brand"} to={"/"}>TMWCSE</Link>
            <button className="navbar-toggler" onClick={() => setCollapsed(!collapsed)} type="button" data-toggle="collapse" data-target="#navbarText"
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
                </ul>
            </div>
        </nav>

    );
}

Header.propTypes = {

};