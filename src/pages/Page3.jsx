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
    const [tempPericia, setTempPericia] = useState('');
    const [tempDice, setTempDice] = useState('');
    const [tempResult, setTempResult] = useState('');

    const getTotalPoints = useCallback((map, prefix) => {
        if (prefix === 'pericia') {
            return map.reduce((total, {pericia}) => total + getItem(`${prefix}-${pericia}`, 0), 0);
        } else if (prefix === 'art') {
            return map.reduce((total, {art}) => total + getItem(`${prefix}-${art}`, 0), 0);
        } else if (prefix === 'subArt') {
            return map.reduce((total, {subArt}) => total + getItem(`${prefix}-${subArt}`, 0), 0);
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

    useEffect(() => {
        updatePoints();
    });

    useEffect(() => {
        setTempPericia(sessionStorage.getItem('tempPericia') || '');
        setTempDice(sessionStorage.getItem('tempDice') || '');
        setTempResult(sessionStorage.getItem('tempResult') || '');
    }, []);

    // Save the isLocked state to localStorage
    useEffect(() => {
        if (isLocked) {
            saveItem('isLocked', true);
        } else {
            deleteItem('isLocked');
        }
    }, [isLocked]);

    function atributesPoints() {
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

    function atributesCap() {

        const level = getItem('nivel', 1);

        if (level < 4) {
            return 3;
        } else if (level < 10) {
            return 4;
        } else {
            return 5;
        }

    }

    function periciasPoints() {

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

    function periciasCap() {
        return getItem('nivel', 1);
    }

    function RollDice(e) {
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

        sessionStorage.setItem('tempPericia', periciaName);
        sessionStorage.setItem('tempDice', dice);
        sessionStorage.setItem('tempResult', result);

        setTempPericia(sessionStorage.getItem('tempPericia') || '');
        setTempDice(sessionStorage.getItem('tempDice') || '');
        setTempResult(sessionStorage.getItem('tempResult') || '');

    }

    return (
        <main className={"mainCommon page-3"}>
            <section className={"section-dice"}>
                <div className={"display-flex-center"}>
                    <div>
                        <h2>Rolagem:</h2>
                    </div>
                    <article className={"display-flex-center dice"}>
                        <div className={"dice-background dice-font left"}>{tempPericia}</div>
                        <div className={"dice-background dice-font center"}>[{tempDice}]</div>
                        <div className={"dice-background dice-font right"}>{tempResult}</div>
                    </article>
                </div>
            </section>
            <section className={"section-options"}>
                <div className={"display-flex-center"}>
                    <button type="button"
                            className="button-lock"
                            onClick={() => setIsLocked(!isLocked)}
                            style={isLocked ? lockedInputStyle() : {}}>
                        {isLocked ? "Entradas bloqueadas " : "Entradas desbloqueadas "}
                        <i className={isLocked ? "bi bi-lock-fill" : "bi bi-unlock-fill"}></i>
                    </button>
                    <button type="button"
                            className="button-lock"
                            onClick={updatePoints}>
                        {"Atualizar pontos "}
                        <i className={"bi bi-arrow-clockwise"}></i>
                    </button>
                    <button type={"button"}
                            className={"button-lock"}
                            onClick={() => setRecommendations(!recommendations)}
                            style={recommendations ? lockedInputStyle() : {}}
                    >
                        {"Pontos recomendados "}
                        <i className={recommendations ? "bi bi-exclamation-triangle-fill" : "bi bi-exclamation-triangle"}></i>
                    </button>

                </div>
                <div className={"display-flex-center"}>
                    <div className={"alert-box-collapsible"} style={recommendations ? null : {display: "none"}}>
                        <div className={"alert-box"}>
                            <div className={"alert-box-message"}>
                                <p>biotipo: [9] | máximo: [3]</p>
                                <p>atributos: [{atributesPoints()}] | máximo: [{atributesCap()}]</p>
                                <p>perícias: [{periciasPoints()}] | máximo: [{periciasCap()}]</p>
                                <p className={"last-p"}>(sub)artes arcanas: [{getItem('pericia-Magia Arcana', 0) * 5}] | máximo [{15}]</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={"section-biotipo"}>
                <div className={"display-flex-center"}>
                    <h2 className={"mainCommon title-2"}>biotipo: [{bioPoints}] pontos utilizados.</h2>
                </div>
                <div className={"input-center justify-center min"}>
                    {bioMap.map(biotipo => (
                        <Biotipos key={biotipo} isLocked={isLocked} biotipo={biotipo}/>
                    ))}
                </div>
            </section>

            <section className={"section-atributos"}>
                <div className={"display-flex-center"}>
                    <h2 className={"mainCommon title-2"}>atributos: [{atrPoints}] pontos utilizados.</h2>
                </div>
                <div className={"input-center justify-center min"}>
                    {atrMap.map(atr => (
                        <Attributes key={atr} isLocked={isLocked} atributo={atr} atr={atr} />
                    ))}
                </div>
            </section>

            <section className={"section-perArray"}>
                <div className={"display-flex-center"}>
                    <h2 className={"mainCommon title-2"}>perícias: [{perPoints}] pontos utilizados.</h2>
                </div>
                <PericiasSection isLocked={isLocked}  rollDice={RollDice}/>
            </section>

            <section className={"section-arts"}>
                <div className={"display-flex-center"}>
                    <h2 className={"mainCommon title-2"}>artes arcanas: [{arcPoints}] pontos utilizados.</h2>
                </div>
                <ArtsSection isLocked={isLocked}/>
            </section>

            <section className={"section-subArts"}>
                <div className={"display-flex-center"}>
                    <h2 className={"mainCommon title-2"}>
                    subartes arcanas: [{subArcPoints}] pontos utilizados.
                    </h2>
                </div>
                <SubArtsSection isLocked={isLocked}/>
            </section>
        </main>
    );
}