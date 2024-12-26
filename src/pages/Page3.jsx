import {useCallback, useEffect, useState, useMemo, useContext, useRef} from "react";
import {
    ArtsSection,
    Attributes,
    Biotipos,
    PericiasSection,
    SubArtsSection
} from "../assets/systems/FichaPage3/FichaPage3System.jsx";
import {arcArray, atrMap, bioMap, perArray, subArcArray} from "../assets/systems/FichaPage3/FichaPage3Arrays.jsx";
import {saveUserData} from "../firebaseUtils.js";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {map} from "jquery";
import {UserContext} from "../UserContext.jsx";
import styled from "styled-components";
import {Box, Button, InputAdornment, TextField} from "@mui/material";
import {Search, ReportGmailerrorred, Report, Lock, LockOpen} from "@mui/icons-material";

const StyledTextField = styled(TextField)`
    margin-top: 0;
    background-color: var(--background);
    height: fit-content;

    .MuiInputLabel-root, .MuiInputBase-input {
        font-family: var(--common-font-family), sans-serif !important;
    }

    & .MuiOutlinedInput-root {
        & fieldset {
            border: var(--gray-border);
            transition: var(--common-transition);
        }

        &:hover fieldset {
            border: var(--focus-gray-border);
        }

        &.Mui-focused fieldset {
            border: var(--focus-gray-border);
        }
    }

    @media (max-width: 991px) {
        & .MuiInputBase-input, .MuiInputLabel-root {
            font-size: 3vw;
        }
    }
`;

const StyledInputsBox = styled(Box)`
    display: flex;
    gap: 1rem;
    margin: 1rem 0;

    .buttonsBox {
        display: flex;
        gap: 1rem;
    }

    @media (max-width: 991px) {
        flex-direction: column;
        gap: 2vw;
        margin: 2vw 0;
        .buttonsBox {
            gap: 2vw;

            button {
                width: 100%;
            }
        }
    }
`;

const StyledButton = styled(Button)`
    width: 13rem;
    padding: 0.4rem;
    border-radius: 3px;
    font-weight: bold;
    font-size: 1rem;
    color: var(--background);
    font-family: var(--common-font-family), sans-serif !important;

    &.locked {
        background-color: var(--common-font-color);

        &:hover {
            background-color: var(--gray-placeholder);
        }
    }

    @media (max-width: 991px) {
        font-size: 3vw;
    }
`;

