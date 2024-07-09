import PropTypes from 'prop-types';
import {useEffect, useState} from "react";
import {deleteItem, getItem, handleChange, saveItem} from "./SaveLoad.jsx";
import 'bootstrap-icons/font/bootstrap-icons.css';

const lockedInputStyle = () => ({

    backgroundColor: "var(--green-background)",
    color: "var(--green-text)",
    border: "var(--green-border)"

})

export default function FichaPage3() {

    const [isLocked, setIsLocked] = useState(getItem('isLocked', false) === 'true')

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
                <div className={"title-2-container"}>
                    <button type="button"
                            className="button-lock"
                            onClick={() => setIsLocked(!isLocked)}
                            style={isLocked ? lockedInputStyle() : {}}>
                        {isLocked ? "Desbloquear entradas " : "Bloquear entradas "}
                        <i className={isLocked ? "bi bi-unlock-fill" : "bi bi-lock-fill"}></i>
                    </button>
                </div>
                <section className={"section-atributos"}>
                <div className={"title-2-container"}>
                        <h2 className={"fichaComum title-2"}>atributos.</h2>
                    </div>
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
                    <div className={"title-2-container"}>
                        <h2 className={"fichaComum title-2"}>perícias.</h2>
                    </div>
                    <PericiasSection isLocked={isLocked}/>
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

function PericiasSection({ isLocked }) {
    const pericias = [
        { pericia: "Acrobacia", atr: "DES" },
        { pericia: "Artes", atr: "PRE" },
        { pericia: "Atletismo", atr: "FOR" },
        { pericia: "Ciências", atr: "INT" },
        { pericia: "Enganação", atr: "PRE" },
        { pericia: "Foco", atr: "PRE" },
        { pericia: "Fortitude", atr: "VIG" },
        { pericia: "Furtividade", atr: "DES" },
        { pericia: "História", atr: "INT" },
        { pericia: "Iniciativa", atr: "DES" },
        { pericia: "Intimidação", atr: "PRE" },
        { pericia: "Intuição", atr: "INT" },
        { pericia: "Investigação", atr: "INT" },
        { pericia: "Luta", atr: "FOR" },
        { pericia: "Magia Arcana", atr: "INT" },
        { pericia: "Medicina", atr: "INT" },
        { pericia: "Percepção", atr: "PRE" },
        { pericia: "Persuasão", atr: "PRE" },
        { pericia: "Pilotagem", atr: "DES" },
        { pericia: "Precisão", atr: "DES" },
        { pericia: "Prestidigitação", atr: "DES" },
        { pericia: "Profissão", atr: "INT" },
        { pericia: "Reflexos", atr: "DES" },
        { pericia: "Religião", atr: "PRE" },
        { pericia: "Sobrevivência", atr: "INT" },
        { pericia: "Tática", atr: "INT" },
        { pericia: "Tecnologia", atr: "INT" },
        { pericia: "Vontade", atr: "PRE" },
    ];

    function groupPericias(pericias, groupSize) {
        const grouped = [];
        for (let i = 0; i < pericias.length; i += groupSize) {
            grouped.push(pericias.slice(i, i + groupSize));
        }
        return grouped;
    }

    return (
        <>
            {groupPericias(pericias, 4).map((group, index) => (
                <div className={"status-meio justify-center"} key={index}>
                    {group.map(({ pericia, atr }) => (
                        <Pericia isLocked={isLocked} pericia={pericia} atr={atr} key={pericia} />
                    ))}
                </div>
            ))}
        </>
    );
}

PericiasSection.propTypes = {
    isLocked: PropTypes.bool.isRequired,
}

function Pericia(props) {

    const [value, setValue] = useState(getItem(`pericia-${props.pericia}`, ''));

    useEffect(() => {
        const action = value === '' ? deleteItem : saveItem;
        action(`pericia-${props.pericia}`, value === '' ? undefined : parseInt(value, 10));
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
        const action = value === '' ? deleteItem : saveItem;
        action(`atributo-${props.atr}`, parseInt(value, 10) || undefined);
    }, [value, props.atr]);

    return (
        <div className={"input-group mb-3"}>

            <div className={"text-div"}>
                <span className={`input-group-text-left defined ${props.isLocked ? "locked" : ""}`}
                      style={{
                          backgroundColor: cores[props.atr].background,
                          color: cores[props.atr].color, border: `${cores[props.atr].background} 2px solid`
                      }}>{props.atributo}</span>
            </div>
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