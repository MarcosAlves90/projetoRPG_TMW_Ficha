import PropTypes from "prop-types";
import {useEffect, useState} from "react";

export default function Header(props) {
    const [headerBackground, setHeaderBackground] = useState(false);
    const [collapsed, setCollapsed] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setHeaderBackground(scrollTop > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (

        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#">Navbar w/ text</a>
            <button className="navbar-toggler" onClick={() => setCollapsed(!collapsed)} type="button" data-toggle="collapse" data-target="#navbarText"
                    aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`collapse navbar-collapse ${collapsed ? "" : "show"}`} id="navbarText">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Features</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Pricing</a>
                    </li>
                </ul>
                <span className="navbar-text">
                  Navbar text with an inline element
                </span>
            </div>
        </nav>

    );
}

Header.propTypes = {
    showPage0: PropTypes.func.isRequired,
    showPage1: PropTypes.func.isRequired,
    showPage2: PropTypes.func.isRequired,
    showPage3: PropTypes.func.isRequired,
    showPage4: PropTypes.func.isRequired,
    showPage5: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    showConfigMenu: PropTypes.func.isRequired,
    isConfigMenuVisible: PropTypes.bool.isRequired
};