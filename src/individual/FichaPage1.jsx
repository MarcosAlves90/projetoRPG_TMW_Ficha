import {useState} from "react";

export default function FichaPage1() {

    const [afinidade, setAfinidade] = useState(0);

    const [nome, setNome] = useState('');
    const [titulo, setTitulo] = useState('');
    const [profissao, setProfissao] = useState('');
    const [idade, setIdade] = useState(0);
    const [altura, setAltura] = useState(0);
    const [peso, setPeso] = useState(0);

    const handleChange = (setter) => (event) => {
        if (setter === setAfinidade) {
            return setter(parseInt(event.target.value));
        }
        setter(event.target.value);
    };

    const seletorAfinidadeStyle = {
        color: afinidade === 0 ? "#6c757d" : "white",
    };

    return (
        <>
            <div className={"fichaComum"}>
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
                    <input type={"number"} value={idade || ''} onChange={handleChange(setIdade)} min={0}
                           placeholder="idade"/>
                    <input type={"number"} value={altura || ''} onChange={handleChange(setAltura)} min={0} step={0.01}
                           placeholder="altura"/>
                    <input type={"number"} value={peso || ''} onChange={handleChange(setPeso)} min={0} step={0.1}
                           placeholder="peso"/>
                </div>
                <h2 className={"fichaComum title-2"}>forma.</h2>
                <div>
                    <input type={"text"} placeholder={"nome da forma"}/>
                    <input type={"text"} placeholder={"medo/fobia/trauma"}/>
                    <input type={"text"} placeholder={"tipo da forma"}/>
                </div>
                <div className={"status-meio"}>
                    <div>
                        <h2 className={"fichaComum title-2"}>vida.</h2>
                        <div>
                            <input className={"status-esquerdo"} type={"number"} min={0}
                                   placeholder={"pontos de vida"}/>
                            <input className={"status-direito"} type={"number"} min={0}
                                   placeholder={"vida gasta"}/>
                        </div>
                    </div>
                    <div>
                        <h2 className={"fichaComum title-2"}>estresse.</h2>
                        <div>
                            <input className={"status-esquerdo"} type={"number"} min={0}
                                   placeholder={"pontos de estresse"}/>
                            <input className={"status-direito"} type={"number"} min={0}
                                   placeholder={"estresse gasto"}/>
                        </div>
                    </div>
                </div>
                <div className={"status-meio"}>
                    <div>
                        <h2 className={"fichaComum title-2"}>energia.</h2>
                        <div>
                            <input className={"status-esquerdo"} type={"number"} min={0}
                                   placeholder={"pontos de energia"}/>
                            <input className={"status-direito"} type={"number"} min={0}
                                   placeholder={"energia gasta"}/>
                        </div>
                    </div>
                    <div>
                        <h2 className={"fichaComum title-2"}>sanidade.</h2>
                        <div>
                            <input className={"status-esquerdo"} type={"number"} min={0}
                                   placeholder={"pontos de sanidade"}/>
                            <input className={"status-direito"} type={"number"} min={0}
                                   placeholder={"sanidade gasta"}/>
                        </div>
                    </div>
                </div>
                <div className={"status-meio"}>
                    <div>
                        <h2 className={"fichaComum title-2"}>defesa.</h2>
                        <div>
                            <input type={"number"} min={0}
                                   placeholder={"pontos de defesa"}/>
                        </div>
                    </div>
                    <div>
                        <h2 className={"fichaComum title-2"}>afinidade.</h2>
                        <div className={"custom-select-father"}>
                            <select className="form-select custom-select"
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
            </div>
        </>
    )

}

