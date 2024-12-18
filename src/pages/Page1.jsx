import { useEffect, useState, useCallback } from "react";
import {
    getItem,
    saveItem,
    handleChange,
    deleteItem,
    returnLocalStorageData,
} from "../assets/systems/SaveLoad.jsx";
import ProfilePicUploader from "../assets/components/ProfilePicUploader.jsx";
import { saveUserData } from "../firebaseUtils.js";

export default function Page1() {
    const initialState = {
        afinidade: getItem('afinidade', ''),
        forma: getItem('forma', ''),
        nome: getItem('nome', ''),
        titulo: getItem('titulo', ''),
        profissao: getItem('profissao', ''),
        idade: getItem('idade', ''),
        altura: getItem('altura', ''),
        peso: getItem('peso', ''),
        nomeF: getItem('nomeF', ''),
        tipoF: getItem('tipoF', ''),
        vidaGasta: getItem('vidaGasta', ''),
        estresseGasto: getItem('estresseGasto', ''),
        energiaGasta: getItem('energiaGasta', ''),
        sanidadeGasta: getItem('sanidadeGasta', ''),
        nivel: getItem('nivel', ''),
    };

    const [state, setState] = useState(initialState);

    useEffect(() => {
        Object.entries(state).forEach(([key, value]) => {
            value !== '' ? saveItem(key, value) : deleteItem(key);
        });
        saveUserData(returnLocalStorageData());
    }, [state]);

    const handleInputChange = (key) => (event) => {
        const { value, type } = event.target;
        setState((prevState) => ({
            ...prevState,
            [key]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value,
        }));
    };

    const getSelectorStyle = (value) => ({
        color: value === '' ? "var(--gray-placeholder)" : "white",
    });

    const localEnergy = useCallback(() => {
        const pre = getItem('atributo-PRE', 0);
        const bioEnergy = getItem('biotipo-Energia', 0);
        const energyMap = { 1: 2, 2: 3, 3: 4 };
        return (energyMap[bioEnergy] + pre) * state.nivel || 0;
    }, [state.nivel]);

    const localLife = useCallback(() => {
        const vig = getItem('atributo-VIG', 0);
        const bioLife = getItem('biotipo-Vida', 0);
        const lifeMap = { 1: 12, 2: 16, 3: 20 };
        return (lifeMap[bioLife] + vig) + ((state.nivel - 1) * (lifeMap[bioLife] / 4 + vig)) || 0;
    }, [state.nivel]);

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
                                    <p>NOME: {state.nome}</p>
                                    <p>DATA NASCIMENTO: {state.idade}</p>
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
                    <input type="text" value={state.nome} onChange={handleInputChange('nome')} placeholder="nome" />
                    <input type="text" value={state.titulo} onChange={handleInputChange('titulo')} placeholder="título" />
                    <input type="text" className="input-small" value={state.profissao} onChange={handleInputChange('profissao')} placeholder="profissão" />
                </fieldset>
                <fieldset className="page-1">
                    <input type="text" value={state.idade} onChange={handleInputChange('idade')} className="input-small" placeholder="data de nascimento" />
                    <input type="number" value={state.altura} onChange={handleInputChange('altura')} min={0} step={0.01} className="input-small" placeholder="altura" />
                    <input type="number" value={state.peso} onChange={handleInputChange('peso')} min={0} step={0.1} className="input-small" placeholder="peso" />
                </fieldset>
            </section>

            <section className="section-forma">
                <div className="title-2-container">
                    <h2 className="mainCommon title-2">Forma</h2>
                </div>
                <fieldset className="page-1">
                    <div>
                        <input className="input-left" type="text" value={state.nomeF} onChange={handleInputChange('nomeF')} placeholder="nome da forma" />
                    </div>
                    <div className="custom-select-father meio">
                        <select className="form-select custom-select input-center-dropdown" style={getSelectorStyle(state.forma)} onChange={handleInputChange('forma')} value={state.forma}>
                            <option value=''>medo/fobia/trauma</option>
                            <option value={1}>medo</option>
                            <option value={2}>fobia</option>
                            <option value={3}>trauma</option>
                        </select>
                    </div>
                    <div>
                        <input className="input-right" type="text" value={state.tipoF} onChange={handleInputChange('tipoF')} placeholder="tipo da forma" />
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
                            <input className="input-right" type="number" value={state.vidaGasta} onChange={handleInputChange('vidaGasta')} min={0} placeholder="vida atual" />
                        </div>
                    </div>
                    <div className="container-recurso">
                        <div className="title-2-container">
                            <h2 className="mainCommon title-2">Estresse</h2>
                        </div>
                        <div className="container-recurso-inputs">
                            <input className="input-left disabled" type="number" value={((getItem('pericia-Foco', 0) / 2) * 10) || 0} min={0} placeholder="pontos de estresse" disabled />
                            <input className="input-right" type="number" value={state.estresseGasto} onChange={handleInputChange('estresseGasto')} min={0} placeholder="estresse atual" />
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
                            <input className="input-right" type="number" value={state.energiaGasta} onChange={handleInputChange('energiaGasta')} min={0} placeholder="energia atual" />
                        </div>
                    </div>
                    <div className="container-recurso">
                        <div className="title-2-container">
                            <h2 className="mainCommon title-2">Sanidade</h2>
                        </div>
                        <div className="container-recurso-inputs">
                            <input className="input-left disabled" type="number" value={((getItem('pericia-Foco', 0) / 2) * 10) || 0} min={0} placeholder="pontos de sanidade" disabled />
                            <input className="input-right" type="number" value={state.sanidadeGasta} onChange={handleInputChange('sanidadeGasta')} min={0} placeholder="sanidade atual" />
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
                            <input className="input-left disabled" type="number" value={10 + getItem('atributo-DES', 0) + getItem('atributo-DES-bonus', 0) + state.nivel} min={0} placeholder="pontos de defesa" disabled />
                        </div>
                    </div>
                    <div className="display-block-center">
                        <div className="title-2-container">
                            <h2 className="mainCommon title-2">Nível</h2>
                        </div>
                        <div className="display-flex-center">
                            <input className="input-center-dropdown" type="number" value={state.nivel} onChange={handleInputChange('nivel')} min={0} placeholder="nível atual" />
                        </div>
                    </div>
                    <div className="display-block-center">
                        <div className="title-2-container">
                            <h2 className="mainCommon title-2">Afinidade</h2>
                        </div>
                        <div className="custom-select-father direito">
                            <select className="form-select custom-select input-right" style={getSelectorStyle(state.afinidade)} onChange={handleInputChange('afinidade')} value={state.afinidade}>
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
                            <input className="static-status disabled" type="number" value={10 + getItem('atributo-PRE', 0) + getItem('atributo-PRE-bonus', 0) + state.nivel} min={0} placeholder="pontos de defesa" disabled />
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