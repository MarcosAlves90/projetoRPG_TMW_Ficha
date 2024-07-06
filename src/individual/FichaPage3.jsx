import PropTypes from 'prop-types';

export default function FichaPage3() {
    return (
        <>
            <div className={"fichaComum"}>
                <section className={"section-atributos"}>
                    <h2 className={"fichaComum title-2"}>atributos.</h2>
                    <div className={"status-meio justify-center min"}>
                        <Atributos atributo={"DESTREZA"} atr={"DES"}/>
                        <Atributos atributo={"FORÇA"} atr={"FOR"}/>
                        <Atributos atributo={"INTELIGÊNCIA"} atr={"INT"}/>
                        <Atributos atributo={"PRESENÇA"} atr={"PRE"}/>
                        <Atributos atributo={"VIGOR"} atr={"VIG"}/>
                    </div>
                    <div className={"status-meio justify-center min"}>

                    </div>
                </section>
                <section className={"section-pericias"}>
                <h2 className={"fichaComum title-2"}>perícias.</h2>
                    <div className={"status-meio justify-center"}>
                        <Pericia pericia={"Acrobacia"} atr={"DES"}/>
                        <Pericia pericia={"Artes"} atr={"PRE"}/>
                        <Pericia pericia={"Atletismo"} atr={"FOR"}/>
                        <Pericia pericia={"Ciências"} atr={"INT"}/>
                        <Pericia pericia={"Enganação"} atr={"PRE"}/>
                    </div>
                    <div className={"status-meio justify-center"}>
                        <Pericia pericia={"Foco"} atr={"PRE"}/>
                        <Pericia pericia={"Fortitude"} atr={"VIG"}/>
                        <Pericia pericia={"Furtividade"} atr={"DES"}/>
                        <Pericia pericia={"História"} atr={"INT"}/>
                        <Pericia pericia={"Iniciativa"} atr={"DES"}/>
                    </div>
                    <div className={"status-meio justify-center"}>
                        <Pericia pericia={"Intimidação"} atr={"PRE"}/>
                        <Pericia pericia={"Intuição"} atr={"INT"}/>
                        <Pericia pericia={"Investigação"} atr={"INT"}/>
                        <Pericia pericia={"Luta"} atr={"FOR"}/>
                        <Pericia pericia={"Magia Arcana"} atr={"INT"}/>
                    </div>
                    <div className={"status-meio justify-center"}>
                        <Pericia pericia={"Medicina"} atr={"INT"}/>
                        <Pericia pericia={"Percepção"} atr={"PRE"}/>
                        <Pericia pericia={"Persuasão"} atr={"PRE"}/>
                        <Pericia pericia={"Precisão"} atr={"DES"}/>
                        <Pericia pericia={"Prestidigitação"} atr={"DES"}/>
                    </div>
                    <div className={"status-meio justify-center"}>
                        <Pericia pericia={"Profissão"} atr={"INT"}/>
                        <Pericia pericia={"Reflexos"} atr={"DES"}/>
                        <Pericia pericia={"Religião"} atr={"PRE"}/>
                        <Pericia pericia={"Sobrevivência"} atr={"INT"}/>
                        <Pericia pericia={"Tática"} atr={"INT"}/>
                    </div>
                    <div className={"status-meio justify-center min"}>
                        <Pericia pericia={"Tecnologia"} atr={"INT"}/>
                        <Pericia pericia={"Vontade"} atr={"PRE"}/>
                    </div>
                </section>
            </div>
        </>
    )
}

let cores = {
    "DES" : {"background" : "var(--yellow-des)", "color" : "black"},
    "FOR" : {"background" : "var(--red-for)", "color" : "white"},
    "INT" : {"background" : "var(--blue-int)", "color" : "white"},
    "PRE" : {"background" : "var(--purple-pre)", "color" : "white"},
    "VIG" : {"background" : "var(--green-vig)", "color" : "white"},
}

function Pericia(props) {

    return (
        <div className={"input-group mb-3"}>

            <span className={"input-group-text-left"}
                  style={{backgroundColor: cores[props.atr].background,
                      color: cores[props.atr].color}}>{props.atr}</span>
            <span className={"input-group-text-center"}>{props.pericia}</span>
            <input type={"number"}
                   step={1}
                   min={0}
                   className="form-control input-wmargin"
                   placeholder="0"
                   onKeyDownCapture={handleKeyPress}
                   id={`label-${props.pericia}`}
            />
        </div>
    )
}

Pericia.propTypes = {
    pericia: PropTypes.string.isRequired,
    atr: PropTypes.string.isRequired,
};

function Atributos(props) {

    return (
        <div className={"input-group mb-3"}>

            <span className={"input-group-text-left defined"}
                  style={{backgroundColor: cores[props.atr].background,
                color: cores[props.atr].color}}>{props.atributo}</span>
            <input type={"number"}
                   step={1}
                   min={0}
                   className="form-control input-wmargin"
                   placeholder="0"
                   onKeyDownCapture={handleKeyPress}
                   style={{borderColor: cores[props.atr].background}}
                   id={`label-${props.atributo}`}
            />
        </div>
    )

}

Atributos.propTypes = {
    atributo: PropTypes.string.isRequired,
    atr: PropTypes.string.isRequired,
};

function handleKeyPress(event) {
    // Verifica se a tecla pressionada é Control+A, Control+C ou Control+V
    if (event.ctrlKey && (event.key === 'a' || event.key === 'c')) {
        return; // Não faz nada, permitindo a ação padrão do navegador
    }

    // Verifica se a tecla pressionada não é um número e não é uma tecla de controle (como backspace, delete, etc.)
    if (!/[0-9]/.test(event.key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'].includes(event.key)) {
        event.preventDefault();
    }
}