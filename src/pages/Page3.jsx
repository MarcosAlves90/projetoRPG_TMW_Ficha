import {useCallback, useEffect, useState} from "react";
import {deleteItem, getItem, saveItem} from "../assets/systems/SaveLoad.jsx";
import {lockedInputStyle, yellowLockedInputStyle} from "../assets/styles/CommonStyles.jsx";
import {
    ArtsSection,
    Attributes,
    Biotipos,
    PericiasSection,
    SubArtsSection
} from "../assets/systems/FichaPage3/FichaPage3System.jsx";
import {arcArray, atrMap, bioMap, perArray, subArcArray} from "../assets/systems/FichaPage3/FichaPage3Arrays.jsx";
import {map} from "jquery";

export default function Page3() {
    const [isLocked, setIsLocked] = useState(getItem('isLocked', false) === 'true');
    const [bioPoints, setBioPoints] = useState(getItem('biotipo-Points', 0));
    const [atrPoints, setAtrPoints] = useState(getItem('atributo-Points', 0));
    const [perPoints, setPerPoints] = useState(getItem('pericia-Points', 0));
    const [arcPoints, setArcPoints] = useState(getItem('art-Points', 0));
    const [subArcPoints, setSubArcPoints] = useState(getItem('subArt-Points', 0));
    const [recommendations, setRecommendations] = useState(false);
    const [tempRoll, setTempRoll] = useState({
        Pericia: sessionStorage.getItem('tempPericia') || '',
        Dice: sessionStorage.getItem('tempDice') ? sessionStorage.getItem('tempDice').split(',').map(Number) : [],
        Result: sessionStorage.getItem('tempResult') || ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    const getTotalPoints = useCallback((totalPoints, prefix) => {
        const prefixList = ['pericia', 'art', 'subArt'];

        if (prefixList.includes(prefix)) {
            return totalPoints.reduce((total, obj) => total + getItem(`${prefix}-${obj[prefix]}`, 0), 0);
        } else {
            return totalPoints.reduce((total, key) => total + getItem(`${prefix}-${key}`, 0), 0);
        }

    }, []);

    const updatePoints = useCallback(() => {
        console.log("Atualizando pontos...");

        const bPoints = getTotalPoints(bioMap, 'biotipo');
        setBioPoints(bPoints);
        saveItem('biotipo-Points', bPoints);

        const aPoints = getTotalPoints(atrMap, 'atributo');
        setAtrPoints(aPoints);
        saveItem('atributo-Points', aPoints);

        const pPoints = getTotalPoints(perArray, 'pericia');
        setPerPoints(pPoints);
        saveItem('pericia-Points', pPoints);

        const arPoints = getTotalPoints(arcArray, 'art');
        setArcPoints(arPoints);
        saveItem('art-Points', arPoints);

        const saPoints = getTotalPoints(subArcArray, 'subArt');
        setSubArcPoints(saPoints);
        saveItem('subArt-Points', saPoints);

    }, [getTotalPoints]);

    function SaveLockedState(lockState) {
        if (lockState) {
            console.log("Bloqueando entradas...");
            saveItem('isLocked', true);
        } else {
            deleteItem('isLocked');
        }
    }

    const handleLockChange = () => {
        const lock = !isLocked;
        setIsLocked(lock);
        SaveLockedState(lock);
    }

    function UpdateTempRoll() {
        const tempRollClone = { ...tempRoll };

        ["Pericia", "Dice", "Result"].forEach((temp) => {
            let value = sessionStorage.getItem(`temp${temp}`) || '';
            if (temp === "Dice" && value) {
                value = value.split(',').map(Number);
            }
            tempRollClone[temp] = value;
        });

        setTempRoll(tempRollClone);
    }

    function CalculateAttributesPoints() {
        if (getItem('nivel', 1) < 4) {
            return 9;
        } else if (getItem('nivel', 1) < 10) {
            return 10;
        } else if (getItem('nivel', 1) < 16) {
            return 11;
        } else if (getItem('nivel', 1) < 19) {
            return 12;
        } else {
            return 13
        }
    }

    function CalculateAttributesCap() {

        const level = getItem('nivel', 1);

        if (level < 4) {
            return 3;
        } else if (level < 10) {
            return 4;
        } else {
            return 5;
        }

    }

    function CalculatePericiasPoints() {

        const level = getItem('nivel', 1);
        const bPericias = getItem('biotipo-Pericias', 0);
        const aInt = getItem('atributo-INT', 0);

        if (bPericias === 0 || aInt === 0) {
            return 0;
        } else if (bPericias === 1) {
            return ((3+(aInt)) * level) + (level * 2);
        } else if (bPericias === 2) {
            return ((5+(aInt)) * level) + (level * 2);
        } else if (bPericias === 3) {
            return ((7+(aInt)) * level) + (level * 2);
        } else {
            return -1;
        }

    }

    /**
     * Calculates the cap for the skills based on the character's level.
     *
     * @returns {number} - The cap for the skills.
     */
    function CalculatePericiasCap() {
        return getItem('nivel', 1);
    }

    /**
     * Rolls dice based on the event target id and updates the temporary roll values.
     *
     * @param {Object} e - The event object.
     */
    const rollDice = (e) => {

        let diceBestResult = 0;
        const dice = [];
        let noAttribute;

        /**
         * Sets the temporary roll values in the session storage.
         *
         * @param {string} periciaNameProp - The name of the skill.
         * @param {Array} diceProp - The array of dice rolled.
         * @param {number} resultProp - The result of the roll.
         */
        function setTempRollDice(periciaNameProp, diceProp, resultProp) {
            sessionStorage.setItem('tempPericia', periciaNameProp);
            sessionStorage.setItem('tempDice', diceProp);
            sessionStorage.setItem('tempResult', resultProp);
        }

        /**
         * Verifies the attribute and bonus values.
         *
         * @param {number} atr - The attribute value.
         * @param {number} bonus - The bonus value.
         * @returns {Array} An array where the first element is a boolean indicating if the sum of atr and bonus is zero,
         *                  the second element is the attribute value, and the third element is the bonus value.
         */
        function verifyAttribute(atr, bonus) {
            if ((atr + bonus) === 0) {
                return [true, 2, bonus];
            }
            return [false, atr, bonus];
        }

        /**
         * Rolls dice based on the attribute and bonus values.
         *
         * @param {number} atr - The attribute value used to determine the number of dice rolls.
         * @param {number} bonus - The bonus value added to the attribute to determine the total number of dice rolls.
         */
        function rollAttributeDice(atr, bonus) {
            for (let i = 0; i < (atr + bonus); i++) {
                dice.push(Math.floor(Math.random() * 20) + 1);
            }
        }

        /**
         * Chooses the best or worst dice result based on the presence of an attribute.
         *
         * @param {boolean} noAtr - Indicates whether there is no attribute.
         *                          If true, the minimum dice result is chosen.
         *                          If false, the maximum dice result is chosen.
         */
        function choseMinOrMax(noAtr) {
            if (!noAtr) {
                diceBestResult = Math.max(...dice);
            } else {
                diceBestResult = Math.min(...dice);
            }
        }

        /**
         * Adds a bonus to the dice best result.
         *
         * @param {number} bonus - The bonus value to be added to the dice best result.
         */
        function addPericiaBonus(bonus) {
            diceBestResult += bonus;
        }

        if (atrMap.includes((e.target.id).slice(7))) {
            const attributeName = (e.target.id).slice(7);
            let attribute = getItem(`atributo-${attributeName}`, 0);
            let attributeBonus = getItem(`atributo-${attributeName}-bonus`, 0);

            [noAttribute, attribute, attributeBonus] = verifyAttribute(attribute, attributeBonus);
            rollAttributeDice(attribute, attributeBonus);
            choseMinOrMax(noAttribute);

            setTempRollDice(attributeName, dice, diceBestResult);
            UpdateTempRoll();
        } else {
            const periciaName = (e.target.id).slice(7);
            const pericia = getItem(`pericia-${periciaName}`, 0);
            const periciaBonus = getItem(`pericia-${periciaName}-bonus`, 0);
            let attribute = map(perArray, function (per) {
                if (per.pericia === periciaName) {
                    return getItem(`atributo-${per.atr}`, 0);
                }
                return null;
            });
            let attributeBonus = map(perArray, function (per) {
                if (per.pericia === periciaName) {
                    return getItem(`atributo-${per.atr}-bonus`, 0);
                }
                return null;
            });

            attribute = attribute.length > 0 ? attribute[0] : 0;
            attributeBonus = attributeBonus.length > 0 ? attributeBonus[0] : 0;

            [noAttribute, attribute, attributeBonus] = verifyAttribute(attribute, attributeBonus);
            rollAttributeDice(attribute, attributeBonus);
            choseMinOrMax(noAttribute);
            addPericiaBonus(periciaBonus);

            const result = diceBestResult + pericia;

            setTempRollDice(periciaName, dice, result);
            UpdateTempRoll();
        }
    }

    /**
     * Handles changes to the status input fields.
     *
     * @param {Function} setter - The state setter function for the status.
     * @returns {Function} - A function that handles the change event for the input field.
     */
    const handleStatusChange = (setter) => (event) => {
        const value = event.target.value;
        if (event.target.type === 'number') {
            setter(value === '' ? '' : parseFloat(value));
        } else {
            setter(value);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredBioMap = bioMap.filter((item) =>
        item.toLowerCase().includes(searchTerm)
    );
    const filteredAtrMap = atrMap.filter((item) =>
        item.toLowerCase().includes(searchTerm)
    );
    const filteredPerArray = perArray.filter((item) =>
        item.pericia.toLowerCase().includes(searchTerm)
    );
    const filteredArcArray = arcArray.filter((item) =>
        item.art.toLowerCase().includes(searchTerm)
    );
    const filteredSubArcArray = subArcArray.filter((item) =>
        item.subArt.toLowerCase().includes(searchTerm)
    );

    useEffect(() => {

        updatePoints();

    },[]);

    useEffect(() => {
        document.documentElement.style.setProperty('--text-length', `${(tempRoll.Dice.length < 31 ? tempRoll.Dice.length : 30)}`);
    }, [tempRoll.Dice.length]);

    return (
        <main className={"mainCommon page-3"}>

            <section className={"section-dice"}>
                <div className={"display-flex-center"}>
                    <h2 className={"title-2"}>Rolagem:</h2>
                    <article className={"display-flex-center dice"}>
                        <div className={"dice-background dice-font left"}>{tempRoll.Pericia ? tempRoll.Pericia : "Nenhum"}</div>
                        <div className={"dice-background dice-font center display-flex-center"}><p>{tempRoll.Dice.length < 31 ? `[${tempRoll.Dice}]` : tempRoll.Dice.length >= 31 ? `[${tempRoll.Dice.slice(0,30)}...]` : "0"}</p></div>
                        <div className={"dice-background dice-font right"}>{tempRoll.Result ? tempRoll.Result : 0}</div>
                    </article>
                </div>
            </section>
            <section className={"section-options"}>
                <div className={"display-flex-center buttons"}>
                    <button type="button"
                            className="button-lock"
                            onClick={handleLockChange}
                            style={isLocked ? lockedInputStyle() : {}}>
                        {isLocked ? "Entradas bloqueadas " : "Entradas desbloqueadas "}
                        <i className={isLocked ? "bi bi-lock-fill" : "bi bi-unlock-fill"}/>
                    </button>
                    <button type={"button"}
                            className={"button-lock recommendations"}
                            onClick={() => setRecommendations(!recommendations)}
                            style={recommendations ? yellowLockedInputStyle() : {}}
                    >
                        {"Pontos recomendados "}
                        <i className={recommendations ? "bi bi-exclamation-triangle-fill" : "bi bi-exclamation-triangle"}/>
                    </button>
                    <input
                        className={"search status"}
                        type="text"
                        placeholder="pesquisar status..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className={"display-flex-center"}>
                    <div className={"alert-box-collapsible"} style={recommendations ? null : {display: "none"}}>
                        <div className={"alert-box"}>
                            <div className={"alert-box-message"}>
                                <p>Pontos recomendados:</p>
                                <p>biotipo: [9] | máximo: [3]</p>
                                <p>atributos: [{CalculateAttributesPoints()}] | máximo: [{CalculateAttributesCap()}]</p>
                                <p>perícias: [{CalculatePericiasPoints() > 0 ? CalculatePericiasPoints() : CalculatePericiasPoints() === 0 ? "Preencha o Biotipo e Atributos" : "Valores maiores do que o esperado."}] | máximo: [{CalculatePericiasCap()}]</p>
                                <p className={"last-p"}>(sub)artes arcanas: [{getItem('pericia-Magia Arcana', 0) * 5}] | máximo [{15}]</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={`section-biotipo section-status ${filteredBioMap.length < 1 ? "display-none" : ""}`}>
                <div className={"display-flex-center column"}>
                    <h2 className={"mainCommon title-2"}>biotipo: [{bioPoints}] pontos utilizados.</h2>
                    <p className={"statusDescription"}>O biotipo representa a essência do personagem,
                        seu estado natural sem treinos, modificações ou conhecimentos.</p>
                </div>
                <div className={"input-center justify-center min"}>
                    {filteredBioMap.map((biotipo) => (
                        <Biotipos
                            key={biotipo}
                            isLocked={isLocked}
                            biotipo={biotipo}
                            handleStatusChange={handleStatusChange}
                            updatePoints={updatePoints}
                        />
                    ))}
                </div>
            </section>

            <section className={`section-atributos section-status ${filteredAtrMap.length < 1 ? "display-none" : ""}`}>
                <div className={"display-flex-center column"}>
                    <h2 className={"mainCommon title-2"}>atributos: [{atrPoints}] pontos utilizados.</h2>
                    <p className={"statusDescription"}>Os atributos são os status principais do personagem.
                        Eles guiam as perícias e as (sub)artes arcanas.</p>
                </div>
                <div className={"input-center justify-center min"}>
                    {filteredAtrMap.map((atr) => (
                        <Attributes
                            key={atr}
                            isLocked={isLocked}
                            atributo={atr}
                            atr={atr}
                            handleStatusChange={handleStatusChange}
                            updatePoints={updatePoints}
                            rollDice={rollDice}
                        />
                    ))}
                </div>
            </section>

            <section className={`section-perArray section-status ${filteredPerArray.length < 1 ? "display-none" : ""}`}>
                <div className={"display-flex-center column"}>
                    <h2 className={"mainCommon title-2"}>perícias: [{perPoints}] pontos utilizados.</h2>
                    <p className={"statusDescription"}>As perícias são os conhecimentos e habilidades naturais do
                        personagem, elas determinam aquilo que ele sabe ou não fazer.</p>
                </div>
                <PericiasSection isLocked={isLocked}
                                 rollDice={rollDice}
                                 handleStatusChange={handleStatusChange}
                                 updatePoints={updatePoints}
                                 perArray={filteredPerArray}
                />
            </section>

            <section className={`section-arts section-status ${filteredArcArray.length < 1 ? "display-none" : ""}`}>
                <div className={"display-flex-center column"}>
                    <h2 className={"mainCommon title-2"}>artes arcanas: [{arcPoints}] pontos utilizados.</h2>
                    <p className={"statusDescription"}>As artes arcanas são os focos de conhecimento em magia
                        arcana do personagem, definindo em quais ações ele é melhor.</p>
                </div>
                <ArtsSection isLocked={isLocked}
                             handleStatusChange={handleStatusChange}
                             updatePoints={updatePoints}
                             arcArray={filteredArcArray}
                />
            </section>

            <section className={`section-subArts section-status ${filteredSubArcArray.length < 1 ? "display-none" : ""}`}>
                <div className={"display-flex-center column"}>
                    <h2 className={"mainCommon title-2"}>
                        subartes arcanas: [{subArcPoints}] pontos utilizados.
                    </h2>
                    <p className={"statusDescription"}>As subartes arcanas são as especializações das artes
                    arcanas do personagem, aumentando as possibilidades de skills.</p>
                </div>
                <SubArtsSection isLocked={isLocked}
                                handleStatusChange={handleStatusChange}
                                updatePoints={updatePoints}
                                subArcArray={filteredSubArcArray}
                />
            </section>
        </main>
    );
}