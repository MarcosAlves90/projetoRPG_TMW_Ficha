import {useCallback, useEffect, useState} from 'react';
import Header from './individual/Header.jsx';
import FichaPage1 from './individual/FichaPage1.jsx';
import FichaPage2 from './individual/FichaPage2.jsx';
import FichaPage3 from "./individual/FichaPage3.jsx";
import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {carregarArquivoParaLocalStorage, salvarLocalStorageComoArquivo} from "./individual/SaveLoad.jsx";

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const goToNextPage = useCallback(() => {
        if (currentPage < 3) { // Supondo que 3 seja o número total de páginas
            setCurrentPage((prevPage) => prevPage + 1);
        }
    }, [currentPage]); // Dependências de useCallback

    const goToPreviousPage = useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    }, [currentPage]); // Dependências de useCallback

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.keyCode) {
                case 39: // Seta para a direita
                    goToNextPage();
                    break;
                case 37: // Seta para a esquerda
                    goToPreviousPage();
                    break;
                default:
                    break;
            }
        };

        // Adiciona o ouvinte de eventos ao pressionar uma tecla
        window.addEventListener('keydown', handleKeyDown);

        // Remove o ouvinte de eventos ao desmontar o componente
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [goToNextPage, goToPreviousPage]); // Dependências do useEffect

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

    const simularCliqueNoInput = () => {
        document.getElementById('formFile').click();}

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
            {currentPage === 1 && <FichaPage1/>}
            {currentPage === 2 && <FichaPage2/>}
            {currentPage === 3 && <FichaPage3/>}

            <div className="viewport">
                <div className="mb-3 sticky">
                    <input className="form-control dark" type="file" id="formFile"
                           onChange={carregarArquivoParaLocalStorage} style={{display: 'none'}}/>
                    <button className="button-header active file"
                            onClick={() => document.getElementById('formFile').click()}>
                        <label htmlFor="formFile" style={{width: "100%"}} className="file-selector">Carregar</label>
                    </button>
                </div>
                <div className="icon-save center"></div>
                <div className="icon-save right">
                    <button className="button-header active" onClick={salvarLocalStorageComoArquivo}>Salvar</button>
                </div>
            </div>
        </>
    );
}

function EscolherTitulo(pagina) {
    const titles = ["console.log(individual)", "console.log(caracteristicas)", "console.log(status)"];
    return titles[pagina - 1]
}

export default App;