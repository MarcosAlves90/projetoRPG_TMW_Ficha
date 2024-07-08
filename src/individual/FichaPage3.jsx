import PropTypes from 'prop-types';
import {useEffect, useState} from "react";
import {deleteItem, getItem, handleChange, saveItem} from "./SaveLoad.jsx";

const lockedInputStyle = () => ({

    backgroundColor: "var(--green-background)",
    color: "var(--green-text)",
    border: "var(--green-border)"

})

export default function FichaPage3() {

    const [isLocked, setIsLocked] = useState(getItem('isLocked', false))

    useEffect(() => {
        if (isLocked) {
            saveItem('isLocked', true);
        } else {
            deleteItem('isLocked');
        }
    })

    return (
        <>
            <div className={"fichaComum"}>
                <button type="button"
                        className="button-lock"
                        onClick={() => setIsLocked(!isLocked)}
                        style={isLocked ? lockedInputStyle() : {}}>
                    {isLocked ? "Desbloquear entradas" : "Bloquear entradas"}
                </button>
                <section className={"section-atributos"}>
                    <h2 className={"fichaComum title-2"}>atributos.</h2>
                    <div className={"status-meio justify-center min"}>
                        <Atributos isLocked={isLocked} atributo={"DESTREZA"} atr={"DES"}/>
                        <Atributos isLocked={isLocked} atributo={"FORÇA"} atr={"FOR"}/>
                        <Atributos isLocked={isLocked} atributo={"INTELIGÊNCIA"} atr={"INT"}/>
                        <Atributos isLocked={isLocked} atributo={"PRESENÇA"} atr={"PRE"}/>
                        <Atributos isLocked={isLocked} atributo={"VIGOR"} atr={"VIG"}/>
                    </div>
                    <div className={"status-meio justify-center min"}>

                    </div>
                </section>
                <section className={"section-pericias"}>
                    <h2 className={"fichaComum title-2"}>perícias.</h2>
                    <div className={"status-meio justify-center"}>
                        <Pericia isLocked={isLocked} pericia={"Acrobacia"} atr={"DES"}/>
                        <Pericia isLocked={isLocked} pericia={"Artes"} atr={"PRE"}/>
                        <Pericia isLocked={isLocked} pericia={"Atletismo"} atr={"FOR"}/>
                        <Pericia isLocked={isLocked} pericia={"Ciências"} atr={"INT"}/>
                        <Pericia isLocked={isLocked} pericia={"Enganação"} atr={"PRE"}/>
                    </div>
                    <div className={"status-meio justify-center"}>
                        <Pericia isLocked={isLocked} pericia={"Foco"} atr={"PRE"}/>
                        <Pericia isLocked={isLocked} pericia={"Fortitude"} atr={"VIG"}/>
                        <Pericia isLocked={isLocked} pericia={"Furtividade"} atr={"DES"}/>
                        <Pericia isLocked={isLocked} pericia={"História"} atr={"INT"}/>
                        <Pericia isLocked={isLocked} pericia={"Iniciativa"} atr={"DES"}/>
                    </div>
                    <div className={"status-meio justify-center"}>
                        <Pericia isLocked={isLocked} pericia={"Intimidação"} atr={"PRE"}/>
                        <Pericia isLocked={isLocked} pericia={"Intuição"} atr={"INT"}/>
                        <Pericia isLocked={isLocked} pericia={"Investigação"} atr={"INT"}/>
                        <Pericia isLocked={isLocked} pericia={"Luta"} atr={"FOR"}/>
                        <Pericia isLocked={isLocked} pericia={"Magia Arcana"} atr={"INT"}/>
                    </div>
                    <div className={"status-meio justify-center"}>
                        <Pericia isLocked={isLocked} pericia={"Medicina"} atr={"INT"}/>
                        <Pericia isLocked={isLocked} pericia={"Percepção"} atr={"PRE"}/>
                        <Pericia isLocked={isLocked} pericia={"Persuasão"} atr={"PRE"}/>
                        <Pericia isLocked={isLocked} pericia={"Precisão"} atr={"DES"}/>
                        <Pericia isLocked={isLocked} pericia={"Prestidigitação"} atr={"DES"}/>
                    </div>
                    <div className={"status-meio justify-center"}>
                        <Pericia isLocked={isLocked} pericia={"Profissão"} atr={"INT"}/>
                        <Pericia isLocked={isLocked} pericia={"Reflexos"} atr={"DES"}/>
                        <Pericia isLocked={isLocked} pericia={"Religião"} atr={"PRE"}/>
                        <Pericia isLocked={isLocked} pericia={"Sobrevivência"} atr={"INT"}/>
                        <Pericia isLocked={isLocked} pericia={"Tática"} atr={"INT"}/>
                    </div>
                    <div className={"status-meio justify-center min"}>
                        <Pericia isLocked={isLocked} pericia={"Tecnologia"} atr={"INT"}/>
                        <Pericia isLocked={isLocked} pericia={"Vontade"} atr={"PRE"}/>
                    </div>
                </section>
            </div>
        </>
    )
}

