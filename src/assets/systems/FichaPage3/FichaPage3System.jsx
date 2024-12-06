import PropTypes from "prop-types";
import { useEffect, useState, useMemo, useCallback } from "react";
import { deleteItem, getItem, saveItem } from "../SaveLoad.jsx";
import { arcColors, atrColors, bioColors } from "../../styles/CommonStyles.jsx";

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

function handleKeyPress(event) {
    if (event.ctrlKey && (event.key === 'a' || event.key === 'c')) return;
    if (!/[0-9]/.test(event.key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        event.preventDefault();
    }
}

export function Biotipos({ biotipo, isLocked, handleStatusChange, updatePoints }) {
    const [value, setValue] = useState(getItem(`biotipo-${biotipo}`, ''));

    useEffect(() => {
        const action = value === '' ? deleteItem : saveItem;
        action(`biotipo-${biotipo}`, parseInt(value, 10) || 0);
        updatePoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, biotipo]);

    return (
        <div className="input-group mb-3">
            <div className="text-div">
                <span className={`input-group-text-left defined ${isLocked ? "locked" : ""}`}
                    style={{
                        backgroundColor: bioColors[biotipo].background,
                        color: bioColors[biotipo].color, border: `${bioColors[biotipo].background} 2px solid`
                    }}>{biotipo}</span>
            </div>
            <input type="number"
                step={1}
                min={0}
                className="form-control input-status"
                placeholder="0"
                value={value}
                onChange={handleStatusChange(setValue)}
                onKeyDownCapture={handleKeyPress}
                style={isLocked ? { borderColor: bioColors[biotipo].background } : {}}
                id={`label-${biotipo}`}
                disabled={isLocked}
            />
        </div>
    );
}

Biotipos.propTypes = {
    biotipo: PropTypes.string.isRequired,
    isLocked: PropTypes.bool.isRequired,
    handleStatusChange: PropTypes.func.isRequired,
    updatePoints: PropTypes.func.isRequired,
};

export function PericiasSection({ isLocked, rollDice, handleStatusChange, updatePoints, perArray }) {
    return (
        <div className={"input-center justify-center min"}>
            {perArray.map(({pericia, atr}, index) => (
                <div className="input-center justify-center" key={index}>
                    <Pericia
                        isLocked={isLocked}
                        pericia={pericia}
                        atr={atr}
                        key={pericia}
                        rollDice={rollDice}
                        handleStatusChange={handleStatusChange}
                        updatePoints={updatePoints}
                    />
                </div>
            ))}
        </div>
    );
}

PericiasSection.propTypes = {
    isLocked: PropTypes.bool.isRequired,
    rollDice: PropTypes.func.isRequired,
    handleStatusChange: PropTypes.func.isRequired,
    updatePoints: PropTypes.func.isRequired,
    perArray: perArrayPropType.isRequired,
};

function Pericia({pericia, atr, isLocked, handleStatusChange, rollDice, updatePoints}) {
    const [value, setValue] = useState(getItem(`pericia-${pericia}`, ''));
    const [bonus, setBonus] = useState(getItem(`pericia-${pericia}-bonus`, ''));

    useEffect(() => {
        const action = value === '' ? deleteItem : saveItem;
        action(`pericia-${pericia}`, value === '' ? 0 : parseInt(value, 10));

        const bonusAction = bonus === '' ? deleteItem : saveItem;
        bonusAction(`pericia-${pericia}-bonus`, bonus === '' ? 0 : parseInt(bonus, 10));

        updatePoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, bonus, pericia]);

    return (
        <div className="input-group mb-3">
            <span className="input-group-text-left"
                style={{
                    backgroundColor: atrColors[atr].background,
                    color: atrColors[atr].color
                }}>{atr}</span>
            <span className="input-group-text-center pericia"
                id={`button-${pericia}`}
                onClick={rollDice}
                style={isLocked ? { borderColor: `${atrColors[atr].background}` } : {}}>
                {pericia}</span>
            <input type="number"
                step={1}
                min={0}
                className="form-control input-status border-right-none"
                placeholder="0"
                value={value}
                onChange={handleStatusChange(setValue)}
                onKeyDownCapture={handleKeyPress}
                id={`label-${pericia}`}
                disabled={isLocked}
                style={isLocked ? { borderColor: `${atrColors[atr].background}` } : {}}
            />
            <input type="number"
                step={1}
                min={0}
                className="form-control input-status input-bonus"
                placeholder="0"
                value={bonus}
                onChange={handleStatusChange(setBonus)}
                onKeyDownCapture={handleKeyPress}
                id={`label-${pericia}-bonus`}
                disabled={isLocked}
                style={isLocked ? { borderColor: `${atrColors[atr].background}` } : {}}
            />
        </div>
    );
}

Pericia.propTypes = {
    pericia: PropTypes.string.isRequired,
    atr: PropTypes.string.isRequired,
    isLocked: PropTypes.bool.isRequired,
    handleStatusChange: PropTypes.func.isRequired,
    rollDice: PropTypes.func.isRequired,
    updatePoints: PropTypes.func.isRequired,
};

const getTruAttrName = {
    'DES': 'Destreza',
    'FOR': 'Força',
    'INT': 'Inteligência',
    'PRE': 'Presença',
    'VIG': 'Vigor',
}

export function Attributes({ atributo, atr, isLocked, handleStatusChange, updatePoints, rollDice }) {
    const [value, setValue] = useState(getItem(`atributo-${atr}`, ''));
    const [bonus, setBonus] = useState(getItem(`atributo-${atr}-bonus`, ''));

    useEffect(() => {
        const action = value === '' ? deleteItem : saveItem;
        action(`atributo-${atr}`, parseInt(value, 10) || 0);

        const bonusAction = bonus === '' ? deleteItem : saveItem;
        bonusAction(`atributo-${atr}-bonus`, parseInt(bonus, 10) || 0);

        updatePoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, bonus, atr]);

    return (
        <div className="input-group mb-3">
            <div className="text-div">
                <span className={`input-group-text-left defined attribute ${isLocked ? "locked" : ""}`}
                    id={`button-${atributo}`}
                    onClick={rollDice}
                    style={{
                        backgroundColor: atrColors[atr].background,
                        color: atrColors[atr].color, border: `${atrColors[atr].background} 2px solid`
                    }}>{getTruAttrName[atributo]}</span>
            </div>
            <input type="number"
                step={1}
                min={0}
                className="form-control input-status border-right-none"
                placeholder="0"
                value={value}
                onChange={handleStatusChange(setValue)}
                onKeyDownCapture={handleKeyPress}
                style={isLocked ? { borderColor: atrColors[atr].background } : {}}
                id={`label-${atributo}`}
                disabled={isLocked}
            />
            <input type="number"
                step={1}
                min={0}
                className="form-control input-status input-bonus"
                placeholder="0"
                value={bonus}
                onChange={handleStatusChange(setBonus)}
                onKeyDownCapture={handleKeyPress}
                style={isLocked ? { borderColor: atrColors[atr].background } : {}}
                id={`label-${atributo}-bonus`}
                disabled={isLocked}
            />
        </div>
    );
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
    return (
        <div className={"input-center justify-center min"}>
            <div className="input-center justify-center">
                {arcArray.map(({art}) => (
                    <ArcaneArts
                        isLocked={isLocked}
                        art={art}
                        key={art}
                        handleStatusChange={handleStatusChange}
                        updatePoints={updatePoints}
                    />
                ))}
            </div>
        </div>
    );
}

ArtsSection.propTypes = {
    isLocked: PropTypes.bool.isRequired,
    handleStatusChange: PropTypes.func.isRequired,
    updatePoints: PropTypes.func.isRequired,
    arcArray: arcArrayPropType.isRequired,
};

const getTruArcName = {
    'DES': 'Destruição',
    'LEV': 'Levitação',
    'LIB': 'Liberação',
    'MAN': 'Manipulação',
    'IMA': 'Imaginação',
    'MOD': 'Modificação',
    'CRI': 'Criação',
}

export function ArcaneArts({art, isLocked, handleStatusChange, updatePoints}) {
    const [value, setValue] = useState(getItem(`art-${art}`, ''));

    useEffect(() => {
        const action = value === '' ? deleteItem : saveItem;
        action(`art-${art}`, parseInt(value, 10) || 0);
        updatePoints();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, art]);

    return (
        <div className="input-group mb-3">
            <div className="text-div">
                <span className={`input-group-text-left defined ${isLocked ? "locked" : ""}`}
                    style={{
                        backgroundColor: arcColors[art].background,
                        color: arcColors[art].color, border: `${arcColors[art].background} 2px solid`
                    }}>{getTruArcName[art]}</span>
            </div>
            <input type="number"
                step={1}
                min={0}
                className="form-control input-status"
                placeholder="0"
                value={value}
                onChange={handleStatusChange(setValue)}
                onKeyDownCapture={handleKeyPress}
                style={isLocked ? { borderColor: arcColors[art].background } : {}}
                id={`label-${art}`}
                disabled={isLocked}
            />
        </div>
    );
}

ArcaneArts.propTypes = {
    art: PropTypes.string.isRequired,
    isLocked: PropTypes.bool.isRequired,
    handleStatusChange: PropTypes.func.isRequired,
    updatePoints: PropTypes.func.isRequired,
};

export function SubArtsSection({ isLocked, handleStatusChange, updatePoints, subArcArray }) {
    return (
        <div className={"input-center justify-center min"}>
            {subArcArray.map(({ subArt, art }) => (
                <div className="input-center justify-center" key={subArt}>
                    <SubArcaneArts
                        isLocked={isLocked}
                        subArt={subArt}
                        art={art}
                        handleStatusChange={handleStatusChange}
                        updatePoints={updatePoints}
                    />
                </div>
            ))}
        </div>
    );
}

SubArtsSection.propTypes = {
    isLocked: PropTypes.bool.isRequired,
    handleStatusChange: PropTypes.func.isRequired,
    updatePoints: PropTypes.func.isRequired,
    subArcArray: subArcArrayPropType.isRequired,
};

export function SubArcaneArts({ subArt, art, isLocked, handleStatusChange, updatePoints }) {
    const [value, setValue] = useState(getItem(`subArt-${subArt}`, ''));

    useEffect(() => {
        const action = value === '' ? deleteItem : saveItem;
        action(`subArt-${subArt}`, value === '' ? 0 : parseInt(value, 10));
        updatePoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, subArt]);

    return (
        <div className="input-group mb-3">
            <span className="input-group-text-left"
                style={{ backgroundColor: arcColors[art].background, color: arcColors[art].color }}>{art}</span>
            <span className="input-group-text-center"
                style={isLocked ? { borderColor: `${arcColors[art].background}` } : {}}>
                {subArt}</span>
            <input type="number"
                step={1}
                min={0}
                className="form-control input-status"
                placeholder="0"
                value={value}
                onChange={handleStatusChange(setValue)}
                onKeyDownCapture={handleKeyPress}
                id={`label-${subArt}`}
                disabled={isLocked}
                style={isLocked ? { borderColor: `${arcColors[art].background}` } : {}}
            />
        </div>
    );
}

SubArcaneArts.propTypes = {
    subArt: PropTypes.string.isRequired,
    art: PropTypes.string.isRequired,
    isLocked: PropTypes.bool.isRequired,
    handleStatusChange: PropTypes.func.isRequired,
    updatePoints: PropTypes.func.isRequired,
};