import { useEffect, useState } from 'react';
import Title from './individual/title.jsx';
import FichaPage1 from './individual/FichaPage1.jsx';
import FichaPage2 from './individual/FichaPage2.jsx';
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
            <Title titulo={currentPage === 1 ? "Individual." : "Características."}
                   onNext={goToNextPage}
                   onBack={goToPreviousPage}
                   showBackButton={currentPage > 1}
                   showNextButton={currentPage < 2}
            />
            {currentPage === 1 && <FichaPage1 />}
            {currentPage === 2 && <FichaPage2 />}
        </>
    );
}

export default App;