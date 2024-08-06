import PropTypes from "prop-types";
import {useEffect, useState} from "react";

export default function Header(props) {
    const [headerBackground, setHeaderBackground] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setHeaderBackground(scrollTop > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <div className={"header"}>
                <div className={`header infos ${(props.currentPage === 0) && !headerBackground ? "lobby" : ""}`}>
                    <div>
                        <span className={`header-infos-span ${props.currentPage === 0 ? "active" : ""}`}
                                  onClick={props.showPage0}>
                            {props.currentPage === 0 ? "> " : ""} início
                        </span>
                            <span className={`header-infos-span ${props.currentPage === 1 ? "active" : ""}`}
                                  onClick={props.showPage1}>
                            {props.currentPage === 1 ? "> " : ""} individual
                        </span>
                            <span className={`header-infos-span ${props.currentPage === 2 ? "active" : ""}`}
                                  onClick={props.showPage2}>
                            {props.currentPage === 2 ? "> " : ""} características
                        </span>
                            <span className={`header-infos-span ${props.currentPage === 3 ? "active" : ""}`}
                                  onClick={props.showPage3}>
                            {props.currentPage === 3 ? "> " : ""} status
                        </span>
                            <span className={`header-infos-span ${props.currentPage === 4 ? "active" : ""}`}
                                  onClick={props.showPage4}>
                            {props.currentPage === 4 ? "> " : ""} skills
                        </span>
                            <span className={`header-infos-span ${props.currentPage === 5 ? "active" : ""}`}
                                  onClick={props.showPage5}>
                            {props.currentPage === 5 ? "> " : ""} inventário
                        </span>
                    </div>
                    <button className={"header-infos-configButton"}
                            onClick={props.showConfigMenu}
                            style={{display: props.currentPage !== 0 ? "flex" : "none", backgroundColor: props.isConfigMenuVisible ? "var(--green-text)" : "#1a1a1a"}}>
                        Opções
                    </button>
                </div>
            </div>
        </>
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