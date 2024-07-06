import {useEffect, useState} from "react";
import {getItem, saveItem} from "./SaveLoad.jsx";

export default function FichaPage1() {

    const [afinidade, setAfinidade] = useState(getItem('afinidade', 0));
    const [forma, setForma] = useState(getItem('forma', 0));

    const [nome, setNome] = useState(getItem('nome', ''));
    const [titulo, setTitulo] = useState(getItem('titulo', ''));
    const [profissao, setProfissao] = useState(getItem('profissao', ''));
    const [idade, setIdade] = useState(getItem('idade', 0));
    const [altura, setAltura] = useState(getItem('altura', 0));
    const [peso, setPeso] = useState(getItem('peso', 0));

    const [nomeF, setNomeF] = useState(getItem('nomeF', ''));
    const [tipoF, setTipoF] = useState(getItem('tipoF', ''));

    const [vida, setVida] = useState(getItem('vida', 0));
    const [vidaGasta, setVidaGasta] = useState(getItem('vidaGasta', 0));
    const [estresse, setEstresse] = useState(getItem('estresse', 0));
    const [estresseGasto, setEstresseGasto] = useState(getItem('estresseGasto', 0));
    const [energia, setEnergia] = useState(getItem('energia', 0));
    const [energiaGasta, setEnergiaGasta] = useState(getItem('energiaGasta', 0));
    const [sanidade, setSanidade] = useState(getItem('sanidade', 0));
    const [sanidadeGasta, setSanidadeGasta] = useState(getItem('sanidadeGasta', 0));

    const [defesa, setDefesa] = useState(getItem('defesa', 0));
    const [nivel, setNivel] = useState(getItem('nivel', 0));

    useEffect(() => {
        ['nome',
            'titulo',
            'idade',
            'profissao',
            'altura',
            'peso',
            'nomeF',
            'tipoF',
            'forma',
            'vida',
            'vidaGasta',
            'estresse',
            'estresseGasto',
            'energia',
            'energiaGasta',
            'sanidade',
            'sanidadeGasta',
            'defesa',
            'afinidade',
            'nivel'].forEach(key => saveItem(key, eval(key)));
    }, [nome, titulo, idade, profissao, altura,
        peso, nomeF, tipoF, forma, vida, vidaGasta,
        estresse, estresseGasto, energia, energiaGasta,
        sanidade, sanidadeGasta, defesa, afinidade,
        nivel]);

    const handleChange = (setter) => (event) => {
        const value = event.target.value;
        if (event.target.type === 'number') {
            setter(value === '' ? '' : parseInt(value, 10));
        } else {
            setter(value);
        }
    };

    const seletorAfinidadeStyle = {
        color: afinidade === 0 ? "var(--gray-placeholder)" : "white",
    };

    const seletorFormaStyle = {
        color: forma === 0 ? "var(--gray-placeholder)" : "white",
    }

    return (
        <>
            <div className={"fichaComum"}>
                <section className={"section-pessoal"}>
                    <h2 className={"fichaComum title-2"}>pessoal.</h2>
                    <div>
                        <input type={"text"} value={nome} onChange={handleChange(setNome)}
                               placeholder="nome"/>
                        <input type={"text"} value={titulo} onChange={handleChange(setTitulo)}
                               placeholder="título"/>
                        <input type={"text"} value={profissao} onChange={handleChange(setProfissao)}
                               placeholder={"profissão"}/>
                    </div>
                    <div>
                        <input type={"number"}
                               value={idade || ''}
                               onChange={handleChange(setIdade)}
                               min={0}
                               placeholder="idade"/>
                        <input type={"number"}
                               value={altura || ''}
                               onChange={handleChange(setAltura)}
                               min={0}
                               step={0.01}
                               placeholder="altura"/>
                        <input type={"number"}
                               value={peso || ''}
                               onChange={handleChange(setPeso)}
                               min={0}
                               step={0.1}
                               placeholder="peso"/>
                    </div>
                </section>
                <section className={"section-forma"}>
                    <h2 className={"fichaComum title-2"}>forma.</h2>
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
                                <option value={0}>medo/fobia/trauma</option>
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
                    <div className={"status-meio"}>
                        <div>
                            <h2 className={"fichaComum title-2"}>vida.</h2>
                            <div>
                                <input className={"status-esquerdo"}
                                       type={"number"}
                                       value={vida || ''}
                                       onChange={handleChange(setVida)}
                                       min={0}
                                       placeholder={"pontos de vida"}/>
                                <input className={"status-direito"}
                                       type={"number"}
                                       value={vidaGasta || ''}
                                        onChange={handleChange(setVidaGasta)}
                                       min={0}
                                       placeholder={"vida gasta"}/>
                            </div>
                        </div>
                        <div>
                            <h2 className={"fichaComum title-2"}>estresse.</h2>
                            <div>
                                <input className={"status-esquerdo"}
                                       type={"number"}
                                       value={estresse || ''}
                                        onChange={handleChange(setEstresse)}
                                       min={0}
                                       placeholder={"pontos de estresse"}/>
                                <input className={"status-direito"}
                                       type={"number"}
                                       value={estresseGasto || ''}
                                        onChange={handleChange(setEstresseGasto)}
                                       min={0}
                                       placeholder={"estresse gasto"}/>
                            </div>
                        </div>
                    </div>
                    <div className={"status-meio"}>
                        <div>
                            <h2 className={"fichaComum title-2"}>energia.</h2>
                            <div>
                                <input className={"status-esquerdo"}
                                       type={"number"}
                                       value={energia}
                                        onChange={handleChange(setEnergia)}
                                       min={0}
                                       placeholder={"pontos de energia"}/>
                                <input className={"status-direito"}
                                       type={"number"}
                                       value={energiaGasta}
                                        onChange={handleChange(setEnergiaGasta)}
                                       min={0}
                                       placeholder={"energia gasta"}/>
                            </div>
                        </div>
                        <div>
                            <h2 className={"fichaComum title-2"}>sanidade.</h2>
                            <div>
                                <input className={"status-esquerdo"}
                                       type={"number"}
                                       value={sanidade}
                                       onChange={handleChange(setSanidade)}
                                       min={0}
                                       placeholder={"pontos de sanidade"}/>
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
                            <h2 className={"fichaComum title-2"}>defesa.</h2>
                            <div>
                                <input className={"status-esquerdo"}
                                       type={"number"}
                                       value={defesa || ''}
                                        onChange={handleChange(setDefesa)}
                                       min={0}
                                       placeholder={"pontos de defesa"}/>
                            </div>
                        </div>
                        <div>
                            <h2 className={"fichaComum title-2"}>nível.</h2>
                            <div>
                                <input className={"status-meio-dr"}
                                       type={"number"}
                                       value={nivel || ''}
                                        onChange={handleChange(setNivel)}
                                       min={0}
                                       placeholder={"nível atual"}/>
                            </div>
                        </div>
                        <div>
                            <h2 className={"fichaComum title-2"}>afinidade.</h2>
                            <div className={"custom-select-father direito"}>
                                <select className="form-select custom-select status-direito"
                                        style={seletorAfinidadeStyle}
                                        onChange={handleChange(setAfinidade)}
                                        value={afinidade}>
                                    <option value={0}>afinidade</option>
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

