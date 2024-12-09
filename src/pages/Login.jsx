import { useEffect, useCallback, useContext, useState } from "react";
import { UserContext } from "../UserContext.jsx";
import { auth } from '../firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getUserData, saveUserData } from '../firebaseUtils.js';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import { decompressData } from "../assets/systems/SaveLoad.jsx";

const validateEmail = (email) => {
    return validator.isEmail(email);
};

const validatePassword = (password) => {
    return password.length >= 6;
};

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { setUserData } = useContext(UserContext);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                console.log("Usuário detectado.");
            } else {
                console.log("Usuário não detectado.");
            }
        });

        return () => {
            unsubscribe();
        };
    }, [navigate]);

    const handleLogin = useCallback(async (e) => {
        e.preventDefault();
        console.log("Tentando logar...");

        if (!validateEmail(email)) {
            setErrorMessage('Email inválido.');
            setTimeout(() => console.warn('Email inválido.'), 0);
            return;
        }
        if (!validatePassword(password)) {
            setErrorMessage('A Senha deve ter pelo menos 6 caracteres.');
            setTimeout(() => console.warn('A Senha deve ter pelo menos 6 caracteres.'), 0);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);

            let userData = await getUserData("data");
            if (userData) {
                console.log('Dados encontrados. Redirecionando...');
                userData = decompressData(userData);
                setUserData(userData);
            } else {
                console.log('Nenhum dado encontrado. Salvando dados...');
                await saveUserData('');
            }

            navigate('/individual');

        } catch (error) {
            setErrorMessage(`Erro ao tentar fazer login: ${error.message}`);
            console.error("Erro de login:", error);
        }
    }, [email, password]);

    useEffect(() => {
        const options = {
            animate: true,
            patternWidth: 100,
            patternHeight: 100,
            grainOpacity: 0.1,
            grainDensity: 1,
            grainWidth: 1,
            grainHeight: 1
        };

        // eslint-disable-next-line no-undef
        grained('#grain-background', options);
    }, []);

    return (
        <>
            <div id={"grain-background"}></div>
            <div className={"backgroundCommon negative"}/>
            <main className="mainCommon page-login">
                <article className={"loginCard"}>
                    <h2 className={"title-login"}>The Mental World Character Sheet Editor</h2>
                    <p className={"p-login"}>Por favor, faça login em sua conta</p>
                    <form id={"login-form"} onSubmit={handleLogin}>
                        <div className={"display-flex-center"}>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className={"display-flex-center"}>
                            <label htmlFor="password">Senha:</label>
                            <input
                                type="password"
                                id="password"
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