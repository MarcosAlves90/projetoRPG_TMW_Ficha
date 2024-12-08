import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import NavBar from './assets/components/NavBar.jsx';
import Page0 from './pages/Page0.jsx';
import Page1 from './pages/Page1.jsx';
import Page2 from './pages/Page2.jsx';
import Page3 from "./pages/Page3.jsx";
import Page4 from "./pages/Page4.jsx";
import Page5 from "./pages/Page5.jsx";
import Login from "./pages/Login.jsx";
import Config from "./pages/Config.jsx";
import SheetSelectionPage from "./pages/SheetSelectionPage.jsx";
import './App.css';
import Page6 from "./pages/Page6.jsx";

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        document.documentElement.classList.add('disable-scroll');
        const timer = setTimeout(() => {
            document.documentElement.classList.remove('disable-scroll');
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <main className="appMain display-flex">
            {isLoading && (
                <div id="loader">
                    <div className="loader" />
                </div>
            )}
            {location.pathname !== "/fichas" && <NavBar />}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Page0 />} />
                <Route path="/individual" element={<Page1/>} />
                <Route path="/caracteristicas" element={<Page2/>} />
                <Route path="/status" element={<Page3/>} />
                <Route path="/skills" element={<Page4/>} />
                <Route path="/anotacoes" element={<Page5/>} />
                <Route path="/fichas" element={<SheetSelectionPage />} />
                <Route path="/configuracoes" element={<Config />} />
                <Route path={"/inventario"} element={<Page6/>}/>
            </Routes>
        </main>
    );
}

export default App;