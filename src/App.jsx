/**
 * Main application component that handles page navigation and loading state.
 * It utilizes React hooks for state management and effects to handle keyboard navigation
 * and a loading animation. The application is divided into three pages, with the ability
 * to navigate through them using arrow keys or UI buttons. It also includes functionality
 * to load and save data to local storage.
 */

import {useCallback, useEffect, useRef, useState} from 'react';
import Header from './assets/components/Header.jsx';
import Page1 from './pages/Page1.jsx';
import Page2 from './pages/Page2.jsx';
import Page3 from "./pages/Page3.jsx";
import Page4 from "./pages/Page4.jsx";
import Page5 from "./pages/Page5.jsx";
import './App.css';
import {loadLocalStorageFile, saveLocalStorageFile} from "./assets/systems/SaveLoad.jsx";

function App() {

    const pages = 5;

    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const goToPage = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    const goToNextPage = useCallback(() => {
        if (currentPage < pages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    }, [currentPage]);

    const goToPreviousPage = useCallback(() => {
        if (currentPage > 1) {
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

    const selector = (navTitle) => {

        if (navTitle === currentPage) {
            return "> "
        }

    };

    return (
        <main>
            <div>
                {isLoading && (
                    <div id="loader">
                        <div className="loader"></div>
                    </div>
                )}
            </div>
            <Header titulo={ChoseTitle(currentPage)}
                    onNext={goToNextPage}
                    onBack={goToPreviousPage}
                    showBackButton={currentPage > 1}
                    showNextButton={currentPage < pages}
            />
            {currentPage === 1 && <Page1/>}
            {currentPage === 2 && <Page2/>}
            {currentPage === 3 && <Page3/>}
            {currentPage === 4 && <Page4/>}
            {currentPage === 5 && <Page5/>}

            <div className={"viewport up"}>
                <div className={"mb-3 sticky"}>
                    <div className={"icon-save right"}>
                        <div className={"navbar"}>
                            <span className={currentPage === 1 ? "" : 'off'}
                                  onClick={() => goToPage(1)}>{selector(1)}individual.</span>
                            <span className={currentPage === 2 ? "" : 'off'}
                                  onClick={() => goToPage(2)}>{selector(2)}características.</span>
                            <span className={currentPage === 3 ? "" : 'off'}
                                  onClick={() => goToPage(3)}>{selector(3)}status.</span>
                            <span className={currentPage === 4 ? "" : 'off'}
                                  onClick={() => goToPage(4)}>{selector(4)}skills.</span>
                            <span className={currentPage === 5 ? "" : 'off'}
                                  onClick={() => goToPage(5)}>{selector(5)}anotações.</span>
                        </div>
                    </div>

                </div>
            </div>
            <div className="viewport">
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
            </div>
        </main>
    );
}

/**
 * Chooses and returns a title based on the current page number.
 *
 * @param {number} page - The current page number.
 * @returns {string} The chosen title for the current page.
 */
function ChoseTitle(page) {
    const titles = ["console.log(individual)",
        "console.log(características)",
        "console.log(status)",
        "console.log(skills)",
        "console.log(anotações)"];
    return titles[page - 1]
}

export default App;