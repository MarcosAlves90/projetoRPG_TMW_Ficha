import React, {StrictMode} from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@popperjs/core/dist/umd/popper.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import {UserProvider} from "./UserContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <UserProvider>
                <App />
            </UserProvider>
        </BrowserRouter>
    </StrictMode>,
)
