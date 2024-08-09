import {useCallback, useEffect, useState} from "react";
import {deleteItem, getItem, saveItem} from "../assets/systems/SaveLoad.jsx";
import {lockedInputStyle} from "../assets/styles/CommonStyles.jsx";
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
    const [tempRoll, setTempRoll] = useState({Pericia: '', Dice: [], Result: ''});

    const getTotalPoints = useCallback((map, prefix) => {
        const prefixList = ['pericia', 'art', 'subArt'];

        if (prefixList.includes(prefix)) {
            return map.reduce((total, obj) => total + getItem(`${prefix}-${obj[prefix]}`, 0), 0);
        } else {
            return map.reduce((total, key) => total + getItem(`${prefix}-${key}`, 0), 0);
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
        const temps = [
            "Pericia",
            "Dice",
            "Result",
        ]

        const tempRollClone = { ...tempRoll };

        temps.forEach((temp) => {
            tempRollClone[temp] = sessionStorage.getItem(`temp${temp}`) || '';
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

        if (bPericias === 1) {
            return ((3+(aInt)) * level) + (level * 2);
        } else if (bPericias === 2) {
            return ((5+(aInt)) * level) + (level * 2);
        } else if (bPericias === 3) {
            return ((7+(aInt)) * level) + (level * 2);
        }

    }

    function CalculatePericiasCap() {
        return getItem('nivel', 1);
    }

    const rollDice = (e) => {

        function setTempRoll(periciaNameProp, diceProp, resultProp) {
            sessionStorage.setItem('tempPericia', periciaNameProp);
            sessionStorage.setItem('tempDice', diceProp);
            sessionStorage.setItem('tempResult', resultProp);
        }

        if (atrMap.includes((e.target.id).slice(7))) {
            const attributeName = (e.target.id).slice(7);
            const attribute = getItem(`atributo-${attributeName}`, 0);
            const dice = [];

            for (let i = 0; i < attribute; i++) {
                dice.push(Math.floor(Math.random() * 20) + 1);
            }

            const diceBestResult = Math.max(...dice);

            setTempRoll(attributeName, dice, diceBestResult);
            UpdateTempRoll();
        } else {
            const periciaName = (e.target.id).slice(7);
            const pericia = getItem(`pericia-${periciaName}`, 0);
            const attribute = map(perArray, function (per) {
                if (per.pericia === periciaName) {
                    return getItem(`atributo-${per.atr}`, 0);
                }
            })
            const dice = [];

            for (let i = 0; i < attribute; i++) {
                dice.push(Math.floor(Math.random() * 20) + 1);
            }

            const diceBestResult = Math.max(...dice);
            const result = diceBestResult + pericia;

            setTempRoll(periciaName, dice, result);
            UpdateTempRoll();
        }
    }

    const handleStatusChange = (setter) => (event) => {
        const value = event.target.value;
        if (event.target.type === 'number') {
            setter(value === '' ? '' : parseFloat(value));
        } else {
            setter(value);
        }
    };

    useEffect(() => {

        updatePoints();
        UpdateTempRoll();

    },[]);

    return (
        <main className={"mainCommon page-3"}>

            <section className={"section-dice"}>
                <div className={"display-flex-center"}>
                    <div>
                        <h2>Rolagem:</h2>
                    </div>
                    <article className={"display-flex-center dice"}>
                        <div className={"dice-background dice-font left"}>{tempRoll.Pericia ? tempRoll.Pericia : "Nenhum"}</div>
                        <div className={"dice-background dice-font center"}>{tempRoll.Dice ? `[${tempRoll.Dice}]` : 0}</div>
                        <div className={"dice-background dice-font right"}>{tempRoll.Result ? tempRoll.Result : 0}</div>
                    </article>
                </div>
            </section>
            <section className={"section-options"}>
                <div className={"display-flex-center"}>
                    <button type="button"
                            className="button-lock"
                            onClick={handleLockChange}
                            style={isLocked ? lockedInputStyle() : {}}>
                        {isLocked ? "Entradas bloqueadas " : "Entradas desbloqueadas "}
                        <i className={isLocked ? "bi bi-lock-fill" : "bi bi-unlock-fill"} />
                    </button>
                    <button type={"button"}
                            className={"button-lock"}
                            onClick={() => setRecommendations(!recommendations)}
                            style={recommendations ? lockedInputStyle() : {}}
                    >
                        {"Pontos recomendados "}
                        <i className={recommendations ? "bi bi-exclamation-triangle-fill" : "bi bi-exclamation-triangle"} />
                    </button>

                </div>
                <div className={"display-flex-center"}>
                    <div className={"alert-box-collapsible"} style={recommendations ? null : {display: "none"}}>
                        <div className={"alert-box"}>
                            <div className={"alert-box-message"}>
                                <p>biotipo: [9] | máximo: [3]</p>
                                <p>atributos: [{CalculateAttributesPoints()}] | máximo: [{CalculateAttributesCap()}]</p>
                                <p>perícias: [{CalculatePericiasPoints()}] | máximo: [{CalculatePericiasCap()}]</p>
                                <p className={"last-p"}>(sub)artes arcanas: [{getItem('pericia-Magia Arcana', 0) * 5}] | máximo [{15}]</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={"section-biotipo"}>
                <div className={"display-flex-center column"}>
                    <h2 className={"mainCommon title-2"}>biotipo: [{bioPoints}] pontos utilizados.</h2>
                    <p className={"statusDescription"}>O biotipo representa a essência do personagem,
                        seu estado natural sem treinos, modificações ou conhecimentos.</p>
                </div>
                <div className={"input-center justify-center min"}>
                    {bioMap.map(biotipo => (
                        <Biotipos key={biotipo}
                                  isLocked={isLocked}
                                  biotipo={biotipo}
                                  handleStatusChange={handleStatusChange}
                                  updatePoints={updatePoints}/>
                    ))}
                </div>
            </section>

            <section className={"section-atributos"}>
                <div className={"display-flex-center column"}>
                    <h2 className={"mainCommon title-2"}>atributos: [{atrPoints}] pontos utilizados.</h2>
                    <p className={"statusDescription"}>Os atributos são os status principais do personagem.
                        Eles guiam as perícias e as (sub)artes arcanas.</p>
                </div>
                <div className={"input-center justify-center min"}>
                    {atrMap.map(atr => (
                        <Attributes key={atr}
                                    isLocked={isLocked}
                                    atributo={atr}
                                    atr={atr}
                                    handleStatusChange={handleStatusChange}
                                    updatePoints={updatePoints}
                                    rollDice={rollDice}/>
                    ))}
                </div>
            </section>

            <section className={"section-perArray"}>
                <div className={"display-flex-center column"}>
                    <h2 className={"mainCommon title-2"}>perícias: [{perPoints}] pontos utilizados.</h2>
                    <p className={"statusDescription"}>As perícias são os conhecimentos e habilidades naturais do
                        personagem, elas determinam aquilo que ele sabe ou não fazer.</p>
                </div>
                <PericiasSection isLocked={isLocked}
                                 rollDice={rollDice}
                                 handleStatusChange={handleStatusChange}
                                 updatePoints={updatePoints}/>
            </section>

            <section className={"section-arts"}>
                <div className={"display-flex-center column"}>
                    <h2 className={"mainCommon title-2"}>artes arcanas: [{arcPoints}] pontos utilizados.</h2>
                    <p className={"statusDescription"}>As artes arcanas são os focos de conhecimento em magia
                        arcana do personagem, definindo em quais ações ele é melhor.</p>
                </div>
                <ArtsSection isLocked={isLocked}
                             handleStatusChange={handleStatusChange}
                             updatePoints={updatePoints}/>
            </section>

            <section className={"section-subArts"}>
                <div className={"display-flex-center column"}>
                    <h2 className={"mainCommon title-2"}>
                        subartes arcanas: [{subArcPoints}] pontos utilizados.
                    </h2>
                    <p className={"statusDescription"}>As subartes arcanas são as especializações das artes
                    arcanas do personagem, aumentando as possibilidades de skills.</p>
                </div>
                <SubArtsSection isLocked={isLocked} handleStatusChange={handleStatusChange} updatePoints={updatePoints}/>
            </section>
        </main>
    );
}