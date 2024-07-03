
export default function FichaPage1() {

    return (
        <div className={"fichaComum"}>
            <h2 className={"fichaComum-title-2"}>pessoal.</h2>
            <div>
                <input type={"text"} placeholder="nome"/>
                <input type={"text"} placeholder="título"/>
                <input type={"text"} placeholder={"profissão"}/>
            </div>
            <div>
                <input type={"number"} min={0} placeholder="idade"/>
                <input type={"number"} min={0} step={0.01} placeholder={"altura"}/>
                <input type={"number"} min={0} step={0.1} placeholder={"peso"}/>
            </div>
            <h2 className={"fichaComum-title-2"}>forma.</h2>
            <div>
                <input type={"text"} placeholder={"nome da forma"}/>
                <input type={"text"} placeholder={"medo/fobia/trauma"}/>
                <input type={"text"} placeholder={"tipo da forma"}/>
            </div>
            <div className={"status-meio"}>
                <div>
                    <h2 className={"fichaComum-title-2"}>vida.</h2>
                    <div>
                        <input className={"status-esquerdo"} type={"number"} min={0}
                               placeholder={"pontos de vida"}/>
                        <input className={"status-direito"} type={"number"} min={0}
                               placeholder={"vida gasta"}/>
                    </div>
                </div>
                <div>
                    <h2 className={"fichaComum-title-2"}>estresse.</h2>
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
                    <h2 className={"fichaComum-title-2"}>energia.</h2>
                    <div>
                        <input className={"status-esquerdo"} type={"number"} min={0}
                               placeholder={"pontos de energia"}/>
                        <input className={"status-direito"} type={"number"} min={0}
                               placeholder={"energia gasta"}/>
                    </div>
                </div>
                <div>
                    <h2 className={"fichaComum-title-2"}>sanidade.</h2>
                    <div>
                        <input className={"status-esquerdo"} type={"number"} min={0}
                               placeholder={"pontos de sanidade"}/>
                        <input className={"status-direito"} type={"number"} min={0}
                               placeholder={"sanidade gasta"}/>
                    </div>
                </div>
            </div>
            <div className={"status-meio status-drop"}>
                <div>
                    <h2 className={"fichaComum-title-2"}>defesa.</h2>
                    <div>
                        <input type={"number"} min={0}
                               placeholder={"pontos de defesa"}/>
                    </div>
                </div>
                <div>
                    <h2 className={"fichaComum-title-2"}>afinidade.</h2>
                    <div className={"custom-selection"}>
                        <select>
                            <option value={""}>nenhuma</option>
                            <option value={"fogo"}>pyro</option>
                            <option value={"água"}>aqua</option>
                            <option value={"terra"}>geo</option>
                            <option value={"ar"}>zephyr</option>
                            <option value={"luz"}>lumen</option>
                            <option value={"trevas"}>umbra</option>
                            <option value={"eletricidade"}>volt</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )

}

export function Title1() {

    return (
        "Individual."
    )

}