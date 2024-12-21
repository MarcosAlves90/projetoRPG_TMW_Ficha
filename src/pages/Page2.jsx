import { useEffect, useContext, useRef, useCallback } from "react";
import Collapsible from "react-collapsible";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { saveUserData } from "../firebaseUtils.js";
import { UserContext } from "../UserContext";
import {TextField} from "@mui/material";
import styled from "styled-components";

const StyledTextField = styled(TextField)`
    margin-bottom: 2rem;
    margin-top: 0;
    width: 100%;
    background-color: var(--background);

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

export default function Page2() {

    const { userData, setUserData, user } = useContext(UserContext);
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

    useEffect(() => {
        saveDataDebounced(userData);
    }, [userData, saveDataDebounced]);

    const handleInputChange = (key) => (event) => {
        const { value, type } = event.target;
        setUserData((prevUserData) => ({
            ...prevUserData,
            [key]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value,
        }));
    };

    return (

        <main className={"mainCommon page-2"}>

            <section className={"section-origem"}>
                <Collapsible trigger={"Origem"}
                    triggerStyle={{ fontSize: "1.5em", color: "rgb(43, 43, 43)" }}
                    transitionTime={100}
                    transitionCloseTime={100}>
                    <article className={"textarea-container"}>
                        <StyledTextField
                            id="outlined-multiline-static"
                            placeholder="Escreva a sua origem"
                            value={userData.origem}
                            onChange={handleInputChange('origem')}
                            multiline
                            variant={"outlined"}
                            minRows={6}
                        />
                    </article>
                </Collapsible>
            </section>

            <section className={"section-fisico"}>
                <Collapsible trigger={"Aparência"}
                    triggerStyle={{ fontSize: "1.5em", color: "rgb(43, 43, 43)" }}
                    transitionTime={100}
                    transitionCloseTime={100}>
                    <div className={"textarea-container"}>
                        <StyledTextField
                            id="outlined-multiline-static"
                            placeholder="Descreva a sua aparência"
                            value={userData.fisico}
                            onChange={handleInputChange('fisico')}
                            multiline
                            variant={"outlined"}
                            minRows={4}
                        />
                    </div>
                </Collapsible>
            </section>

            <section className={"section-ideais"}>
                <Collapsible trigger={"Ideais"}
                    triggerStyle={{ fontSize: "1.5em", color: "rgb(43, 43, 43)" }}
                    transitionTime={100}
                    transitionCloseTime={100}>
                    <div className={"textarea-container"}>
                        <StyledTextField
                            id="outlined-multiline-static"
                            placeholder={"Escreva um ou mais ideais"}
                            value={userData.ideais}
                            onChange={handleInputChange('ideais')}
                            multiline
                            variant={"outlined"}
                            minRows={4}/>
                    </div>
                </Collapsible>
            </section>

            <section className={"section-tracos"}>
                <div className={"textarea-center-container"}>
                    <div className={"textarea-meio"}>
                        <Collapsible trigger={"Traços negativos"}
                            triggerStyle={{ fontSize: "1.5em", color: "rgb(43, 43, 43)" }}
                            transitionTime={100}
                            transitionCloseTime={100}>
                            <div className={"textarea-container"}>
                                <StyledTextField
                                    id="outlined-multiline-static"
                                    value={userData.tracosNegativos}
                                    onChange={handleInputChange('tracosNegativos')}
                                    multiline
                                    variant={"outlined"}
                                    minRows={4}
                                    placeholder={"- Escreva um ou mais traços negativos.\n" +
                                        "- Os traços podem ser físicos ou mentais."} />
                            </div>
                        </Collapsible>
                    </div>
                    <div className={"textarea-meio"}>
                        <Collapsible trigger={"Traços positivos"}
                            triggerStyle={{ fontSize: "1.5em", color: "rgb(43, 43, 43)" }}
                            transitionTime={100}
                            transitionCloseTime={100}>
                            <div className={"textarea-container"}>
                                <StyledTextField
                                    id="outlined-multiline-static"
                                    value={userData.tracosPositivos}
                                    onChange={handleInputChange('tracosPositivos')}
                                    multiline
                                    variant={"outlined"}
                                    minRows={4}
                                    placeholder={"- Escreva um ou mais traços positivos.\n" +
                                        "- Os traços podem ser físicos ou mentais."} />
                            </div>
                        </Collapsible>
                    </div>
                </div>
            </section>

            <section className={"section-origem-forma"}>
                <Collapsible trigger={"Origem da forma"}
                    triggerStyle={{ fontSize: "1.5em", color: "rgb(43, 43, 43)" }}
                    transitionTime={100}
                    transitionCloseTime={100}>
                    <div className={"textarea-container"}>
                        <StyledTextField
                            id="textarea-origemForma"
                            value={userData.origemForma}
                            onChange={handleInputChange('origemForma')}
                            multiline
                            variant={"outlined"}
                            minRows={7}
                            placeholder={"Escreva a origem da sua forma."} />
                    </div>
                </Collapsible>
            </section>

        </main>

    )
}