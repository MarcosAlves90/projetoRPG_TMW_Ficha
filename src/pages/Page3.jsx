import {useCallback, useEffect, useState} from "react";
import {deleteItem, getItem, saveItem} from "../assets/systems/SaveLoad.jsx";
import {lockedInputStyle} from "../assets/styles/CommonStyles.jsx";
import 'bootstrap-icons/font/bootstrap-icons.css';
import {Atributos, Biotipos, PericiasSection} from "../assets/systems/FichaPage3/FichaPage3System.jsx";
import {atrMap, bioMap, perArray} from "../assets/systems/FichaPage3/FichaPage3Arrays.jsx";

export default function Page3() {
    const [isLocked, setIsLocked] = useState(getItem('isLocked', false) === 'true');
    const [bioPoints, setBioPoints] = useState(getItem('biotipo-Points', 0));
    const [atrPoints, setAtrPoints] = useState(getItem('atributo-Points', 0));
    const [perPoints, setPerPoints] = useState(getItem('pericia-Points', 0));

    const getTotalPoints = useCallback((map, prefix) => {
        if (prefix === 'pericia') {
            return map.reduce((total, {pericia}) => total + getItem(`${prefix}-${pericia}`, 0), 0);
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
    }, [getTotalPoints]);

    useEffect(() => {
        updatePoints();
    });

    // Save the isLocked state to localStorage
    useEffect(() => {
        if (isLocked) {
            saveItem('isLocked', true);
        } else {
            deleteItem('isLocked');
        }
    }, [isLocked]);

    return (
        <div className={"fichaComum"}>
            <div className={"title-2-container"}>
                <button type="button"
                        className="button-lock"
                        onClick={() => setIsLocked(!isLocked)}
                        style={isLocked ? lockedInputStyle() : {}}>
                    {isLocked ? "Desbloquear entradas " : "Bloquear entradas "}
                    <i className={isLocked ? "bi bi-unlock-fill" : "bi bi-lock-fill"}></i>
                </button>
                <button type="button"
                        className="button-lock"
                        onClick={updatePoints}>
                    {"Atualizar pontos "}
                    <i className={"bi bi-arrow-clockwise"}></i>
                </button>
            </div>
            <section className={"section-biotipo"}>
                <div className={"title-2-container"}>
                    <h2 className={"fichaComum title-2"}>biotipo: [{bioPoints}] pontos utilizados.</h2>
                </div>
                <div className={"status-meio justify-center min"}>
                    {bioMap.map(biotipo => (
                        <Biotipos key={biotipo} isLocked={isLocked} biotipo={biotipo} />
                    ))}
                </div>
            </section>
            <section className={"section-atributos"}>
                <div className={"title-2-container"}>
                    <h2 className={"fichaComum title-2"}>atributos: [{atrPoints}] pontos utilizados.</h2>
                </div>
                <div className={"status-meio justify-center min"}>
                    {atrMap.map(atr => (
                        <Atributos key={atr} isLocked={isLocked} atributo={atr} atr={atr} />
                    ))}
                </div>
            </section>
            <section className={"section-perArray"}>
                <div className={"title-2-container"}>
                    <h2 className={"fichaComum title-2"}>perícias: [{perPoints}] pontos utilizados.</h2>
                </div>
                <PericiasSection isLocked={isLocked} />
            </section>
        </div>
    );
}