import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {deleteItem, getItem, saveItem} from "../SaveLoad.jsx";
import {arcColors, atrColors, bioColors} from "../../styles/CommonStyles.jsx";

const perArrayPropType = PropTypes.arrayOf(
    PropTypes.shape({
        pericia: PropTypes.string.isRequired,
        atr: PropTypes.string.isRequired,
    })
);

const arcArrayPropType = PropTypes.arrayOf(
    PropTypes.shape({
        art: PropTypes.string.isRequired,
    })
);

const subArcArrayPropType = PropTypes.arrayOf(
    PropTypes.shape({
        subArt: PropTypes.string.isRequired,
        art: PropTypes.string.isRequired,
    })
);

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
    if (event.ctrlKey && (event.key === 'a' || event.key === 'c')) {
        return;
    }

    if (!/[0-9]/.test(event.key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        event.preventDefault();
    }
}

export function Biotipos(props) {

    const [value, setValue] = useState(getItem(`biotipo-${props.biotipo}`, ''));

    useEffect(() => {
        const action = value === '' ? deleteItem : saveItem;
        action(`biotipo-${props.biotipo}`, parseInt(value, 10) || 0);
        props.updatePoints();
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
                   className="form-control input-status"
                   placeholder="0"
                   value={value}
                   onChange={props.handleStatusChange(setValue)}
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
    handleStatusChange: PropTypes.func.isRequired,
    updatePoints: PropTypes.func.isRequired,
};

export function PericiasSection({ isLocked, rollDice, handleStatusChange, updatePoints, perArray }) {
    const groupPericias = (pericias, groupSize) => {
        return pericias.reduce((acc, curr, index) => {
            if (index % groupSize === 0) acc.push([]);
            acc[acc.length - 1].push(curr);
            return acc;
        }, []);
    };

    return (
        <>
            {groupPericias(perArray, 4).map((group, index) => (
                <div className="input-center justify-center" key={index}>
                    {group.map(({ pericia, atr }) => (
                        <Pericia
                            isLocked={isLocked}
                            pericia={pericia}
                            atr={atr}
                            key={pericia}
                            rollDice={rollDice}
                            handleStatusChange={handleStatusChange}
                            updatePoints={updatePoints}
                        />
                    ))}
                </div>
            ))}
        </>
    );
}

PericiasSection.propTypes = {
    isLocked: PropTypes.bool.isRequired,
    rollDice: PropTypes.func.isRequired,
    handleStatusChange: PropTypes.func.isRequired,
    updatePoints: PropTypes.func.isRequired,
    perArray: perArrayPropType.isRequired,
}

function Pericia(props) {

    const [value, setValue] = useState(getItem(`pericia-${props.pericia}`, ''));
    const [bonus, setBonus] = useState(getItem(`pericia-${props.pericia}-bonus`, ''));

    useEffect(() => {
        const action = value === '' ? deleteItem : saveItem;
        action(`pericia-${props.pericia}`, value === '' ? 0 : parseInt(value, 10));

        const bonusAction = bonus === '' ? deleteItem : saveItem;
        bonusAction(`pericia-${props.pericia}-bonus`, bonus === '' ? 0 : parseInt(bonus, 10));

        props.updatePoints();
    }, [value, bonus, props.pericia]);

    return (
        <div className={"input-group mb-3"}>
            <span className={"input-group-text-left"}
                  style={{
                      backgroundColor: atrColors[props.atr].background,
                      color: atrColors[props.atr].color
                  }}>{props.atr}</span>
            <span className={"input-group-text-center pericia"}
                  id={`button-${props.pericia}`}
                  onClick={props.rollDice}
                  style={props.isLocked ? {borderColor: `${atrColors[props.atr].background}`} : {}}>
                {props.pericia}</span>
            <input type={"number"}
                   step={1}
                   min={0}
                   className="form-control input-status border-right-none"
                   placeholder="0"
                   value={value}
                   onChange={props.handleStatusChange(setValue)}
                   onKeyDownCapture={handleKeyPress}
                   id={`label-${props.pericia}`}
                   disabled={props.isLocked}
                   style={props.isLocked ? {borderColor: `${atrColors[props.atr].background}`} : {}}
            />
            <input type={"number"}
                   step={1}
                   min={0}
                   className="form-control input-status input-bonus"
                   placeholder="0"
                   value={bonus}
                   onChange={props.handleStatusChange(setBonus)}
                   onKeyDownCapture={handleKeyPress}
                   id={`label-${props.pericia}-bonus`}
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
    handleStatusChange: PropTypes.func.isRequired,
    rollDice: PropTypes.func.isRequired,
    updatePoints: PropTypes.func.isRequired,
};

export function Attributes(props) {

    const [value, setValue] = useState(getItem(`atributo-${props.atr}`, ''));
    const [bonus, setBonus] = useState(getItem(`atributo-${props.atr}-bonus`, ''));

    useEffect(() => {
        const action = value === '' ? deleteItem : saveItem;
        action(`atributo-${props.atr}`, parseInt(value, 10) || 0);

        const bonusAction = bonus === '' ? deleteItem : saveItem;
        bonusAction(`atributo-${props.atr}-bonus`, parseInt(bonus, 10) || 0);

        props.updatePoints();
    }, [value, bonus, props.atr]);

    return (
        <div className={"input-group mb-3"}>

            <div className={"text-div"}>
                <span className={`input-group-text-left defined attribute ${props.isLocked ? "locked" : ""}`}
                      id={`button-${props.atributo}`}
                      onClick={props.rollDice}
                      style={{
                          backgroundColor: atrColors[props.atr].background,
                          color: atrColors[props.atr].color, border: `${atrColors[props.atr].background} 2px solid`
                      }}>{props.atributo}</span>
            </div>
            <input type={"number"}
                   step={1}
                   min={0}
                   className="form-control input-status border-right-none"
                   placeholder="0"
                   value={value}
                   onChange={props.handleStatusChange(setValue)}
                   onKeyDownCapture={handleKeyPress}
                   style={props.isLocked ? {borderColor: atrColors[props.atr].background} : {}}
                   id={`label-${props.atributo}`}
                   disabled={props.isLocked}
            />
            <input type={"number"}
                   step={1}
                   min={0}
                   className="form-control input-status input-bonus"
                   placeholder="0"
                   value={bonus}
                   onChange={props.handleStatusChange(setBonus)}
                   onKeyDownCapture={handleKeyPress}
                   style={props.isLocked ? {borderColor: atrColors[props.atr].background} : {}}
                   id={`label-${props.atributo}-bonus`}
                   disabled={props.isLocked}
            />
        </div>
    )

}

Attributes.propTypes = {
    atributo: PropTypes.string.isRequired,
    atr: PropTypes.string.isRequired,
    isLocked: PropTypes.bool.isRequired,
    handleStatusChange: PropTypes.func.isRequired,
    updatePoints: PropTypes.func.isRequired,
    rollDice: PropTypes.func.isRequired,
};

export function ArtsSection({ isLocked, handleStatusChange, updatePoints, arcArray }) {
    function groupArts(arts, groupSize) {
        const grouped = [];
        for (let i = 0; i < arts.length; i += groupSize) {
            grouped.push(arts.slice(i, i + groupSize));
        }
        return grouped;
    }

    return (
        <>
            {groupArts(arcArray, 4).map((group, index) => (
                <div className={"input-center justify-center"} key={index}>
                    {group.map(({ art }) => (
                        <ArcaneArts
                            isLocked={isLocked}
                            art={art}
                            key={art}
                            handleStatusChange={handleStatusChange}
                            updatePoints={updatePoints}
                        />
                    ))}
                </div>
            ))}
        </>
    );
}

ArtsSection.propTypes = {
    isLocked: PropTypes.bool.isRequired,
    handleStatusChange: PropTypes.func.isRequired,
    updatePoints: PropTypes.func.isRequired,
    arcArray: arcArrayPropType.isRequired,
};

export function ArcaneArts(props) {
    const [value, setValue] = useState(getItem(`art-${props.art}`, ''));

    useEffect(() => {
        const action = value === '' ? deleteItem : saveItem;
        action(`art-${props.art}`, parseInt(value, 10) || 0);
        props.updatePoints();
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
                   className="form-control input-status"
                   placeholder="0"
                   value={value}
                   onChange={props.handleStatusChange(setValue)}
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
    handleStatusChange: PropTypes.func.isRequired,
    updatePoints: PropTypes.func.isRequired,
};

export function SubArtsSection({ isLocked, handleStatusChange, updatePoints, subArcArray }) {
    function groupSubArts(arts, groupSize) {
        const grouped = [];
        for (let i = 0; i < arts.length; i += groupSize) {
            grouped.push(arts.slice(i, i + groupSize));
        }
        return grouped;
    }

    return (
        <>
            {groupSubArts(subArcArray, 4).map((group, index) => (
                <div className={"input-center justify-center"} key={index}>
                    {group.map(({ subArt, art }) => (
                        <SubArcaneArts
                            isLocked={isLocked}
                            subArt={subArt}
                            key={subArt}
                            art={art}
                            handleStatusChange={handleStatusChange}
                            updatePoints={updatePoints}
                        />
                    ))}
                </div>
            ))}
        </>
    );
}

SubArtsSection.propTypes = {
    isLocked: PropTypes.bool.isRequired,
    handleStatusChange: PropTypes.func.isRequired,
    updatePoints: PropTypes.func.isRequired,
    subArcArray: subArcArrayPropType.isRequired,
};

export function SubArcaneArts(props) {
    const [value, setValue] = useState(getItem(`subArt-${props.subArt}`, ''));

    useEffect(() => {
        const action = value === '' ? deleteItem : saveItem;
        action(`subArt-${props.subArt}`, value === '' ? 0 : parseInt(value, 10));
        props.updatePoints();
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
                   className="form-control input-status"
                   placeholder="0"
                   value={value}
                   onChange={props.handleStatusChange(setValue)}
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
    handleStatusChange: PropTypes.func.isRequired,
    updatePoints: PropTypes.func.isRequired,
};