import { useEffect, useRef, useCallback, useContext } from "react";
import ProfilePicUploader from "../assets/components/ProfilePicUploader.jsx";
import { saveUserData } from "../firebaseUtils.js";
import { UserContext } from "../UserContext.jsx";

export default function Page1() {
    const { userData, setUserData, user } = useContext(UserContext);
    const debounceTimeout = useRef(null);

    const saveDataDebounced = useCallback((data) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            if (user) {
                saveUserData(data);
            }
        }, 500);
    }, [user]);

    useEffect(() => {
        saveDataDebounced(userData);
    }, [userData, saveDataDebounced]);

    const handleInputChange = (key) => (event) => {
        const { value, type } = event.target;
        setUserData((prevUserData) => ({
            ...prevUserData,
            [key]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value,
        }));
    };

    const getSelectorStyle = (value) => ({
        color: value === '' ? "var(--gray-placeholder)" : "white",
    });

    const localEnergy = useCallback(() => {
        const pre = userData["atributo-PRE"] || 0;
        const bioEnergy = userData["biotipo-Energia"] || 0;
        const energyMap = { 1: 2, 2: 3, 3: 4 };
        return (energyMap[bioEnergy] + pre) * userData.nivel || 0;
    }, [userData.nivel]);

    const localLife = useCallback(() => {
        const vig = userData["atributo-VIG"] || 0;
        const bioLife = userData["biotipo-Vida"] || 0;
        const lifeMap = { 1: 12, 2: 16, 3: 20 };
        return (lifeMap[bioLife] + vig) + ((userData.nivel - 1) * (lifeMap[bioLife] / 4 + vig)) || 0;
    }, [userData.nivel]);

    return (
        <main className="mainCommon page-1">
            <section className="section-identity">
                <article className="container-identity">
                    <div className="container-identity-inside outside">
                        <div className="container-identity-outside">
                            <div className="container-identity-outside-text">
                                <p className="container-identity-outside-text-p">
                                    REPÚBLICA FEDERATIVA DO BRASIL
                                </p>
                            </div>
                            <div className="container-identity-inside center">
                                <p>REGIÃO DE AGAMEMNON</p>
                                <p>SECRETARIA DE SEGURANÇA PÚBLICA</p>
                                <p>INSTITUTO DE IDENTIFICAÇÃO</p>
                            </div>
                            <div className="container-identity-inside">
                                <ProfilePicUploader />
                                <div className="container-identity-inside-text">
                                    <p>NOME: {userData.nome || ''}</p>
                                    <p>DATA NASCIMENTO: {userData.idade || ''}</p>
                                    <p>ÓRGÃO EXPEDIDOR: SSP-SEV</p>
                                </div>
                            </div>
                            <div className="container-identity-outside-text">
                                <p className="container-identity-outside-text-p">
                                    CARTEIRA DE IDENTIDADE
                                </p>
                            </div>
                        </div>
                    </div>
                </article>
            </section>

            <section className="section-pessoal">
                <div className="title-2-container">
                    <h2 className="mainCommon title-2">Pessoal</h2>
                </div>
                <fieldset className="page-1">
                    <input type="text" value={userData.nome || ''} onChange={handleInputChange('nome')} placeholder="nome" />
                    <input type="text" value={userData.titulo || ''} onChange={handleInputChange('titulo')} placeholder="título" />
                    <input type="text" className="input-small" value={userData.profissao || ''} onChange={handleInputChange('profissao')} placeholder="profissão" />
                </fieldset>
                <fieldset className="page-1">
                    <input type="text" value={userData.idade || ''} onChange={handleInputChange('idade')} className="input-small" placeholder="data de nascimento" />
                    <input type="number" value={userData.altura || ''} onChange={handleInputChange('altura')} min={0} step={0.01} className="input-small" placeholder="altura" />
                    <input type="number" value={userData.peso || ''} onChange={handleInputChange('peso')} min={0} step={0.1} className="input-small" placeholder="peso" />
                </fieldset>
            </section>

            <section className="section-forma">
                <div className="title-2-container">
                    <h2 className="mainCommon title-2">Forma</h2>
                </div>
                <fieldset className="page-1">
                    <div>
                        <input className="input-left" type="text" value={userData.nomeF || ''} onChange={handleInputChange('nomeF')} placeholder="nome da forma" />
                    </div>
                    <div className="custom-select-father meio">
                        <select className="form-select custom-select input-center-dropdown" style={getSelectorStyle(userData.forma || '')} onChange={handleInputChange('forma')} value={userData.forma || ''}>
                            <option value=''>medo/fobia/trauma</option>
                            <option value={1}>medo</option>
                            <option value={2}>fobia</option>
                            <option value={3}>trauma</option>
                        </select>
                    </div>
                    <div>
                        <input className="input-right" type="text" value={userData.tipoF || ''} onChange={handleInputChange('tipoF')} placeholder="tipo da forma" />
                    </div>
                </fieldset>
            </section>

            <section className="section-recursos">
                <fieldset className="page-1">
                    <div className="container-recurso">
                        <div className="title-2-container">
                            <h2 className="mainCommon title-2">Vida</h2>
                        </div>
                        <div className="container-recurso-inputs">
                            <input className="input-left disabled" type="number" value={localLife()} min={0} placeholder="pontos de vida" disabled />
                            <input className="input-right" type="number" value={userData.vidaGasta || ''} onChange={handleInputChange('vidaGasta')} min={0} placeholder="vida atual" />
                        </div>
                    </div>
                    <div className="container-recurso">
                        <div className="title-2-container">
                            <h2 className="mainCommon title-2">Estresse</h2>
                        </div>
                        <div className="container-recurso-inputs">
                            <input className="input-left disabled" type="number" value={(((userData['pericia-Foco'] || 0) / 2) * 10)} min={0} placeholder="pontos de estresse" disabled />
                            <input className="input-right" type="number" value={userData.estresseGasto || ''} onChange={handleInputChange('estresseGasto')} min={0} placeholder="estresse atual" />
                        </div>
                    </div>
                </fieldset>
                <fieldset className="page-1">
                    <div className="container-recurso">
                        <div className="title-2-container">
                            <h2 className="mainCommon title-2">Energia</h2>
                        </div>
                        <div className="container-recurso-inputs">
                            <input className="input-left disabled" type="number" value={localEnergy()} min={0} placeholder="pontos de energia" disabled />
                            <input className="input-right" type="number" value={userData.energiaGasta || ''} onChange={handleInputChange('energiaGasta')} min={0} placeholder="energia atual" />
                        </div>
                    </div>
                    <div className="container-recurso">
                        <div className="title-2-container">
                            <h2 className="mainCommon title-2">Sanidade</h2>
                        </div>
                        <div className="container-recurso-inputs">
                            <input className="input-left disabled" type="number" value={(((userData['pericia-Foco'] || 0) / 2) * 10)} min={0} placeholder="pontos de sanidade" disabled />
                            <input className="input-right" type="number" value={userData.sanidadeGasta || ''} onChange={handleInputChange('sanidadeGasta')} min={0} placeholder="sanidade atual" />
                        </div>
                    </div>
                </fieldset>
            </section>

            <section className="section-ajustes">
                <fieldset className="page-1 bottom">
                    <div className="display-block-center">
                        <div className="title-2-container">
                            <h2 className="mainCommon title-2">Defesa</h2>
                        </div>
                        <div>
                            <input className="input-left disabled" type="number" value={10 + (userData['atributo-DES'] || 0) + (userData['atributo-DES-bonus'] || 0) + userData.nivel} min={0} placeholder="pontos de defesa" disabled />
                        </div>
                    </div>
                    <div className="display-block-center">
                        <div className="title-2-container">
                            <h2 className="mainCommon title-2">Nível</h2>
                        </div>
                        <div className="display-flex-center">
                            <input className="input-center-dropdown" type="number" value={userData.nivel || ''} onChange={handleInputChange('nivel')} min={0} placeholder="nível atual" />
                        </div>
                    </div>
                    <div className="display-block-center">
                        <div className="title-2-container">
                            <h2 className="mainCommon title-2">Afinidade</h2>
                        </div>
                        <div className="custom-select-father direito">
                            <select className="form-select custom-select input-right" style={getSelectorStyle(userData.afinidade || '')} onChange={handleInputChange('afinidade')} value={userData.afinidade || ''}>
                                <option value=''>afinidade</option>
                                <option value={1}>aqua</option>
                                <option value={2}>axis</option>
                                <option value={3}>geo</option>
                                <option value={4}>khaos</option>
                                <option value={5}>lumen</option>
                                <option value={6}>pyro</option>
                                <option value={7}>volt</option>
                                <option value={8}>zephyr</option>
                                <option value={9}>tenebris</option>
                            </select>
                        </div>
                    </div>
                </fieldset>
            </section>

            <section className="section-statics">
                <div className="display-block-center">
                    <div className="title-2-container">
                        <h2 className="mainCommon title-2">DT</h2>
                    </div>
                    <fieldset className="page-1">
                        <div className="static-container display-flex-center">
                            <input className="static-status disabled" type="number" value={10 + (userData['atributo-PRE'] || 0) + (userData['atributo-PRE-bonus'] || 0) + userData.nivel} min={0} placeholder="pontos de defesa" disabled />
                        </div>
                    </fieldset>
                </div>
                <div className="display-block-center">
                    <div className="title-2-container">
                        <h2 className="mainCommon title-2">Deslocamento</h2>
                    </div>
                    <fieldset className="page-1">
                        <div className="static-container display-flex-center">
                            <input className="static-status disabled" type="number" value={9} min={0} placeholder="pontos de defesa" disabled />
                        </div>
                    </fieldset>
                </div>
            </section>
        </main>
    );
}