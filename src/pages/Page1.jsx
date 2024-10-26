import {useEffect, useState} from "react";
import {
    getItem,
    saveItem,
    handleChange,
    deleteItem, returnLocalStorageData,
} from "../assets/systems/SaveLoad.jsx";
import ProfilePicUploader from "../assets/components/ProfilePicUploader.jsx";
import {saveUserData} from "../firebaseUtils.js";

export default function Page1() {

    const [afinidade, setAfinidade] = useState(getItem('afinidade', ''));
    const [forma, setForma] = useState(getItem('forma', ''));

    const [nome, setNome] = useState(getItem('nome', ''));
    const [titulo, setTitulo] = useState(getItem('titulo', ''));
    const [profissao, setProfissao] = useState(getItem('profissao', ''));
    const [idade, setIdade] = useState(getItem('idade', ''));
    const [altura, setAltura] = useState(getItem('altura', ''));
    const [peso, setPeso] = useState(getItem('peso', ''));

    const [nomeF, setNomeF] = useState(getItem('nomeF', ''));
    const [tipoF, setTipoF] = useState(getItem('tipoF', ''));

    const [vidaGasta, setVidaGasta] = useState(getItem('vidaGasta', ''));
    const [estresseGasto, setEstresseGasto] = useState(getItem('estresseGasto', ''));
    const [energiaGasta, setEnergiaGasta] = useState(getItem('energiaGasta', ''));
    const [sanidadeGasta, setSanidadeGasta] = useState(getItem('sanidadeGasta', ''));

    const [nivel, setNivel] = useState(getItem('nivel', ''));

    useEffect(() => {

        const stateMap = {
            nome,
            titulo,
            idade,
            profissao,
            altura,
            peso,
            nomeF,
            tipoF,
            forma,
            vidaGasta,
            estresseGasto,
            energiaGasta,
            sanidadeGasta,
            afinidade,
            nivel
        }

        Object.keys(stateMap).forEach((key) => {
            if (stateMap[key] !== '') {
                saveItem(key, stateMap[key]);
            } else {
                deleteItem(key);
            }
        });

        saveUserData(returnLocalStorageData());

    }, [nome, titulo, idade, profissao, altura,
        peso, nomeF, tipoF, forma, vidaGasta,
        estresseGasto, energiaGasta,
        sanidadeGasta, afinidade, nivel]);

    const getSelectorStyle = (value) => ({
        color: value === '' ? "var(--gray-placeholder)" : "white",
    });

    const seletorAfinidadeStyle = getSelectorStyle(afinidade);
    const seletorFormaStyle = getSelectorStyle(forma);

    function localEnergy() {
        const pre = getItem('atributo-PRE', 0);
        const bioEnergy = getItem('biotipo-Energia', 0);

        if (bioEnergy === 1) {
            return (2 + pre) * nivel;
        } else if (bioEnergy === 2) {
            return (3 + pre) * nivel;
        } else if (bioEnergy === 3) {
            return (4 + pre)* nivel;
        } else {
            return 0;
        }
    }

    /**
     * Calculates the total life points based on character's vigor and biotype.
     *
     * This function computes the character's total life points using their vigor (`vig`)
     * attribute and their life biotype (`bioLife`). The total life points are calculated
     * differently depending on the biotype, with each biotype having a base life points
     * value that is further modified by the character's level and vigor.
     *
     * - Biotype 1: Base of 12 life points, plus an additional (2 + vigor) for each level above 1.
     * - Biotype 2: Base of 16 life points, plus an additional (3 + vigor) for each level above 1.
     * - Biotype 3: Base of 20 life points, plus an additional (4 + vigor) for each level above 1.
     *
     * If the character's biotype does not match any of the specified cases, the function
     * returns 0, indicating no life points are calculated.
     *
     * @returns {number} The total calculated life points for the character.
     */
    function localLife() {
        const vig = getItem('atributo-VIG', 0);
        const bioLife = getItem('biotipo-Vida', 0);

        if (bioLife === 1) {
            return (12 + vig) + ((nivel-1)*(2+vig));
        } else if (bioLife === 2) {
            return (16 + vig) + ((nivel-1)*(3+vig));
        } else if (bioLife === 3) {
            return (20 + vig) + ((nivel-1)*(4+vig));
        } else {
            return 0;
        }
    }

    return (

        <main className={"mainCommon page-1"}>

            <section className={"section-identity"}>
                <article className={"container-identity"}>
                    <div className={"container-identity-inside outside"}>
                        <div className={"container-identity-outside"}>
                            <div className={"container-identity-outside-text"}>
                                <p className={"container-identity-outside-text-p"}>
                                    REPÚBLICA FEDERATIVA DO BRASIL
                                </p>
                            </div>
                            <div className={"container-identity-inside center"}>
                                <p>REGIÃO DE AGAMEMNON</p>
                                <p>SECRETARIA DE SEGURANÇA PÚBLICA</p>
                                <p>INSTITUTO DE IDENTIFICAÇÃO</p>
                            </div>
                            <div className={"container-identity-inside"}>
                                <ProfilePicUploader/>
                                <div className={"container-identity-inside-text"}>
                                    <p>NOME: {nome}</p>
                                    <p>DATA NASCIMENTO: {idade}</p>
                                    <p>ÓRGÃO EXPEDIDOR: SSP-SEV</p>
                                </div>
                            </div>
                            <div className={"container-identity-outside-text"}>
                                <p className={"container-identity-outside-text-p"}>
                                    CARTEIRA DE IDENTIDADE
                                </p>
                            </div>
                        </div>
                    </div>
                </article>
            </section>

            <section className={"section-pessoal"}>
                <div className={"title-2-container"}>
                    <h2 className={"mainCommon title-2"}>Pessoal</h2>
                </div>
                <fieldset className={"page-1"}>
                    <input type={"text"} value={nome} onChange={handleChange(setNome)}
                           placeholder="nome"/>
                    <input type={"text"} value={titulo} onChange={handleChange(setTitulo)}
                           placeholder="título"/>
                    <input type={"text"} className={"input-small"} value={profissao} onChange={handleChange(setProfissao)}
                           placeholder={"profissão"}/>
                </fieldset>
                <fieldset className={"page-1"}>
                    <input type={"text"}
                           value={idade}
                           onChange={handleChange(setIdade)}
                           className={"input-small"}
                           placeholder="data de nascimento"/>
                    <input type={"number"}
                           value={altura}
                           onChange={handleChange(setAltura)}
                           min={0}
                           step={0.01}
                           className={"input-small"}
                           placeholder="altura"/>
                    <input type={"number"}
                           value={peso}
                           onChange={handleChange(setPeso)}
                           min={0}
                           step={0.1}
                           className={"input-small"}
                           placeholder="peso"/>
                </fieldset>
            </section>

            <section className={"section-forma"}>
                <div className={"title-2-container"}>
                    <h2 className={"mainCommon title-2"}>Forma</h2>
                </div>
                <fieldset className={"page-1"}>
                    <div>
                        <input className={"input-left"}
                               type={"text"}
                               value={nomeF}
                               onChange={handleChange(setNomeF)}
                               placeholder={"nome da forma"}/>
                    </div>
                    <div className={"custom-select-father meio"}>
                        <select className="form-select custom-select input-center-dropdown"
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
                        <input className={"input-right"}
                               type={"text"}
                               value={tipoF}
                               onChange={handleChange(setTipoF)}
                               placeholder={"tipo da forma"}/>
                    </div>
                </fieldset>
            </section>

            <section className={"section-recursos"}>
                <fieldset className={"page-1"}>
                    <div className={"container-recurso"}>
                        <div className={"title-2-container"}>
                            <h2 className={"mainCommon title-2"}>Vida</h2>
                        </div>
                        <div className={"container-recurso-inputs"}>
                            <input className={"input-left"}
                                   type={"number"}
                                   value={localLife()}
                                   min={0}
                                   placeholder={"pontos de vida"}
                                   disabled={true}/>
                            <input className={"input-right"}
                                   type={"number"}
                                   value={vidaGasta}
                                   onChange={handleChange(setVidaGasta)}
                                   min={0}
                                   placeholder={"vida atual"}/>
                        </div>
                    </div>
                    <div className={"container-recurso"}>
                        <div className={"title-2-container"}>
                            <h2 className={"mainCommon title-2"}>Estresse</h2>
                        </div>
                        <div className={"container-recurso-inputs"}>
                            <input className={"input-left"}
                                   type={"number"}
                                   value={((getItem(`pericia-Foco`, 0) / 2) * 10) || 0}
                                   min={0}
                                   placeholder={"pontos de estresse"}
                                   disabled={true}/>
                            <input className={"input-right"}
                                   type={"number"}
                                   value={estresseGasto}
                                   onChange={handleChange(setEstresseGasto)}
                                   min={0}
                                   placeholder={"estresse atual"}/>
                        </div>
                    </div>
                </fieldset>
                <fieldset className={"page-1"}>
                    <div className={"container-recurso"}>
                        <div className={"title-2-container"}>
                            <h2 className={"mainCommon title-2"}>Energia</h2>
                        </div>
                        <div className={"container-recurso-inputs"}>
                            <input className={"input-left"}
                                   type={"number"}
                                   value={localEnergy()}
                                   min={0}
                                   placeholder={"pontos de energia"}
                                   disabled={true}/>
                            <input className={"input-right"}
                                   type={"number"}
                                   value={energiaGasta}
                                   onChange={handleChange(setEnergiaGasta)}
                                   min={0}
                                   placeholder={"energia atual"}/>
                        </div>
                    </div>
                    <div className={"container-recurso"}>
                        <div className={"title-2-container"}>
                            <h2 className={"mainCommon title-2"}>Sanidade</h2>
                        </div>
                        <div className={"container-recurso-inputs"}>
                            <input className={"input-left"}
                                   type={"number"}
                                   value={((getItem(`pericia-Foco`, 0) / 2) * 10) || 0}
                                   min={0}
                                   placeholder={"pontos de sanidade"}
                                   disabled={true}/>
                            <input className={"input-right"}
                                   type={"number"}
                                   value={sanidadeGasta}
                                   onChange={handleChange(setSanidadeGasta)}
                                   min={0}
                                   placeholder={"sanidade atual"}/>
                        </div>
                    </div>
                </fieldset>
            </section>

            <section className={"section-ajustes"}>
                <fieldset className={"page-1 bottom"}>
                    <div className={"display-block-center"}>
                        <div className={"title-2-container"}>
                            <h2 className={"mainCommon title-2"}>Defesa</h2>
                        </div>
                        <div>
                            <input className={"input-left"}
                                   type={"number"}
                                   value={10 +
                                       getItem(`atributo-DES`, 0) +
                                       getItem(`atributo-DES-bonus`, 0) +
                                       nivel}
                                   min={0}
                                   placeholder={"pontos de defesa"}
                                   disabled={true}/>
                        </div>
                    </div>
                    <div className={"display-block-center"}>
                        <div className={"title-2-container"}>
                            <h2 className={"mainCommon title-2"}>Nível</h2>
                        </div>
                        <div className={"display-flex-center"}>
                            <input className={"input-center-dropdown"}
                                   type={"number"}
                                   value={nivel}
                                   onChange={handleChange(setNivel)}
                                   min={0}
                                   placeholder={"nível atual"}/>
                        </div>
                    </div>
                    <div className={"display-block-center"}>
                        <div className={"title-2-container"}>
                            <h2 className={"mainCommon title-2"}>Afinidade</h2>
                        </div>
                        <div className={"custom-select-father direito"}>
                            <select className="form-select custom-select input-right"
                                    style={seletorAfinidadeStyle}
                                    onChange={handleChange(setAfinidade)}
                                    value={afinidade}>
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

            <section className={"section-statics"}>
                <div className={"display-block-center"}>
                    <div className={"title-2-container"}>
                        <h2 className={"mainCommon title-2"}>DT de Skill</h2>
                    </div>
                    <fieldset className={"page-1"}>
                        <div className={"static-container display-flex-center"}>
                            <input className={"static-status"}
                                   type={"number"}
                                   value={10 +
                                       getItem(`atributo-PRE`, 0) +
                                       getItem(`atributo-PRE-bonus`, 0) +
                                       nivel}
                                   min={0}
                                   placeholder={"pontos de defesa"}
                                   disabled={true}/>
                        </div>
                    </fieldset>
                </div>
                <div className={"display-block-center"}>
                    <div className={"title-2-container"}>
                        <h2 className={"mainCommon title-2"}>Deslocamento</h2>
                    </div>
                    <fieldset className={"page-1"}>
                        <div className={"static-container display-flex-center"}>
                            <input className={"static-status"}
                                   type={"number"}
                                   value={9}
                                   min={0}
                                   placeholder={"pontos de defesa"}
                                   disabled={true}/>
                        </div>
                    </fieldset>
                </div>
            </section>

        </main>

    )

}

