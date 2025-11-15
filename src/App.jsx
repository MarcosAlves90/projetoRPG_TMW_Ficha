import { lazy, useContext, useEffect, useCallback } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

import PageTemplate from "./assets/components/PageTemplate.jsx";
import { auth, db } from "./firebase.js";
import { UserContext } from "./UserContext.jsx";
import { FirebaseStorageAdapter } from "@/services/storage/FirebaseStorageAdapter.js";
import { CompressionManager } from "@/services/storage/DataSyncManager.js";

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
 * Gerencia autenticação, carregamento de dados do usuário e roteamento
 * @returns {JSX.Element} Componente App
 */
function App() {
  const location = useLocation();
  const { userData, setUserData, setUser, setIsLoadingUserData, forceSync } =
    useContext(UserContext);

  const shouldShowNavBar = !ROUTES_WITHOUT_NAVBAR.includes(location.pathname);

  /**
   * Sincroniza dados do Firebase ao autenticar
   * @param {string} userId - ID do usuário autenticado
   */
  const syncFromFirebase = useCallback(
    async (userId) => {
      try {
        const firebaseAdapter = new FirebaseStorageAdapter(db, userId);
        const remoteData = await firebaseAdapter.getItem("data");

        if (remoteData) {
          const decompressedData =
            CompressionManager.decompressRecursive(remoteData);

          // Garante que cada ficha tenha um código único
          if (!decompressedData.sheetCode) {
            decompressedData.sheetCode = uuidv4();
          }

          setUserData(decompressedData);
          console.info("[App] Dados sincronizados do Firebase");
        } else {
          // Se não há dados no Firebase, gera novo código para nova ficha
          setUserData((prevData) => ({
            ...prevData,
            sheetCode: prevData.sheetCode || uuidv4(),
          }));
        }
      } catch (error) {
        console.error("[App] Erro ao sincronizar dados do Firebase:", error);
      }
    },
    [setUserData],
  );

  /**
   * Gerencia o ciclo de vida da autenticação do usuário
   */
  useEffect(() => {
    let isMounted = true;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setUser(user);

          // Sincroniza dados do Firebase se necessário
          if (isMounted) {
            await syncFromFirebase(user.uid);
          }
        } else {
          setUser(null);

          // Para usuários não autenticados, gera código único
          if (!userData.sheetCode && isMounted) {
            setUserData((prevData) => ({
              ...prevData,
              sheetCode: uuidv4(),
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
  }, [
    setUser,
    syncFromFirebase,
    userData.sheetCode,
    setUserData,
    setIsLoadingUserData,
  ]);

  /**
   * Sincroniza com Firebase periodicamente (a cada 30 segundos)
   */
  useEffect(() => {
    const syncInterval = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        await forceSync();
      }
    }, 30000);

    return () => clearInterval(syncInterval);
  }, [forceSync]);

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
