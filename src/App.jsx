import { useEffect, useState } from 'react';
import Header from './individual/Header.jsx';
import FichaPage1 from './individual/FichaPage1.jsx';
import FichaPage2 from './individual/FichaPage2.jsx';
import FichaPage3 from "./individual/FichaPage3.jsx";
import './App.css';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const goToNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    useEffect(() => {
        const htmlElement = document.documentElement;

        // Adiciona a classe 'disable-scroll' ao elemento html
        htmlElement.classList.add('disable-scroll');

        const timer = setTimeout(() => {
            // Remove a classe 'disable-scroll' do elemento html
            htmlElement.classList.remove('disable-scroll');
            // Esconde o loader
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div>
                {isLoading && (
                    <div id="loader">
                        <div className="loader"></div>
                    </div>
                )}
            </div>
            <Header titulo={EscolherTitulo(currentPage)}
                    onNext={goToNextPage}
                    onBack={goToPreviousPage}
                    showBackButton={currentPage > 1}
                    showNextButton={currentPage < 3}
            />
            {currentPage === 1 && <FichaPage1 />}
            {currentPage === 2 && <FichaPage2 />}
            {currentPage === 3 && <FichaPage3 />}
        </>
    );
}

function EscolherTitulo(pagina) {
    const titles = ["Individual.", "Características.", "Status"];
    return titles[pagina - 1]
}

export default App;