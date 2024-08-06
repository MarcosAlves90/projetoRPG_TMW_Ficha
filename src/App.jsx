/**
 * Main application component that handles page navigation and loading state.
 * It utilizes React hooks for state management and effects to handle keyboard navigation
 * and a loading animation. The application is divided into three pages, with the ability
 * to navigate through them using arrow keys or UI buttons. It also includes functionality
 * to load and save data to local storage.
 */

import {useCallback, useEffect, useState} from 'react';
import Header from './assets/components/Header.jsx';
import Page0 from './pages/Page0.jsx'
import Page1 from './pages/Page1.jsx';
import Page2 from './pages/Page2.jsx';
import Page3 from "./pages/Page3.jsx";
import Page4 from "./pages/Page4.jsx";
import Page5 from "./pages/Page5.jsx";
import './App.css';
import {deleteItem, loadLocalStorageFile, saveItem, saveLocalStorageFile} from "./assets/systems/SaveLoad.jsx";

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(parseInt(sessionStorage.getItem('currentPage')) || 0);
    const [configMenuIsVisible, setConfigMenuIsVisible] = useState(false);

    const pages = 5;


    useEffect(() => {

        if (currentPage !== 0) {
            sessionStorage.setItem('currentPage', currentPage);
        } else {
            sessionStorage.removeItem('currentPage');
        }

    }, [currentPage]);

    const goToPage = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    const goToNextPage = useCallback(() => {
        if (currentPage < pages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    }, [currentPage]);

    const goToPreviousPage = useCallback(() => {
        if (currentPage > 0) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    }, [currentPage]);

    useEffect(() => {
        /**
         * Handles key down events for navigation.
         * This function listens for right and left arrow key presses to navigate between pages.
         * It checks if the currently focused element is an input, textarea, or select element
         * to prevent navigation when these elements are focused.
         *
         * @param {KeyboardEvent} event - The keyboard event triggered by the user.
         */
        const handleKeyDown = (event) => {
            const focusedElement = document.activeElement;
            const focusableTags = ['INPUT', 'TEXTAREA', 'SELECT'];

            if (focusableTags.includes(focusedElement.tagName)) {
                return;
            }

            switch (event.key) {
                case 'ArrowRight':
                    goToNextPage();
                    break;
                case 'ArrowLeft':
                    goToPreviousPage();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };

    }, [goToNextPage, goToPreviousPage]);

    useEffect(() => {
        const htmlElement = document.documentElement;

        htmlElement.classList.add('disable-scroll');

        const timer = setTimeout(() => {
            htmlElement.classList.remove('disable-scroll');
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <main>
            <div>
                {isLoading && (
                    <div id="loader">
                        <div className="loader"></div>
                    </div>
                )}
            </div>
            <Header showPage0={() => goToPage(0)}
                    showPage1={() => goToPage(1)}
                    showPage2={() => goToPage(2)}
                    showPage3={() => goToPage(3)}
                    showPage4={() => goToPage(4)}
                    showPage5={() => goToPage(5)}
                    currentPage={currentPage}
                    showConfigMenu={() => setConfigMenuIsVisible(!configMenuIsVisible)}
                    isConfigMenuVisible={configMenuIsVisible}
            />
            {currentPage === 0 && <Page0/>}
            {currentPage === 1 && <Page1/>}
            {currentPage === 2 && <Page2/>}
            {currentPage === 3 && <Page3/>}
            {currentPage === 4 && <Page4/>}
            {currentPage === 5 && <Page5/>}

            {currentPage !== 0 && configMenuIsVisible ? <div className="fixed-bottom">
                <div className="mb-3 sticky">
                    <div className="icon-save right">
                        <button className="button-header active up clear"
                                onClick={() => {
                                    localStorage.clear();
                                    location.reload()
                                }}>
                            {"Limpar "}
                            <i className="bi bi-trash3-fill"></i>
                        </button>
                    </div>
                    <input className="form-control dark" type="file" id="formFile"
                           onChange={loadLocalStorageFile} style={{display: 'none'}}/>
                    <button className="button-header active file"
                            onClick={() => document.getElementById('formFile').click()}>
                        <label htmlFor="formFile" style={{width: "100%"}} className="file-selector">
                            {"Carregar "}
                            <i className="bi bi-box-arrow-up"></i>
                        </label>
                    </button>
                </div>
                <div className="mb-3 sticky">
                    <div className={"icon-save right"}>
                        <button className={"button-header active up"} onClick={() => scrollTo(0, 0)}>
                            {"Subir "}
                            <i className="bi bi-caret-up-fill"></i>
                        </button>
                    </div>
                    <button className="button-header active" onClick={saveLocalStorageFile}>
                        {"Salvar "}
                        <i className="bi bi-floppy2-fill"></i>
                    </button>
                </div>
            </div> : null}
        </main>
    );
}

export default App;