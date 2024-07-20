import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {deleteItem, getItem, handleChange, saveItem} from "../SaveLoad.jsx";
import {arcColors, atrColors, bioColors} from "../../styles/CommonStyles.jsx";
import {arcArray, perArray, subArcArray} from "./FichaPage3Arrays.jsx";

export function Biotipos(props) {

    const [value, setValue] = useState(getItem(`biotipo-${props.biotipo}`, ''));

    useEffect(() => {
        const action = value === '' ? deleteItem : saveItem;
        action(`biotipo-${props.biotipo}`, parseInt(value, 10) || 0);
    }, [value, props.biotipo]);

    return (
        <div className={"input-group mb-3"}>

            <div className={"text-div"}>
                <span className={`input-group-text-left defined ${props.isLocked ? "locked" : ""}`}
                      style={{
                          backgroundColor: bioColors[props.biotipo].background,
                          color: bioColors[props.biotipo].color, border: `${bioColors[props.biotipo].background} 2px solid`
                      }}>{props.biotipo}</span>
            </div>
            <input type={"number"}
                   step={1}
                   min={0}
                   className="form-control input-wmargin"
                   placeholder="0"
                   value={value}
                   onChange={handleChange(setValue)}
                   onKeyDownCapture={handleKeyPress}
                   style={props.isLocked ? {borderColor: bioColors[props.biotipo].background} : {}}
                   id={`label-${props.biotipo}`}
                   disabled={props.isLocked}
            />
        </div>
    )

}

Biotipos.propTypes = {
    biotipo: PropTypes.string.isRequired,
    isLocked: PropTypes.bool.isRequired,
};

