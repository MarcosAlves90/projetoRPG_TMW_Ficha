import {useState, useEffect} from "react";
import {
    getItem,
    saveItem,
    handleChange,
    deleteItem, returnLocalStorageData,
} from "../assets/systems/SaveLoad.jsx";
import TextareaAutosize from 'react-textarea-autosize';
import Collapsible from "react-collapsible";
import 'bootstrap-icons/font/bootstrap-icons.css';
import {saveUserData} from "../firebaseUtils.js";

export default function Page2() {

    const [fisico, setFisico] = useState(getItem('fisico', ''));
    const [ideais, setIdeais] = useState(getItem('ideais', ''));
    const [tracosNegativos, setTracosNegativos] = useState(getItem('tracosNegativos', ''));
    const [tracosPositivos, setTracosPositivos] = useState(getItem('tracosPositivos', ''));
    const [origem, setOrigem] = useState(getItem('origem', ''));
    const [origemForma, setOrigemForma] = useState(getItem('origemForma', ''));

    useEffect(() => {
        const stateMap = {
            ideais,
            tracosNegativos,
            tracosPositivos,
            origem,
            origemForma,
            fisico,
        };

        Object.keys(stateMap).forEach((key) => {
            if (stateMap[key] !== '') {
                saveItem(key, stateMap[key]);
            } else {
                deleteItem(key);
            }
        });

        saveUserData(returnLocalStorageData());

    }, [ideais, tracosNegativos, tracosPositivos, origem, origemForma, fisico]);

    return (

        <main className={"mainCommon page-2"}>

            <section className={"section-origem"}>
                <Collapsible trigger={"Origem"}
                             triggerStyle={{fontSize: "1.5em", color: "rgb(43, 43, 43)"}}
                             transitionTime={100}
                             transitionCloseTime={100}>
                    <article className={"textarea-container"}>
                        <TextareaAutosize className="form-control textarea-sheet"
                                          id="exampleFormControlTextarea1"
                                          value={origem}
                                          onChange={handleChange(setOrigem)}
                                          minRows="7"
                                          placeholder={"Escreva a sua origem."} />
                    </article>
                </Collapsible>
            </section>

            <section className={"section-fisico"}>
                <Collapsible trigger={"Aparência"}
                             triggerStyle={{fontSize: "1.5em", color: "rgb(43, 43, 43)"}}
                             transitionTime={100}
                             transitionCloseTime={100}>
                    <div className={"textarea-container"}>
                        <TextareaAutosize className="form-control textarea-sheet"
                                          id="exampleFormControlTextarea1"
                                          value={fisico}
                                          onChange={handleChange(setFisico)}
                                          minRows="4"
                                          placeholder={"Descreva sua aparência."} />
                    </div>
                </Collapsible>
            </section>

            <section className={"section-ideais"}>
                <Collapsible trigger={"Ideais"}
                             triggerStyle={{fontSize: "1.5em", color: "rgb(43, 43, 43)"}}
                             transitionTime={100}
                             transitionCloseTime={100}>
                    <div className={"textarea-container"}>
                        <TextareaAutosize className="form-control textarea-sheet"
                                          id="exampleFormControlTextarea1"
                                          value={ideais}
                                          onChange={handleChange(setIdeais)}
                                          minRows="4"
                                          placeholder={"- Escreva um ou mais ideais."} />
                    </div>
                </Collapsible>
            </section>

            <section className={"section-tracos"}>
                <div className={"textarea-center-container"}>
                    <div className={"textarea-meio"}>
                        <Collapsible trigger={"Traços negativos"}
                                     triggerStyle={{fontSize: "1.5em", color: "rgb(43, 43, 43)"}}
                                     transitionTime={100}
                                     transitionCloseTime={100}>
                            <div className={"textarea-container"}>
                                <TextareaAutosize className="form-control textarea-sheet"
                                                  id="exampleFormControlTextarea1"
                                                  value={tracosNegativos}
                                                  onChange={handleChange(setTracosNegativos)}
                                                  minRows="4"
                                                  placeholder={"- Escreva um ou mais traços negativos.\n" +
                                                      "- Os traços podem ser físicos ou mentais."} />
                            </div>
                        </Collapsible>
                    </div>
                    <div className={"textarea-meio"}>
                        <Collapsible trigger={"Traços positivos"}
                                     triggerStyle={{fontSize: "1.5em", color: "rgb(43, 43, 43)"}}
                                     transitionTime={100}
                                     transitionCloseTime={100}>
                            <div className={"textarea-container"}>
                                <TextareaAutosize className="form-control textarea-sheet"
                                                  id="exampleFormControlTextarea1"
                                                  value={tracosPositivos}
                                                  onChange={handleChange(setTracosPositivos)}
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
                             triggerStyle={{fontSize: "1.5em", color: "rgb(43, 43, 43)"}}
                             transitionTime={100}
                             transitionCloseTime={100}>
                    <div className={"textarea-container"}>
                        <TextareaAutosize className="form-control textarea-sheet"
                                          id="exampleFormControlTextarea1"
                                          value={origemForma}
                                          onChange={handleChange(setOrigemForma)}
                                          minRows="7"
                                          placeholder={"Escreva a origem da sua forma."} />
                    </div>
                </Collapsible>
            </section>

        </main>

    )
}