export default function Page3() {
    const [totalPoints, setTotalPoints] = useState({
        bioPoints: 0,
        atrPoints: 0,
        perPoints: 0,
        arcPoints: 0,
        subArcPoints: 0
    });

    const [recommendations, setRecommendations] = useState(false);
    const [tempRoll, setTempRoll] = useState({
        Pericia: '',
        Dice: [],
        Result: 0
    });

    const [searchTerm, setSearchTerm] = useState('');
    const {userData, setUserData, user} = useContext(UserContext);
    const debounceTimeout = useRef(null);

    const saveDataDebounced = useCallback((data) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            if (user) {
                saveUserData(data);
            }
        }, 500);
    }, [user]);

    const calculateTotalPoints = () => {
        const newTotalPoints = {
            bioPoints: 0,
            atrPoints: 0,
            perPoints: 0,
            arcPoints: 0,
            subArcPoints: 0
        };

        Object.keys(userData).forEach(key => {
            const value = parseFloat(userData[key]);
            const validValue = isNaN(value) ? 0 : value;

            if (!key.includes('Points') && !key.endsWith('-bonus')) {
                if (key.startsWith('biotipo-')) {
                    newTotalPoints.bioPoints += validValue;
                } else if (key.startsWith('atributo-')) {
                    newTotalPoints.atrPoints += validValue;
                } else if (key.startsWith('pericia-')) {
                    newTotalPoints.perPoints += validValue;
                } else if (key.startsWith('art-')) {
                    newTotalPoints.arcPoints += validValue;
                } else if (key.startsWith('subArt-')) {
                    newTotalPoints.subArcPoints += validValue;
                }
            }
        });

        setTotalPoints(newTotalPoints);
    };

    useEffect(() => {
        saveDataDebounced(userData);
        calculateTotalPoints();
    }, [userData, saveDataDebounced]);

    const handleInputChange = (key) => (event) => {
        const {value, type} = event.target;
        setUserData((prevUserData) => ({
            ...prevUserData,
            [key]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value,
        }));
    };

    const handleElementChange = (key) => (value) => {
        setUserData((prevUserData) => ({
            ...prevUserData,
            [key]: value,
        }));
    };

    const handleLockChange = () => {
        const lock = !userData.isLocked;
        handleElementChange('isLocked')(lock);
    }

    const CalculateAttributesPoints = useCallback(() => {
        const nivel = userData.nivel || 1;
        if (nivel < 4) {
            return 9;
        } else if (nivel < 10) {
            return 10;
        } else if (nivel < 16) {
            return 11;
        } else if (nivel < 19) {
            return 12;
        } else {
            return 13
        }
    }, [userData.nivel]);

    const CalculateAttributesCap = useCallback(() => {
        const nivel = userData.nivel || 1;

        if (nivel < 4) {
            return 3;
        } else if (nivel < 10) {
            return 4;
        } else {
            return 5;
        }
    }, [userData.nivel]);

    const CalculatePericiasPoints = useCallback(() => {
        const nivel = userData.nivel || 1;
        const bPericias = userData['biotipo-Pericias'] || 0;
        const aInt = userData['atributo-INT'] || 0;

        if (bPericias === 0 || aInt === 0) {
            return 0;
        } else if (bPericias === 1) {
            return ((3 + (aInt)) * nivel) + (nivel * 2);
        } else if (bPericias === 2) {
            return ((5 + (aInt)) * nivel) + (nivel * 2);
        } else if (bPericias === 3) {
            return ((7 + (aInt)) * nivel) + (nivel * 2);
        } else {
            return -1;
        }
    }, [userData]);

    const CalculatePericiasCap = useCallback(() => {
        return userData.nivel || 1;
    }, [userData.nivel]);

    const rollDice = (e, simpleDice) => {

        let diceResult = 0;
        const dice = [];
        let noAttribute = false;

        const emojis = {
            1: "💀",
            2: "🤡",
            3: "😔",
            4: "😟",
            5: "🙁",
            6: "😐",
            7: "🙂",
            8: "😀",
            9: "😃",
            10: "😄",
            11: "😁",
            12: "😎",
            13: "🥶"
        };

        const emojiMap = {
            1: 1, 2: 2, 3: 2, 4: 2, 5: 2, 6: 3, 7: 4, 8: 5, 9: 5,
            10: 6, 11: 6, 12: 6, 13: 6, 14: 7, 15: 8, 16: 9, 17: 10,
            18: 11, 19: 12, 20: 13
        };

        const selectEmoji = (result) => emojiMap[result] || null;

        const notify = (message, emoji) => toast(message, {
            theme: "dark",
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

        function notifyRoll(periciaNameProp, diceProp, resultProp) {
            notify(`${periciaNameProp}: [${diceProp}] = ${resultProp}`,
                emojis[selectEmoji(noAttribute ? Math.min(...diceProp) : Math.max(...diceProp))]);
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
            let attribute = userData[`atributo-${attributeName}`] || 0;
            let attributeBonus = userData[`atributo-${attributeName}-bonus`] || 0;

            [noAttribute, attribute, attributeBonus] = verifyAttribute(attribute, attributeBonus);

            rollAttributeDice(attribute, attributeBonus);
            chooseMinOrMax(noAttribute);
            notifyRoll(attributeName, dice, diceResult);
            setTempRoll({Pericia: attributeName, Dice: dice, Result: diceResult});

        } else if (perArray.map(per => per.pericia).includes((e.target.id).slice(7))) {
            const periciaName = (e.target.id).slice(7);
            const pericia = userData[`pericia-${periciaName}`] || 0;
            const periciaBonus = userData[`pericia-${periciaName}-bonus`] || 0;
            let attribute = map(perArray, function (per) {
                if (per.pericia === periciaName) {
                    return userData[`atributo-${per.atr}`] || 0;
                }
                return null;
            });
            let attributeBonus = map(perArray, function (per) {
                if (per.pericia === periciaName) {
                    return userData[`atributo-${per.atr}-bonus`] || 0;
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

            notifyRoll(periciaName, dice, result);
            setTempRoll({Pericia: periciaName, Dice: dice, Result: result});
        } else {
            rollSimpleDice(simpleDice.qty, simpleDice.sides);
            chooseSimpleDiceResult();
            notifyRoll("N/A", dice, diceResult);
            setTempRoll({Pericia: "N/A", Dice: dice, Result: diceResult});
        }
    }

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
        document.documentElement.style.setProperty('--text-length', `${(tempRoll.Dice.length < 31 ? tempRoll.Dice.length : 30)}`);
    }, [tempRoll.Dice.length]);

    return (
        <main className={"mainCommon page-3"}>

            <ToastContainer limit={5} closeOnClick/>
            <section className={"section-dice"}>
                <div className={"display-flex-center"}>
                    <h2 className={"title-2"}>Rolagem:</h2>
                    <article className={"display-flex-center dice"}>
                        <div
                            className={"dice-background dice-font left"}>{tempRoll.Pericia ? tempRoll.Pericia : "Nenhum"}</div>
                        <div className={"dice-background dice-font center display-flex-center"}>
                            <p>{tempRoll.Dice.length < 31 ? `[${tempRoll.Dice}]` : tempRoll.Dice.length >= 31 ? `[${tempRoll.Dice.slice(0, 30)}...]` : "0"}</p>
                        </div>
                        <div className={"dice-background dice-font right"}>{tempRoll.Result ? tempRoll.Result : 0}</div>
                    </article>
                </div>
            </section>
            <section className={"section-options"}>
                <StyledInputsBox>
                    <Box className={"buttonsBox"}>
                        <StyledButton type="button"
                                      variant="contained" color="primary"
                                      className={`${userData.isLocked ? "locked" : ""}`}
                                      onClick={handleLockChange}
                                      endIcon={userData.isLocked ? <Lock/> : <LockOpen/>}
                        >
                            {userData.isLocked ? "Bloqueado" : "Desbloqueado"}
                        </StyledButton>
                        <StyledButton type={"button"}
                                      variant="contained" color="primary"
                                      className={`${recommendations ? "locked" : ""}`}
                                      onClick={() => setRecommendations(!recommendations)}
                                      endIcon={recommendations ? <Report/> : <ReportGmailerrorred/>}
                        >
                            {"Regras"}
                        </StyledButton>
                    </Box>
                    <StyledTextField
                        type="text"
                        variant="outlined"
                        placeholder="Pesquisar status..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        fullWidth
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search/>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </StyledInputsBox>
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
                    <h2 className={"mainCommon title-2"}>Biotipo: [{totalPoints.bioPoints}]/[9]</h2>
                    <p className={"statusDescription"}>O biotipo representa a essência do personagem,
                        seu estado natural sem treinos, modificações ou conhecimentos.</p>
                </div>
                <div className={"input-center justify-center min"}>
                    {filteredBioMap.map((biotipo) => (
                        <Biotipos
                            key={biotipo}
                            biotipo={biotipo}
                            handleInputChange={handleInputChange}
                        />
                    ))}
                </div>
            </section>

            <section className={`section-atributos section-status ${filteredAtrMap.length < 1 ? "display-none" : ""}`}>
                <div className={"display-flex-center column"}>
                    <h2 className={"mainCommon title-2"}>Atributos:
                        [{totalPoints.atrPoints}]/[{CalculateAttributesPoints()}]</h2>
                    <p className={"statusDescription"}>Os atributos são os status principais do personagem.
                        Eles guiam as perícias e as (sub)artes arcanas.</p>
                </div>
                <div className={"input-center justify-center min"}>
                    {filteredAtrMap.map((atr) => (
                        <Attributes
                            key={atr}
                            atributo={atr}
                            atr={atr}
                            handleInputChange={handleInputChange}
                            rollDice={rollDice}
                        />
                    ))}
                </div>
            </section>
            <section className={`section-perArray section-status ${filteredPerArray.length < 1 ? "display-none" : ""}`}>
                <div className={"display-flex-center column"}>
                    <h2 className={"mainCommon title-2"}>
                        Perícias:
                        [{totalPoints.perPoints}]/[{!userData.nivel || userData.nivel === "" || isNaN(userData.nivel) ? "Verifique seu nível" :
                        CalculatePericiasPoints() > 0 ? CalculatePericiasPoints() :
                            CalculatePericiasPoints() === 0 ? "Preencha o Biotipo e Atributos" : "Biotipo maior do que o esperado"}]
                    </h2>
                    <p className={"statusDescription"}>As perícias são os conhecimentos e habilidades naturais do
                        personagem, elas determinam aquilo que ele sabe ou não fazer.</p>
                </div>
                <PericiasSection
                    rollDice={rollDice}
                    handleInputChange={handleInputChange}
                    perArray={filteredPerArray}
                />
            </section>

            <section className={`section-arts section-status ${filteredArcArray.length < 1 ? "display-none" : ""}`}>
                <div className={"display-flex-center column"}>
                    <h2 className={"mainCommon title-2"}>
                        Artes: [{totalPoints.arcPoints}]/[{(userData['pericia-Magia Arcana'] || 0) * 5}]
                    </h2>
                    <p className={"statusDescription"}>As artes arcanas são os focos de conhecimento em magia
                        arcana do personagem, definindo em quais ações ele é melhor.</p>
                </div>
                <ArtsSection
                    handleInputChange={handleInputChange}
                    arcArray={filteredArcArray}
                />
            </section>

            <section
                className={`section-subArts section-status ${filteredSubArcArray.length < 1 ? "display-none" : ""}`}>
                <div className={"display-flex-center column"}>
                    <h2 className={"mainCommon title-2"}>
                        Subartes: [{totalPoints.subArcPoints}]/[{(userData['pericia-Magia Arcana'] || 0) * 5}]
                    </h2>
                    <p className={"statusDescription"}>As subartes arcanas são as especializações das artes
                        arcanas do personagem, aumentando as possibilidades de skills.</p>
                </div>
                <SubArtsSection
                    handleInputChange={handleInputChange}
                    subArcArray={filteredSubArcArray}
                />
            </section>
        </main>
    );
}