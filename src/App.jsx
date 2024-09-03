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
import { loadLocalStorageFile, saveLocalStorageFile} from "./assets/systems/SaveLoad.jsx";
import {Route, Routes} from "react-router-dom";

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(parseInt(sessionStorage.getItem('currentPage')) || 0);
    const [configMenuIsVisible, setConfigMenuIsVisible] = useState(false);


    useEffect(() => {

        if (currentPage !== 0) {
            sessionStorage.setItem('currentPage', currentPage);
        } else {
            sessionStorage.removeItem('currentPage');
        }

    }, [currentPage]);

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
        <main className={"display-flex"}>
            <div>
                {isLoading && (
                    <div id="loader">
                        <div className="loader" />
                    </div>
                )}
            </div>
            <Header/>
            <Routes>
                <Route path="/" element={<Page0/>} />
                <Route path="/individual" element={<Page1/>} />
                <Route path="/caracteristicas" element={<Page2/>} />
                <Route path="/status" element={<Page3/>} />
                <Route path="/skills" element={<Page4/>} />
                <Route path="/anotacoes" element={<Page5/>} />
            </Routes>

            {currentPage !== 0 && configMenuIsVisible ? <div className="fixed-bottom">
                <div className="mb-3 sticky">
                    <div className="icon-save right">
                        <button className="button-header active up clear"
                                onClick={() => {
                                    localStorage.clear();
                                    location.reload()
                                }}>
                            {"Limpar "}
                            <i className="bi bi-trash3-fill" />
                        </button>
                    </div>
                    <input className="form-control dark" type="file" id="formFile"
                           onChange={loadLocalStorageFile} style={{display: 'none'}}/>
                    <button className="button-header active file"
                            onClick={() => document.getElementById('formFile').click()}>
                        <label htmlFor="formFile" style={{width: "100%"}} className="file-selector">
                            {"Carregar "}
                            <i className="bi bi-box-arrow-up" />
                        </label>
                    </button>
                </div>
                <div className="mb-3 sticky">
                    <div className={"icon-save right"}>
                        <button className={"button-header active up"} onClick={() => scrollTo(0, 0)}>
                            {"Subir "}
                            <i className="bi bi-caret-up-fill" />
                        </button>
                    </div>
                    <button className="button-header active" onClick={saveLocalStorageFile}>
                        {"Salvar "}
                        <i className="bi bi-floppy2-fill" />
                    </button>
                </div>
            </div> : null}
        </main>
    );
}

export default App;