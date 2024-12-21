import { Suspense, lazy, useContext, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import NavBar from './assets/components/NavBar.jsx';
import './App.css';
import { getUserData } from './firebaseUtils';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js";
import { UserContext } from "./UserContext.jsx";
import { v4 as uuidv4 } from 'uuid';
import { decompressData } from './assets/systems/SaveLoad.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#101524',
            paper: '#101524',
        },
    },
});

// Lazy load components
const Page0 = lazy(() => import('./pages/Page0.jsx'));
const Page1 = lazy(() => import('./pages/Page1.jsx'));
const Page2 = lazy(() => import('./pages/Page2.jsx'));
const Page3 = lazy(() => import('./pages/Page3.jsx'));
const Page4 = lazy(() => import('./pages/Page4.jsx'));
const Page5 = lazy(() => import('./pages/Page5.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Config = lazy(() => import('./pages/Config.jsx'));
const SheetSelectionPage = lazy(() => import('./pages/SheetSelectionPage.jsx'));
const Page6 = lazy(() => import('./pages/Page6.jsx'));

function App() {
    const location = useLocation();
    const { userData, setUserData, setUser } = useContext(UserContext);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const handleElementChange = (key) => (value) => {
        setUserData((prevUserData) => ({
            ...prevUserData,
            [key]: value,
        }));
    };

    const fetchUserData = async (isMounted) => {
        try {
            let data = await getUserData('data');
            if (data && isMounted) {
                data = decompressData(data);
                if (!data.sheetCode) {
                    data.sheetCode = uuidv4();
                }
                setUserData(data);
                setIsDataLoaded(true);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        let isMounted = true;
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                await fetchUserData(isMounted);
            } else {
                setUser(null);
                if (!userData.sheetCode) {
                    handleElementChange('sheetCode')(uuidv4());
                }
                setIsDataLoaded(true);
            }
        });

        return () => {
            isMounted = false;
            unsubscribeAuth();
        };
    }, []);

    if (!isDataLoaded) {
        return (
            <div id="loader">
                <div className="loader" />
            </div>
        );
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <main className="appMain display-flex">
                {location.pathname !== "/fichas" && <NavBar />}
                <Suspense fallback={
                    <div id="loader">
                        <div className="loader" />
                    </div>}>
                    <Routes>
                        {routes.map((route, index) => (
                            <Route key={index} path={route.path} element={route.element} />
                        ))}
                    </Routes>
                </Suspense>
            </main>
        </ThemeProvider>
    );
}

const routes = [
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

export default App;