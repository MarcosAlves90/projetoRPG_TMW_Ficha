import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase.js";
import { getUserData } from "./firebaseUtils.js";
import { importDatabaseData, returnLocalStorageData } from "./assets/systems/SaveLoad.jsx";
import { onSnapshot, doc } from "firebase/firestore";
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
    const [userData, setUserData] = useState(null);
    const location = useLocation();

    useEffect(() => {
        document.documentElement.classList.add('disable-scroll');
        const timer = setTimeout(() => {
            document.documentElement.classList.remove('disable-scroll');
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const initialUserData = await getUserData("data");
                setUserData(initialUserData);
                importDatabaseData(initialUserData);

                const userDoc = doc(db, 'userData', user.uid);
                const unsubscribeSnapshot = onSnapshot(userDoc, (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const newData = docSnapshot.data().data;
                        if (JSON.stringify(returnLocalStorageData()) !== JSON.stringify(newData)) {
                            setUserData(newData);
                            importDatabaseData(newData);
                        }
                    }
                });

                return () => unsubscribeSnapshot();
            }
        });

        return () => unsubscribeAuth();
    }, [location.pathname]);

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
                <Route path="/individual" element={<Page1 userData={userData} />} />
                <Route path="/caracteristicas" element={<Page2 userData={userData} />} />
                <Route path="/status" element={<Page3 userData={userData} />} />
                <Route path="/skills" element={<Page4 userData={userData} />} />
                <Route path="/anotacoes" element={<Page5 userData={userData} />} />
                <Route path="/fichas" element={<SheetSelectionPage />} />
                <Route path="/configuracoes" element={<Config />} />
                <Route path={"/inventario"} element={<Page6/>}/>
            </Routes>
        </main>
    );
}

export default App;