let cores = {
    "DES": {"background": "var(--yellow-des)", "color" : "black"},
    "FOR" : {"background" : "var(--red-for)", "color" : "white"},
    "INT" : {"background" : "var(--blue-int)", "color" : "white"},
    "PRE" : {"background" : "var(--purple-pre)", "color" : "white"},
    "VIG" : {"background" : "var(--green-vig)", "color" : "white"},
}

function Pericia(props) {

    const [value, setValue] = useState(getItem(`pericia-${props.pericia}`, ''));

    useEffect(() => {
        if (value === '') {
            deleteItem(`pericia-${props.pericia}`);
        } else {
            saveItem(`pericia-${props.pericia}`, parseInt(value, 10));
        }
    }, [value, props.pericia]);

    return (
        <div className={"input-group mb-3"}>
            <span className={"input-group-text-left"}
                  style={{backgroundColor: cores[props.atr].background,
                      color: cores[props.atr].color}}>{props.atr}</span>
            <span className={"input-group-text-center"}
                  style={props.isLocked ? {borderColor: `${cores[props.atr].background}`} : {}}>
                {props.pericia}</span>
            <input type={"number"}
                   step={1}
                   min={0}
                   className="form-control input-wmargin"
                   placeholder="0"
                   value={value >= getItem('nivel', 1) ?
                       getItem('nivel', 1) : value}
                   onChange={handleChange(setValue)}
                   onKeyDownCapture={handleKeyPress}
                   id={`label-${props.pericia}`}
                   disabled={props.isLocked}
                   style={props.isLocked ? {borderColor: `${cores[props.atr].background}`} : {}}
            />
        </div>
    )
}

Pericia.propTypes = {
    pericia: PropTypes.string.isRequired,
    atr: PropTypes.string.isRequired,
    isLocked: PropTypes.bool.isRequired,
};

function Atributos(props) {

    const [value, setValue] = useState(getItem(`atributo-${props.atr}`, ''));

    useEffect(() => {
        if (value === '') {
            deleteItem(`atributo-${props.atr}`);
        } else {
            saveItem(`atributo-${props.atr}`, parseInt(value, 10));
        }
    }, [value, props.atr]);

    return (
        <div className={"input-group mb-3"}>

            <span className={`input-group-text-left defined ${props.isLocked ? "locked" : ""}`}
                  style={{backgroundColor: cores[props.atr].background,
                color: cores[props.atr].color, border: `${cores[props.atr].background} 2px solid`}}>{props.atributo}</span>
            <input type={"number"}
                   step={1}
                   min={0}
                   className="form-control input-wmargin"
                   placeholder="0"
                   value={value >= atributesCap() ? atributesCap() : value}
                   onChange={handleChange(setValue)}
                   onKeyDownCapture={handleKeyPress}
                   style={props.isLocked ? {borderColor: cores[props.atr].background} : {}}
                   id={`label-${props.atributo}`}
                   disabled={props.isLocked}
            />
        </div>
    )

}

Atributos.propTypes = {
    atributo: PropTypes.string.isRequired,
    atr: PropTypes.string.isRequired,
    isLocked: PropTypes.bool.isRequired,
};

function atributesCap() {
    if (getItem('nivel', 1) < 4) {
        return 3;
    } else if (getItem('nivel', 1) < 10) {
        return 4;
    } else {
        return 5;
    }
}

function handleKeyPress(event) {
    // Verifica se a tecla pressionada é Control+A, Control+C ou Control+V
    if (event.ctrlKey && (event.key === 'a' || event.key === 'c')) {
        return; // Não faz nada, permitindo a ação padrão do navegador
    }

    // Verifica se a tecla pressionada não é um número e não é uma tecla de controle (como backspace, delete, etc.)
    if (!/[0-9]/.test(event.key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        event.preventDefault();
    }
}