import { useCallback, useEffect, useState, useMemo } from "react";
import { deleteItem, getItem, returnLocalStorageData, saveItem } from "../assets/systems/SaveLoad.jsx";
import { lockedInputStyle } from "../assets/styles/CommonStyles.jsx";
import {
    ArtsSection,
    Attributes,
    Biotipos,
    PericiasSection,
    SubArtsSection
} from "../assets/systems/FichaPage3/FichaPage3System.jsx";
import { arcArray, atrMap, bioMap, perArray, subArcArray } from "../assets/systems/FichaPage3/FichaPage3Arrays.jsx";
import { saveUserData } from "../firebaseUtils.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

        saveUserData(returnLocalStorageData());

    }, [getTotalPoints]);

    const SaveLockedState = useCallback((lockState) => {
        if (lockState) {
            console.log("Bloqueando entradas...");
            saveItem('isLocked', true);
        } else {
            console.log("Desbloqueando entradas...");
            deleteItem('isLocked');
        }
    }, []);

    const handleLockChange = useCallback(() => {
        const lock = !isLocked;
        setIsLocked(lock);
        SaveLockedState(lock);
    }, [isLocked, SaveLockedState]);

    const UpdateTempRoll = useCallback(() => {
        const tempRollClone = { ...tempRoll };

        ["Pericia", "Dice", "Result"].forEach((temp) => {
            let value = sessionStorage.getItem(`temp${temp}`) || '';
            if (temp === "Dice" && value) {
                value = value.split(',').map(Number);
            }
            tempRollClone[temp] = value;
        });

        setTempRoll(tempRollClone);
    }, [tempRoll]);

    const CalculateAttributesPoints = useCallback(() => {
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
    }, []);

    const CalculateAttributesCap = useCallback(() => {
        const level = getItem('nivel', 1);

        if (level < 4) {
            return 3;
        } else if (level < 10) {
            return 4;
        } else {
            return 5;
        }
    }, []);

    const CalculatePericiasPoints = useCallback(() => {
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
    }, []);

    const CalculatePericiasCap = useCallback(() => {
        return getItem('nivel', 1);
    }, []);

    const rollDice = (e, simpleDice) => {

        let diceResult = 0;
        const dice = [];
        let noAttribute = false;

        const emojis = ["😭", "😐", "😀", "😁"];

        const notify = (message, emoji) => toast(message, {
            theme:"dark",
            position: "bottom-right",
            icon: () => `${emoji}`,
        });

        function rollSimpleDice(qty, sides) {
            for (let i = 0; i < qty; i++) {
                dice.push(Math.floor(Math.random() * sides) + 1);
            }
        }

        function simpleDiceSum() {
            return dice.reduce((acc, curr) => acc + curr, 0);
        }

        function chooseSimpleDiceResult() {
            if (simpleDice.sum) {
                diceResult = simpleDiceSum();
            } else {
                chooseMinOrMax(false);
            }
        }

        function setTempRollSessionStorage(periciaNameProp, diceProp, resultProp) {
            sessionStorage.setItem('tempPericia', periciaNameProp);
            sessionStorage.setItem('tempDice', diceProp);
            sessionStorage.setItem('tempResult', resultProp);
            notify(`${periciaNameProp}: [${diceProp}] = ${resultProp}`,
                emojis[resultProp < 10 ? 0 : resultProp < 15 ? 1 : resultProp < 20 ? 2 : 3]);
        }

        function verifyAttribute(atr, bonus) {
            if ((atr + bonus) === 0) return [true, 2, bonus];
            return [false, atr, bonus];
        }

        function rollAttributeDice(atr, bonus) {
            for (let i = 0; i < (atr + bonus); i++) {
                dice.push(Math.floor(Math.random() * 20) + 1);
            }
        }

        function chooseMinOrMax(noAtr) {
            if (!noAtr) {
                diceResult = Math.max(...dice);
            } else {
                diceResult = Math.min(...dice);
            }
        }

        function addPericiaBonus(bonus) {
            diceResult += bonus;
        }

        if (atrMap.includes((e.target.id).slice(7))) {
            const attributeName = (e.target.id).slice(7);
            let attribute = getItem(`atributo-${attributeName}`, 0);
            let attributeBonus = getItem(`atributo-${attributeName}-bonus`, 0);

            [noAttribute, attribute, attributeBonus] = verifyAttribute(attribute, attributeBonus);

            rollAttributeDice(attribute, attributeBonus);
            chooseMinOrMax(noAttribute);
            setTempRollSessionStorage(attributeName, dice, diceResult);

        } else if (perArray.map(per => per.pericia).includes((e.target.id).slice(7))) {
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
            chooseMinOrMax(noAttribute);
            addPericiaBonus(periciaBonus);

            const result = diceResult + pericia;

            setTempRollSessionStorage(periciaName, dice, result);
        } else {
            rollSimpleDice(simpleDice.qty, simpleDice.sides);
            chooseSimpleDiceResult();
            setTempRollSessionStorage("N/A", dice, diceResult);
        }

        UpdateTempRoll();
    }

    const handleStatusChange = useCallback((setter) => (event) => {
        const value = event.target.value;
        if (event.target.type === 'number') {
            setter(value === '' ? '' : parseFloat(value));
        } else {
            setter(value);
        }
    }, []);

    const handleSearchChange = useCallback((event) => {
        setSearchTerm(event.target.value.toLowerCase());
    }, []);

    const filteredBioMap = useMemo(() => bioMap.filter((item) =>
        item.toLowerCase().includes(searchTerm)
    ), [searchTerm]);

    const filteredAtrMap = useMemo(() => atrMap.filter((item) =>
        item.toLowerCase().includes(searchTerm)
    ), [searchTerm]);

    const filteredPerArray = useMemo(() => perArray.filter((item) =>
        item.pericia.toLowerCase().includes(searchTerm)
    ), [searchTerm]);

    const filteredArcArray = useMemo(() => arcArray.filter((item) =>
        item.art.toLowerCase().includes(searchTerm)
    ), [searchTerm]);

    const filteredSubArcArray = useMemo(() => subArcArray.filter((item) =>
        item.subArt.toLowerCase().includes(searchTerm)
    ), [searchTerm]);

    useEffect(() => {
        updatePoints();
    }, [updatePoints]);

    useEffect(() => {
        document.documentElement.style.setProperty('--text-length', `${(tempRoll.Dice.length < 31 ? tempRoll.Dice.length : 30)}`);
    }, [tempRoll.Dice.length]);

    return (
        <main className={"mainCommon page-3"}>

            <ToastContainer limit={5} closeOnClick />
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
                    <article className={"options-buttons display-flex-center"}>
                        <button type="button"
                                className="button-lock"
                                onClick={handleLockChange}
                                style={isLocked ? lockedInputStyle() : {}}>
                            {isLocked ? "Entradas bloqueadas " : "Entradas desbloqueadas "}
                            <i className={isLocked ? "bi bi-lock-fill" : "bi bi-unlock-fill"}/>
                        </button>
                        <button type={"button"}
                                className={"button-lock"}
                                onClick={() => setRecommendations(!recommendations)}
                                style={recommendations ? lockedInputStyle() : {}}
                        >
                            {"Regras "}
                            <i className={recommendations ? "bi bi-exclamation-triangle-fill" : "bi bi-exclamation-triangle"}/>
                        </button>
                    </article>
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
                                <p>Máximo de pontos em cada categoria:</p>
                                <p>biotipo: máximo: [3]</p>
                                <p>atributos: máximo: [{CalculateAttributesCap()}]</p>
                                <p>perícias: máximo: [{CalculatePericiasCap()}]</p>
                                <p className={"last-p"}>artes e subartes: máximo [{15}]</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={`section-biotipo section-status ${filteredBioMap.length < 1 ? "display-none" : ""}`}>
                <div className={"display-flex-center column"}>
                    <h2 className={"mainCommon title-2"}>Biotipo: [{bioPoints}]/[9]</h2>
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
                    <h2 className={"mainCommon title-2"}>Atributos: [{atrPoints}]/[{CalculateAttributesPoints()}]</h2>
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
                    <h2 className={"mainCommon title-2"}>
                        Perícias: [{perPoints}]/[{CalculatePericiasPoints() > 0 ? CalculatePericiasPoints() :
                        CalculatePericiasPoints() === 0 ? "Preencha o Biotipo e Atributos" :
                            "Valores maiores do que o esperado."}]
                    </h2>
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
                    <h2 className={"mainCommon title-2"}>
                        Artes: [{arcPoints}]/[{getItem('pericia-Magia Arcana', 0) * 5}]
                    </h2>
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
                        Subartes: [{subArcPoints}]/[{getItem('pericia-Magia Arcana', 0) * 5}]
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