import { useState, useEffect } from 'react';
import { auth } from '../firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getUserData, saveUserData } from '../firebaseUtils.js';
import { useNavigate } from 'react-router-dom';
import {importDatabaseData} from "../assets/systems/SaveLoad.jsx";

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
    return password.length >= 6;
};

const sanitizeInput = (input) => {
    const element = document.createElement('div');
    element.innerText = input;
    return element.innerHTML;
};

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                navigate('/individual');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Tentando logar...");

        if (!validateEmail(email)) {
            setErrorMessage('Email inválido.');
            setTimeout(() => console.error('Email inválido.'), 0);
            return;
        }
        if (!validatePassword(password)) {
            setErrorMessage('A Senha deve ter pelo menos 6 caracteres.');
            setTimeout(() => console.error('A Senha deve ter pelo menos 6 caracteres.'), 0);
            return;
        }

        const sanitizedEmail = sanitizeInput(email);
        const sanitizedPassword = sanitizeInput(password);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, sanitizedEmail, sanitizedPassword);

            const userId = userCredential.user.uid;

            const userData = await getUserData(userId);
            if (userData) {
                console.log('Dados encontrados. Redirecionando...');
                importDatabaseData(userData);
            } else {
                console.log('Nenhum dado encontrado. Salvando dados...');
                await saveUserData(userId, '');
            }

            navigate('/individual');
        } catch (error) {
            setErrorMessage(`Erro ao tentar fazer login: ${error.message}`);
            console.error("Erro de login:", error);
        }
    };

    return (
        <>
            <div className={"backgroundCommon negative"}/>
            <main className="mainCommon page-login">
                <article className={"loginCard"}>
                    <h2 className={"title-login"}>The Mental World Character Sheet Editor</h2>
                    <p className={"p-login"}>Por favor, faça login em sua conta</p>
                    <form id={"login-form"} onSubmit={handleLogin}>
                        <div className={"display-flex-center"}>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className={"display-flex-center"}>
                            <label>Senha:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {errorMessage && <p className={"p-error"} style={{color: 'red'}}>{errorMessage}</p>}
                        <button className={"button-header submit"} type="submit">Fazer login</button>
                    </form>
                </article>
            </main>
        </>
    );
}