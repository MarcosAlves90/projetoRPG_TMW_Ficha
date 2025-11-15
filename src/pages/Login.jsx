import {useEffect, useCallback, useContext, useState} from "react";
import {UserContext} from "../UserContext.jsx";
import {auth} from '../firebase.js';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {getUserData, createUserData} from '../firebaseUtils.js';
import {useNavigate} from 'react-router-dom';
import validator from 'validator';
import {decompressData} from "../assets/systems/SaveLoad.jsx";
import styled from 'styled-components';
import {TextField, Button} from '@mui/material';

const LoginTitle = styled.h1`
    color: white;
    font-family: 'Brevis', sans-serif;
    margin-bottom: 3rem;
    font-size: 4vw;
    @media (max-width: 991px) {
        font-size: 11vw;
    }
`;

const SubTitle = styled.h2`
    font-size: 1.3vw;
    margin-bottom: 1.5rem;

    @media (max-width: 991px) {
        font-size: 4vw;
    }
`;

const LoginCard = styled.article`
    background-color: var(--card-background);
    padding: 5rem 4rem;
    width: 60%;
    border-radius: 10px;
    border: var(--gray-border);

    & * {
        color: white;
    }

    @media (max-width: 991px) {
        width: 100%;
        padding: 3rem 2rem;
    }
`;

const StyledTextField = styled(TextField)`
    margin-bottom: 2rem;
    margin-top: 0;
    
    .MuiInputLabel-root, .MuiInputBase-input {
        font-family: var(--common-font-family), sans-serif !important;
    }

    & .MuiFilledInput-root {
        background-color: var(--background);
    }

    @media (max-width: 991px) {
        & .MuiInputBase-input, .MuiInputLabel-root {
            font-size: 3.5vw;
        }
    }
`;

const StyledButton = styled(Button)`
    width: 100%;
    padding: 0.4rem;
    border-radius: 3px;
    font-weight: bold;
    font-size: 1rem;
    color: var(--background);
    font-family: var(--common-font-family), sans-serif !important;

    @media (max-width: 991px) {
        font-size: 4vw;
    }
`;

const Background = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('${props => props.background}');
    background-size: cover;
    background-position: center;
    z-index: -2;
    image-rendering: pixelated;
    filter: blur(5px);

    /* Overlay de ruído leve para substituir a antiga lib grained */
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        pointer-events: none;
        background-image:
            radial-gradient(circle at 10% 10%, rgba(255,255,255,0.03) 0 2px, transparent 2px),
            radial-gradient(circle at 30% 70%, rgba(255,255,255,0.02) 0 2px, transparent 2px),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.03) 0 2px, transparent 2px),
            radial-gradient(circle at 50% 50%, rgba(0,0,0,0.04) 0 3px, transparent 3px);
        background-size: 200px 200px;
        mix-blend-mode: overlay;
        animation: grainMove 8s steps(2) infinite;
        opacity: 0.35;
    }

    @keyframes grainMove {
        0% { transform: translate(0, 0); }
        100% { transform: translate(-12px, 12px); }
    }
`;

const validateEmail = (email) => {
    return validator.isEmail(email);
};

const validatePassword = (password) => {
    return (
        !validator.isEmpty(password) &&
        validator.isLength(password, {min: 6, max: 20})
    )
};

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [background, setBackground] = useState("");
    const navigate = useNavigate();
    const {setUserData} = useContext(UserContext);

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

        const sanitizedEmail = validator.normalizeEmail(email || '');
        const trimmedEmail = validator.escape(validator.trim(sanitizedEmail));
        const trimmedPass = validator.trim(password || '');

        if (!validateEmail(trimmedEmail)) {
            setEmailError(true);
            setTimeout(() => console.warn('Email inválido.'), 0);
        }
        if (!validatePassword(trimmedPass)) {
            setPasswordError(true);
            setTimeout(() => console.warn('A Senha deve ter pelo menos 6 caracteres.'), 0);
        }

        if (emailError || passwordError) {
            return
        }

        try {
            await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPass);

            let userData = await getUserData("data");
            if (userData) {
                console.info('Dados encontrados. Redirecionando...');
                userData = decompressData(userData);
                setUserData(userData);
            } else {
                console.info('Nenhum dado encontrado. Salvando dados...');
                await createUserData('');
            }

            navigate('/individual');

        } catch (error) {
            console.error("Erro de login:", error);
        }
    }, [email, password]);



    useEffect(() => {
        const backgroundList = [
            "login_backgrounds/castle.gif",
            "login_backgrounds/cyberpunk.gif",
            "login_backgrounds/war.gif",
            "login_backgrounds/snow.gif",
            "login_backgrounds/autumn.gif",
            "login_backgrounds/cyberpunk_v2.gif",
            "login_backgrounds/minecraft.gif",
            "login_backgrounds/desert.gif",
            "login_backgrounds/desert_v2.gif",
        ];

        backgroundList.forEach((src) => {
            const img = new Image();
            img.src = src;
        });

        setBackground(backgroundList[Math.floor(Math.random() * backgroundList.length)]);
    }, []);

    return (
        <>
            <Background background={background} />
            <main className="mainCommon page-login">
                <LoginCard>
                    <LoginTitle>MidNight</LoginTitle>
                    <SubTitle>Faça o seu login</SubTitle>
                    <form id={"login-form"} onSubmit={handleLogin}>
                        <StyledTextField
                            variant="filled"
                            label="Usuário"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            error={emailError}
                            className={emailError ? "error" : ""}
                        />
                        <StyledTextField
                            variant="filled"
                            label="Senha"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            error={passwordError}
                            className={passwordError ? "error" : ""}
                        />
                        <StyledButton type="submit" variant="contained" color="primary">
                            Login
                        </StyledButton>
                    </form>
                </LoginCard>
            </main>
        </>
    );
}