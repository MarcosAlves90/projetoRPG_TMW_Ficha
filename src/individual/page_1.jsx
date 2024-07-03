
export default function FichaPage1() {

    return (
        <div className={"fichaComum"}>
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
            <div>
                <input type={"text"} placeholder={"nome da forma"}/>
                <input type={"text"} placeholder={"medo/fobia/trauma"}/>
                <input type={"text"} placeholder={"tipo da forma"}/>
            </div>
        </div>
    )

}

export function Title1() {

    return (
        "Individual."
    )

}