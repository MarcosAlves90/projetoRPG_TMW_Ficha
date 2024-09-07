import { useEffect, useState } from 'react';
import Header from './assets/components/Header.jsx';
import Page0 from './pages/Page0.jsx';
import Page1 from './pages/Page1.jsx';
import Page2 from './pages/Page2.jsx';
import Page3 from "./pages/Page3.jsx";
import Page4 from "./pages/Page4.jsx";
import Page5 from "./pages/Page5.jsx";
import './App.css';
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";

function App() {
    const [isLoading, setIsLoading] = useState(true);

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
        <main className={"appMain display-flex"}>
            <div>
                {(isLoading ) && (
                    <div id="loader">
                        <div className="loader" />
                    </div>
                )}
            </div>
            <Header />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Page0 />} />
                <Route path="/individual" element={<Page1 />} />
                <Route path="/caracteristicas" element={<Page2 />} />
                <Route path="/status" element={<Page3 />} />
                <Route path="/skills" element={<Page4 />} />
                <Route path="/anotacoes" element={<Page5 />} />
            </Routes>
        </main>
    );
}

export default App;