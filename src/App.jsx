import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js";
import { getUserData } from "./firebaseUtils.js";
import { importDatabaseData } from "./assets/systems/SaveLoad.jsx";
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

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const htmlElement = document.documentElement;
        htmlElement.classList.add('disable-scroll');

        const timer = setTimeout(() => {
            htmlElement.classList.remove('disable-scroll');
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("Usuário está logado");
                const userData = await getUserData("data");
                importDatabaseData(userData);
            } else {
                console.log("Usuário deslogado");
            }
        });

        return () => unsubscribe();
    }, [location.pathname]);

    return (
        <main className={"appMain display-flex"}>
            <div>
                {isLoading && (
                    <div id="loader">
                        <div className="loader" />
                    </div>
                )}
            </div>
            {location.pathname !== "/fichas" && <NavBar />}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Page0 />} />
                <Route path="/individual" element={<Page1 />} />
                <Route path="/caracteristicas" element={<Page2 />} />
                <Route path="/status" element={<Page3 />} />
                <Route path="/skills" element={<Page4 />} />
                <Route path="/anotacoes" element={<Page5 />} />
                <Route path="/fichas" element={<SheetSelectionPage />} />
                <Route path="/configuracoes" element={<Config />} />
            </Routes>
        </main>
    );
}

export default App;