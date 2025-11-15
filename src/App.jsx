import { lazy, useContext, useEffect, useCallback } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { v4 as uuidv4 } from 'uuid';

import PageTemplate from './assets/components/PageTemplate.jsx';
import { getUserData } from './firebaseUtils';
import { auth } from "./firebase.js";
import { UserContext } from "./UserContext.jsx";
import { decompressData } from './assets/systems/SaveLoad.jsx';

import './App.css';

/**
 * Rotas que não devem exibir a NavBar
 * @constant
 */
const ROUTES_WITHOUT_NAVBAR = ['/fichas', '/'];



// Lazy loading de páginas para otimização de performance
const Page0 = lazy(() => import('./pages/Page0.jsx'));
const Page1 = lazy(() => import('./pages/Page1.jsx'));
const Page2 = lazy(() => import('./pages/Page2.jsx'));
const Page3 = lazy(() => import('./pages/Page3.jsx'));
const Page4 = lazy(() => import('./pages/Page4.jsx'));
const Page5 = lazy(() => import('./pages/Page5.jsx'));
const Page6 = lazy(() => import('./pages/Page6.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Config = lazy(() => import('./pages/Config.jsx'));
const SheetSelectionPage = lazy(() => import('./pages/SheetSelectionPage.jsx'));

/**
 * Configuração de rotas da aplicação
 * Centraliza todas as definições de roteamento
 * @constant
 */
const ROUTES_CONFIG = [
    { path: "/login", element: <Login /> },
    { path: "/", element: <Page0 /> },
    { path: "/individual", element: <Page1 /> },
    { path: "/caracteristicas", element: <Page2 /> },
    { path: "/status", element: <Page3 /> },
    { path: "/skills", element: <Page4 /> },
    { path: "/anotacoes", element: <Page5 /> },
    { path: "/fichas", element: <SheetSelectionPage /> },
    { path: "/configuracoes", element: <Config /> },
    { path: "/inventario", element: <Page6 /> }
];

/**
 * Componente principal da aplicação
 * Gerencia autenticação, carregamento de dados do usuário e roteamento
 * @returns {JSX.Element} Componente App
 */
function App() {
    const location = useLocation();
    const { userData, setUserData, setUser, setIsLoadingUserData } = useContext(UserContext);
    
    const shouldShowNavBar = !ROUTES_WITHOUT_NAVBAR.includes(location.pathname);

    /**
     * Atualiza um campo específico dos dados do usuário
     * @param {string} key - Chave do campo a ser atualizado
     * @returns {Function} Função que recebe o novo valor
     */
    const handleElementChange = useCallback((key) => (value) => {
        setUserData((prevUserData) => ({
            ...prevUserData,
            [key]: value,
        }));
    }, [setUserData]);

    /**
     * Busca e descomprime os dados do usuário do Firebase
     * @param {boolean} isMounted - Flag para verificar se o componente está montado
     */
    const fetchUserData = useCallback(async (isMounted) => {
        try {
            let data = await getUserData('data');
            
            if (!isMounted) return;

            if (data) {
                const decompressedData = decompressData(data);
                
                // Garante que cada ficha tenha um código único
                if (!decompressedData.sheetCode) {
                    decompressedData.sheetCode = uuidv4();
                }
                
                setUserData(decompressedData);
            }
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
        } finally {
            if (isMounted) {
                setIsLoadingUserData(false);
            }
        }
    }, [setUserData, setIsLoadingUserData]);

    /**
     * Gerencia o ciclo de vida da autenticação do usuário
     */
    useEffect(() => {
        let isMounted = true;

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                await fetchUserData(isMounted);
            } else {
                setUser(null);
                
                // Gera código único para sessões não autenticadas
                if (!userData.sheetCode) {
                    handleElementChange('sheetCode')(uuidv4());
                }
                
                setIsLoadingUserData(false);
            }
        });

        return () => {
            isMounted = false;
            unsubscribeAuth();
        };
    }, [setUser, fetchUserData, userData.sheetCode, handleElementChange, setIsLoadingUserData]);



    return (
        <main className="appMain display-flex">
            <PageTemplate showNav={shouldShowNavBar}>
                <Routes>
                    {ROUTES_CONFIG.map((route) => (
                        <Route 
                            key={route.path} 
                            path={route.path} 
                            element={route.element} 
                        />
                    ))}
                </Routes>
            </PageTemplate>
        </main>
    );
}

export default App;