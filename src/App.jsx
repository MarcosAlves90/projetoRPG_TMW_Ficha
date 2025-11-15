import { lazy, useContext, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

import PageTemplate from "./assets/components/PageTemplate.jsx";
import { auth } from "./firebase.js";
import { UserContext } from "./UserContext.jsx";

import "./App.css";

/**
 * Rotas que não devem exibir a NavBar
 * @constant
 */
const ROUTES_WITHOUT_NAVBAR = ["/fichas", "/"];

// Lazy loading de páginas para otimização de performance
const Page0 = lazy(() => import("./pages/Page0.jsx"));
const Page1 = lazy(() => import("./pages/Page1.jsx"));
const Page2 = lazy(() => import("./pages/Page2.jsx"));
const Page3 = lazy(() => import("./pages/Page3.jsx"));
const Page4 = lazy(() => import("./pages/Page4.jsx"));
const Page5 = lazy(() => import("./pages/Page5.jsx"));
const Page6 = lazy(() => import("./pages/Page6.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Config = lazy(() => import("./pages/Config.jsx"));
const SheetSelectionPage = lazy(() => import("./pages/SheetSelectionPage.jsx"));

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
  { path: "/inventario", element: <Page6 /> },
];

/**
 * Componente principal da aplicação
 * Gerencia autenticação e roteamento
 * @returns {JSX.Element} Componente App
 */
function App() {
  const location = useLocation();
  const { setUser, setIsLoadingUserData, setUserData, forceSave } =
    useContext(UserContext);

  const shouldShowNavBar = !ROUTES_WITHOUT_NAVBAR.includes(location.pathname);

  /**
   * Força salvamento ao desmontar a página
   */
  useEffect(() => {
    return () => {
      forceSave?.();
    };
  }, [forceSave]);

  /**
   * Gerencia o ciclo de vida da autenticação do usuário
   */
  useEffect(() => {
    let isMounted = true;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      try {
        if (user) {
          setUser(user);
          // Gera código único para nova ficha se não tiver
          setUserData((prevData) => ({
            ...prevData,
            sheetCode: prevData.sheetCode || uuidv4(),
          }));
        } else {
          setUser(null);
          // Para usuários não autenticados, gera código único
          if (isMounted) {
            setUserData((prevData) => ({
              ...prevData,
              sheetCode: prevData.sheetCode || uuidv4(),
            }));
          }
        }
      } finally {
        if (isMounted) {
          setIsLoadingUserData(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribeAuth();
    };
  }, [setUser, setUserData, setIsLoadingUserData]);

  return (
    <main className="appMain display-flex">
      <PageTemplate showNav={shouldShowNavBar}>
        <Routes>
          {ROUTES_CONFIG.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </PageTemplate>
    </main>
  );
}

export default App;
