import {useEffect, useCallback, useContext, useState} from "react";
import {UserContext} from "../UserContext.jsx";
import {auth} from '../firebase.js';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {getUserData, createUserData} from '../firebaseUtils.js';
import {useNavigate} from 'react-router-dom';
import validator from 'validator';
import {decompressData} from "../assets/systems/SaveLoad.jsx";

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
            <div className="fixed inset-0 -z-10" style={{backgroundImage: `url('${background}')`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(5px)'}} />
            <main className="mainCommon page-login">
                <div className="bg-[#171d2e] rounded-[10px] border-[3px] border-[#2a3554] p-[5rem] w-[60%] md:w-full md:p-[3rem]">
                    <h1 className="text-white font-[Brevis] mb-12 text-[4vw] md:text-[11vw]">MidNight</h1>
                    <h2 className="text-[1.3vw] mb-6 md:text-[4vw]">Faça o seu login</h2>
                    <form id="login-form" onSubmit={handleLogin} className="flex flex-col gap-8">
                        <div>
                            <label className="block text-white text-[1vw] mb-2 md:text-[4vw]">Usuário</label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full px-4 py-2 bg-[#0f131f] text-white border-2 rounded-lg focus:outline-none font-[Montserrat] md:text-[4vw] md:h-[10vw] ${emailError ? 'border-red-500' : 'border-[#2a3554]'}`}
                            />
                        </div>
                        <div>
                            <label className="block text-white text-[1vw] mb-2 md:text-[4vw]">Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full px-4 py-2 bg-[#0f131f] text-white border-2 rounded-lg focus:outline-none font-[Montserrat] md:text-[4vw] md:h-[10vw] ${passwordError ? 'border-red-500' : 'border-[#2a3554]'}`}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-[#2a3554] text-[#f3e6ff] rounded-[3px] font-bold text-[1rem] hover:bg-[#646b88] transition-all md:text-[4vw] md:h-[10vw]"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </main>
        </>
    );
}