export function PericiasSection({ isLocked }) {

    function groupPericias(pericias, groupSize) {
        const grouped = [];
        for (let i = 0; i < pericias.length; i += groupSize) {
            grouped.push(pericias.slice(i, i + groupSize));
        }
        return grouped;
    }

    return (
        <>
            {groupPericias(perArray, 4).map((group, index) => (
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
        action(`pericia-${props.pericia}`, value === '' ? 0 : parseInt(value, 10));
    }, [value, props.pericia]);

    return (
        <div className={"input-group mb-3"}>
            <span className={"input-group-text-left"}
                  style={{backgroundColor: atrColors[props.atr].background,
                      color: atrColors[props.atr].color}}>{props.atr}</span>
            <span className={"input-group-text-center"}
                  style={props.isLocked ? {borderColor: `${atrColors[props.atr].background}`} : {}}>
                {props.pericia}</span>
            <input type={"number"}
                   step={1}
                   min={0}
                   className="form-control input-wmargin"
                   placeholder="0"
                   value={value}
                   onChange={handleChange(setValue)}
                   onKeyDownCapture={handleKeyPress}
                   id={`label-${props.pericia}`}
                   disabled={props.isLocked}
                   style={props.isLocked ? {borderColor: `${atrColors[props.atr].background}`} : {}}
            />
        </div>
    )
}

Pericia.propTypes = {
    pericia: PropTypes.string.isRequired,
    atr: PropTypes.string.isRequired,
    isLocked: PropTypes.bool.isRequired,
};

export function Atributos(props) {

    const [value, setValue] = useState(getItem(`atributo-${props.atr}`, ''));

    useEffect(() => {
        const action = value === '' ? deleteItem : saveItem;
        action(`atributo-${props.atr}`, parseInt(value, 10) || 0);
    }, [value, props.atr]);

    return (
        <div className={"input-group mb-3"}>

            <div className={"text-div"}>
                <span className={`input-group-text-left defined ${props.isLocked ? "locked" : ""}`}
                      style={{
                          backgroundColor: atrColors[props.atr].background,
                          color: atrColors[props.atr].color, border: `${atrColors[props.atr].background} 2px solid`
                      }}>{props.atributo}</span>
            </div>
            <input type={"number"}
                   step={1}
                   min={0}
                   className="form-control input-wmargin"
                   placeholder="0"
                   value={value}
                   onChange={handleChange(setValue)}
                   onKeyDownCapture={handleKeyPress}
                   style={props.isLocked ? {borderColor: atrColors[props.atr].background} : {}}
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

export function ArtsSection({ isLocked }) {

    function groupArts(arts, groupSize) {
        const grouped = [];
        for (let i = 0; i < arts.length; i += groupSize) {
            grouped.push(arts.slice(i, i + groupSize));
        }
        return grouped
    }

    return (
        <>
            {groupArts(arcArray, 4).map((group, index) => (
                <div className={"status-meio justify-center"} key={index}>
                    {group.map(({ art }) => (
                        <ArcaneArts isLocked={isLocked} art={art} key={art} />
                    ))}
                </div>
            ))}
        </>
    );
}

ArtsSection.propTypes = {
    isLocked: PropTypes.bool.isRequired,
};

export function ArcaneArts(props) {
    const [value, setValue] = useState(getItem(`art-${props.art}`, ''));

    useEffect(() => {
        const action = value === '' ? deleteItem : saveItem;
        action(`art-${props.art}`, parseInt(value, 10) || 0);
    }, [value, props.art]);

    return (
        <div className={"input-group mb-3"}>

            <div className={"text-div"}>
                <span className={`input-group-text-left defined ${props.isLocked ? "locked" : ""}`}
                      style={{
                          backgroundColor: arcColors[props.art].background,
                          color: arcColors[props.art].color, border: `${arcColors[props.art].background} 2px solid`
                      }}>{props.art}</span>
            </div>
            <input type={"number"}
                   step={1}
                   min={0}
                   className="form-control input-wmargin"
                   placeholder="0"
                   value={value}
                   onChange={handleChange(setValue)}
                   onKeyDownCapture={handleKeyPress}
                   style={props.isLocked ? {borderColor: arcColors[props.art].background} : {}}
                   id={`label-${props.art}`}
                   disabled={props.isLocked}
            />
        </div>
    )
}

ArcaneArts.propTypes = {
    art: PropTypes.string.isRequired,
    isLocked: PropTypes.bool.isRequired,
};

export function SubArtsSection({ isLocked }) {

    function groupSubArts(arts, groupSize) {
        const grouped = [];
        for (let i = 0; i < arts.length; i += groupSize) {
            grouped.push(arts.slice(i, i + groupSize));
        }
        return grouped
    }

    return (
        <>
            {groupSubArts(subArcArray, 4).map((group, index) => (
                <div className={"status-meio justify-center"} key={index}>
                    {group.map(({ subArt, art }) => (
                        <SubArcaneArts isLocked={isLocked} subArt={subArt} key={subArt} art={art} />
                    ))}
                </div>
            ))}
        </>
    );
}

SubArtsSection.propTypes = {
    isLocked: PropTypes.bool.isRequired,
};

export function SubArcaneArts(props) {
    const [value, setValue] = useState(getItem(`subArt-${props.subArt}`, ''));

    useEffect(() => {
        const action = value === '' ? deleteItem : saveItem;
        action(`subArt-${props.subArt}`, value === '' ? 0 : parseInt(value, 10));
    }, [value, props.subArt]);

    return (
        <div className={"input-group mb-3"}>
            <span className={"input-group-text-left"}
                  style={{backgroundColor: arcColors[props.art].background,
                      color: arcColors[props.art].color}}>{props.art}</span>
            <span className={"input-group-text-center"}
                  style={props.isLocked ? {borderColor: `${arcColors[props.art].background}`} : {}}>
                {props.subArt}</span>
            <input type={"number"}
                   step={1}
                   min={0}
                   className="form-control input-wmargin"
                   placeholder="0"
                   value={value}
                   onChange={handleChange(setValue)}
                   onKeyDownCapture={handleKeyPress}
                   id={`label-${props.subArt}`}
                   disabled={props.isLocked}
                   style={props.isLocked ? {borderColor: `${arcColors[props.art].background}`} : {}}
            />
        </div>
    )
}

SubArcaneArts.propTypes = {
    subArt: PropTypes.string.isRequired,
    art: PropTypes.string.isRequired,
    isLocked: PropTypes.bool.isRequired,
};

/**
 * Handles key press events on input fields to restrict input to numeric values and control commands.
 *
 * This function is designed to be attached to the `onKeyDownCapture` event of input elements. It allows
 * numeric inputs, backspace, delete, arrow keys, and tab for navigation. Additionally, it permits the use
 * of 'Control + A' and 'Control + C' for select all and copy operations, respectively. Any other key press
 * is prevented from affecting the input field, ensuring that only numeric values can be entered.
 *
 * @param {Object} event - The event object provided by the onKeyDownCapture event.
 */
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