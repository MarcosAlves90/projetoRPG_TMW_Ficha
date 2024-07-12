/**
 * Main application component that handles page navigation and loading state.
 * It utilizes React hooks for state management and effects to handle keyboard navigation
 * and a loading animation. The application is divided into three pages, with the ability
 * to navigate through them using arrow keys or UI buttons. It also includes functionality
 * to load and save data to local storage.
 */

import {useCallback, useEffect, useState} from 'react';
import Header from './assets/components/Header.jsx';
import Page1 from './pages/Page1.jsx';
import Page2 from './pages/Page2.jsx';
import Page3 from "./pages/Page3.jsx";
import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {loadLocalStorageFile, saveLocalStorageFile} from "./assets/systems/SaveLoad.jsx";

function App() {

    // State hooks for managing loading state and current page.
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // Callback for navigating to the next page.
    const goToNextPage = useCallback(() => {
        if (currentPage < 3) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    }, [currentPage]);

    // Callback for navigating to the previous page.
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
            // Obtém o elemento atualmente focado
            const focusedElement = document.activeElement;
            // Lista de tags que, se focadas, impedirão a navegação por teclado
            const focusableTags = ['INPUT', 'TEXTAREA', 'SELECT'];

            // Verifica se o elemento focado é um dos elementos de entrada
            if (focusableTags.includes(focusedElement.tagName)) {
                return; // Sai da função se um elemento de entrada estiver focado
            }

            // Handles navigation based on the key code
            switch (event.keyCode) {
                case 39: // Right arrow
                    goToNextPage();
                    break;
                case 37: // Left arrow
                    goToPreviousPage();
                    break;
                default:
                    break;
            }
        };

        // Adds the event listener for keydown events
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };

    }, [goToNextPage, goToPreviousPage]); // Dependencies for the useEffect hook

    // Effect for simulating a loading animation.
    useEffect(() => {
        const htmlElement = document.documentElement;

        htmlElement.classList.add('disable-scroll');

        const timer = setTimeout(() => {
            htmlElement.classList.remove('disable-scroll');
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Renders the application UI.
    return (
        <>
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
                    showNextButton={currentPage < 3}
            />
            {currentPage === 1 && <Page1/>}
            {currentPage === 2 && <Page2/>}
            {currentPage === 3 && <Page3/>}

            <div className="viewport">
                <div className="mb-3 sticky">
                    <input className="form-control dark" type="file" id="formFile"
                           onChange={loadLocalStorageFile} style={{display: 'none'}}/>
                    <button className="button-header active file"
                            onClick={() => document.getElementById('formFile').click()}>
                        <label htmlFor="formFile" style={{width: "100%"}} className="file-selector">Carregar</label>
                    </button>
                </div>
                <div className="icon-save center"></div>
                <div className="icon-save right">
                    <button className="button-header active" onClick={saveLocalStorageFile}>Salvar</button>
                </div>
            </div>
        </>
    );
}

/**
 * Chooses and returns a title based on the current page number.
 *
 * @param {number} page - The current page number.
 * @returns {string} The chosen title for the current page.
 */
function ChoseTitle(page) {
    const titles = ["console.log(individual)", "console.log(características)", "console.log(status)"];
    return titles[page - 1]
}

export default App;