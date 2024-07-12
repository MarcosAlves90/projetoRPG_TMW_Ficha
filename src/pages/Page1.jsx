import {useEffect, useState} from "react";
import {getItem, saveItem, handleChange, deleteItem} from "../assets/systems/SaveLoad.jsx";

export default function Page1() {

    const [affinity, setAffinity] = useState(getItem('afinidade', ''));
    const [forma, setForma] = useState(getItem('forma', ''));

    const [name, setName] = useState(getItem('nome', ''));
    const [title, setTitle] = useState(getItem('titulo', ''));
    const [career, setCareer] = useState(getItem('profissao', ''));
    const [idade, setIdade] = useState(getItem('idade', ''));
    const [altura, setAltura] = useState(getItem('altura', ''));
    const [peso, setPeso] = useState(getItem('peso', ''));

    const [nomeF, setNomeF] = useState(getItem('nomeF', ''));
    const [tipoF, setTipoF] = useState(getItem('tipoF', ''));

    const [vidaGasta, setVidaGasta] = useState(getItem('vidaGasta', ''));
    const [estresseGasto, setEstresseGasto] = useState(getItem('estresseGasto', ''));
    const [energiaGasta, setEnergiaGasta] = useState(getItem('energiaGasta', ''));
    const [sanidadeGasta, setSanidadeGasta] = useState(getItem('sanidadeGasta', ''));

    const [level, setLevel] = useState(getItem('nivel', ''));

    useEffect(() => {

        const stateMap = {
            'nome': name,
            'titulo': title,
            'idade': idade,
            'profissao': career,
            'altura': altura,
            'peso': peso,
            'nomeF': nomeF,
            'tipoF': tipoF,
            'forma': forma,
            'vidaGasta': vidaGasta,
            'estresseGasto': estresseGasto,
            'energiaGasta': energiaGasta,
            'sanidadeGasta': sanidadeGasta,
            'afinidade': affinity,
            'nivel': level
        }

        Object.keys(stateMap).forEach((key) => {
            if (stateMap[key] !== '') {
                saveItem(key, stateMap[key]);
            } else {
                deleteItem(key);
            }
        });

    }, [name, title, idade, career, altura,
        peso, nomeF, tipoF, forma, vidaGasta,
        estresseGasto, energiaGasta,
        sanidadeGasta, affinity, level]);

    const getSelectorStyle = (value) => ({
        color: value === '' ? "var(--gray-placeholder)" : "white",
    });

    const seletorAfinidadeStyle = getSelectorStyle(affinity);
    const seletorFormaStyle = getSelectorStyle(forma);

    function localEnergy() {
        const pre = getItem('atributo-PRE', 0);
        const bioEnergy = getItem('biotipo-Energia', 0);

        if (bioEnergy === 1) {
            return (2 + pre) * level;
        } else if (bioEnergy === 2) {
            return (3 + pre) * level;
        } else if (bioEnergy === 3) {
            return (4 + pre)* level;
        } else {
            return 0;
        }
    }

    function localLife() {
        const vig = getItem('atributo-VIG', 0);
        const bioLife = getItem('biotipo-Vida', 0);

        if (bioLife === 1) {
            return (12 + vig) + ((level-1)*(2+vig));
        } else if (bioLife === 2) {
            return (16 + vig) + ((level-1)*(3+vig));
        } else if (bioLife === 3) {
            return (20 + vig) + ((level-1)*(4+vig));
        } else {
            return 0;
        }
    }

    return (
        <>
            <div className={"fichaComum"}>
                <section className={"section-pessoal"}>
                    <div className={"title-2-container"}>
                        <h2 className={"fichaComum title-2"}>pessoal.</h2>
                    </div>
                    <div>
                        <input type={"text"} value={name} onChange={handleChange(setName)}
                               placeholder="nome"/>
                        <input type={"text"} value={title} onChange={handleChange(setTitle)}
                               placeholder="título"/>
                        <input type={"text"} value={career} onChange={handleChange(setCareer)}
                               placeholder={"profissão"}/>
                    </div>
                    <div>
                        <input type={"number"}
                               value={idade}
                               onChange={handleChange(setIdade)}
                               min={0}
                               placeholder="idade"/>
                        <input type={"number"}
                               value={altura}
                               onChange={handleChange(setAltura)}
                               min={0}
                               step={0.01}
                               placeholder="altura"/>
                        <input type={"number"}
                               value={peso}
                               onChange={handleChange(setPeso)}
                               min={0}
                               step={0.1}
                               placeholder="peso"/>
                    </div>
                </section>
                <section className={"section-forma"}>
                    <div className={"title-2-container"}>
                        <h2 className={"fichaComum title-2"}>forma.</h2>
                    </div>
                    <div className={"status-meio justify-center"}>
                        <div>
                            <input className={"status-esquerdo"}
                                   type={"text"}
                                   value={nomeF}
                                   onChange={handleChange(setNomeF)}
                                   placeholder={"nome da forma"}/>
                        </div>
                        <div className={"custom-select-father meio"}>
                            <select className="form-select custom-select status-meio-dr"
                                    style={seletorFormaStyle}
                                    onChange={handleChange(setForma)}
                                    value={forma}>
                                <option value=''>medo/fobia/trauma</option>
                                <option value={1}>medo</option>
                                <option value={2}>fobia</option>
                                <option value={3}>trauma</option>
                            </select>
                        </div>
                        <div>
                            <input className={"status-direito"}
                                   type={"text"}
                                   value={tipoF}
                                   onChange={handleChange(setTipoF)}
                                   placeholder={"tipo da forma"}/>
                        </div>
                    </div>
                </section>
                <section className={"section-recursos"}>
                    <div className={"status-meio justify-center"}>
                        <div>
                            <div className={"title-2-container"}>
                                <h2 className={"fichaComum title-2"}>vida.</h2>
                            </div>
                            <div>
                                <input className={"status-esquerdo"}
                                       type={"number"}
                                       value={localLife()}
                                       min={0}
                                       placeholder={"pontos de vida"}
                                       disabled={true}/>
                                <input className={"status-direito"}
                                       type={"number"}
                                       value={vidaGasta}
                                       onChange={handleChange(setVidaGasta)}
                                       min={0}
                                       placeholder={"vida gasta"}/>
                            </div>
                        </div>
                        <div>
                            <div className={"title-2-container"}>
                                <h2 className={"fichaComum title-2"}>estresse.</h2>
                            </div>
                            <div>
                                <input className={"status-esquerdo"}
                                       type={"number"}
                                       value={((getItem(`pericia-${'Foco'}`)/2)*10) || 0}
                                       min={0}
                                       placeholder={"pontos de estresse"}
                                       disabled={true}/>
                                <input className={"status-direito"}
                                       type={"number"}
                                       value={estresseGasto}
                                       onChange={handleChange(setEstresseGasto)}
                                       min={0}
                                       placeholder={"estresse gasto"}/>
                            </div>
                        </div>
                    </div>
                    <div className={"status-meio justify-center"}>
                        <div>
                            <div className={"title-2-container"}>
                                <h2 className={"fichaComum title-2"}>energia.</h2>
                            </div>
                            <div>
                                <input className={"status-esquerdo"}
                                       type={"number"}
                                       value={localEnergy()}
                                       min={0}
                                       placeholder={"pontos de energia"}
                                       disabled={true}/>
                                <input className={"status-direito"}
                                       type={"number"}
                                       value={energiaGasta}
                                       onChange={handleChange(setEnergiaGasta)}
                                       min={0}
                                       placeholder={"energia gasta"}/>
                            </div>
                        </div>
                        <div>
                            <div className={"title-2-container"}>
                                <h2 className={"fichaComum title-2"}>sanidade.</h2>
                            </div>
                            <div>
                                <input className={"status-esquerdo"}
                                       type={"number"}
                                       value={((getItem(`pericia-${'Foco'}`)/2)*10) || 0}
                                       min={0}
                                       placeholder={"pontos de sanidade"}
                                       disabled={true}/>
                                <input className={"status-direito"}
                                       type={"number"}
                                       value={sanidadeGasta}
                                       onChange={handleChange(setSanidadeGasta)}
                                       min={0}
                                       placeholder={"sanidade gasta"}/>
                            </div>
                        </div>
                    </div>
                </section>
                <section className={"section-ajustes"}>
                    <div className={"status-meio justify-center"}>
                        <div>
                            <div className={"title-2-container"}>
                                <h2 className={"fichaComum title-2"}>defesa.</h2>
                            </div>
                            <div>
                                <input className={"status-esquerdo"}
                                       type={"number"}
                                       value={10 + getItem(`atributo-${'DES'}`, 0)}
                                       min={0}
                                       placeholder={"pontos de defesa"}
                                       disabled={true}/>
                            </div>
                        </div>
                        <div>
                            <div className={"title-2-container"}>
                                <h2 className={"fichaComum title-2"}>nível.</h2>
                            </div>
                            <div>
                                <input className={"status-meio-dr"}
                                       type={"number"}
                                       value={level}
                                       onChange={handleChange(setLevel)}
                                       min={0}
                                       placeholder={"nível atual"}/>
                            </div>
                        </div>
                        <div>
                            <div className={"title-2-container"}>
                                <h2 className={"fichaComum title-2"}>afinidade.</h2>
                            </div>
                            <div className={"custom-select-father direito"}>
                                <select className="form-select custom-select status-direito"
                                        style={seletorAfinidadeStyle}
                                        onChange={handleChange(setAffinity)}
                                        value={affinity}>
                                    <option value=''>afinidade</option>
                                    <option value={1}>pyro</option>
                                    <option value={2}>aqua</option>
                                    <option value={3}>geo</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )

}

