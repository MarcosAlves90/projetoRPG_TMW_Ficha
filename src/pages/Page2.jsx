import { useEffect, useContext, useRef, useCallback } from "react";
import TextareaAutosize from 'react-textarea-autosize';
import Collapsible from "react-collapsible";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { saveUserData } from "../firebaseUtils.js";
import { UserContext } from "../UserContext";

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
                        <TextareaAutosize className="form-control textarea-sheet"
                            id="exampleFormControlTextarea1"
                            value={userData.origem}
                            onChange={handleInputChange('origem')}
                            minRows="7"
                            placeholder={"Escreva a sua origem."} />
                    </article>
                </Collapsible>
            </section>

            <section className={"section-fisico"}>
                <Collapsible trigger={"Aparência"}
                    triggerStyle={{ fontSize: "1.5em", color: "rgb(43, 43, 43)" }}
                    transitionTime={100}
                    transitionCloseTime={100}>
                    <div className={"textarea-container"}>
                        <TextareaAutosize className="form-control textarea-sheet"
                            id="exampleFormControlTextarea1"
                            value={userData.fisico}
                            onChange={handleInputChange('fisico')}
                            minRows="4"
                            placeholder={"Descreva sua aparência."} />
                    </div>
                </Collapsible>
            </section>

            <section className={"section-ideais"}>
                <Collapsible trigger={"Ideais"}
                    triggerStyle={{ fontSize: "1.5em", color: "rgb(43, 43, 43)" }}
                    transitionTime={100}
                    transitionCloseTime={100}>
                    <div className={"textarea-container"}>
                        <TextareaAutosize className="form-control textarea-sheet"
                            id="exampleFormControlTextarea1"
                            value={userData.ideais}
                            onChange={handleInputChange('ideais')}
                            minRows="4"
                            placeholder={"- Escreva um ou mais ideais."} />
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
                                <TextareaAutosize className="form-control textarea-sheet"
                                    id="exampleFormControlTextarea1"
                                    value={userData.tracosNegativos}
                                    onChange={handleInputChange('tracosNegativos')}
                                    minRows="4"
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
                                <TextareaAutosize className="form-control textarea-sheet"
                                    id="exampleFormControlTextarea1"
                                    value={userData.tracosPositivos}
                                    onChange={handleInputChange('tracosPositivos')}
                                    minRows="4"
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
                        <TextareaAutosize className="form-control textarea-sheet"
                            id="exampleFormControlTextarea1"
                            value={userData.origemForma}
                            onChange={handleInputChange('origemForma')}
                            minRows="7"
                            placeholder={"Escreva a origem da sua forma."} />
                    </div>
                </Collapsible>
            </section>

        </main>

    )
}