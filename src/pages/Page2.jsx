import {useState, useEffect} from "react";
import {getItem, saveItem, handleChange, deleteItem} from "../assets/systems/SaveLoad.jsx";
import TextareaAutosize from 'react-textarea-autosize';

export default function Page2() {

    const [ideais, setIdeais] = useState(getItem('ideais', ''));
    const [tracosNegativos, setTracosNegativos] = useState(getItem('tracosNegativos', ''));
    const [tracosPositivos, setTracosPositivos] = useState(getItem('tracosPositivos', ''));
    const [origem, setOrigem] = useState(getItem('origem', ''));
    const [origemForma, setOrigemForma] = useState(getItem('origemForma', ''));


    useEffect(() => {
        const stateMap = {
            'ideais': ideais,
            'tracosNegativos': tracosNegativos,
            'tracosPositivos': tracosPositivos,
            'origem': origem,
            'origemForma': origemForma
        };

        Object.keys(stateMap).forEach((key) => {
            if (stateMap[key] !== '') {
                saveItem(key, stateMap[key]);
            } else {
                deleteItem(key);
            }
        });

    }, [ideais, tracosNegativos, tracosPositivos, origem, origemForma]);

    return (
        <>
            <div className={"fichaComum page-2"}>
                <section className={"section-ideais"}>
                    <div className={"title-2-container"}>
                        <h2 className={"fichaComum title-2"}>ideais.</h2>
                    </div>
                    <div className={"textarea-container"}>
                        <TextareaAutosize  className="form-control textarea-ficha"
                                  id="exampleFormControlTextarea1"
                                  value={ideais}
                                  onChange={handleChange(setIdeais)}
                                  minRows="4"
                                  placeholder={"- Escreva um ou mais ideais."}></TextareaAutosize>
                    </div>
                </section>
                <section className={"section-tracos"}>
                    <div className={"textarea-meio-container"}>
                        <div className={"textarea-meio"}>
                        <div className={"title-2-container"}>
                                <h2 className={"fichaComum title-2"}>traços negativos.</h2>
                            </div>
                            <div className={"textarea-container"}>
                            <TextareaAutosize className="form-control textarea-ficha"
                                      id="exampleFormControlTextarea1"
                                      value={tracosNegativos}
                                      onChange={handleChange(setTracosNegativos)}
                                      minRows="4"
                                      placeholder={"- Escreva um ou mais traços negativos.\n" +
                                          "- Os traços podem ser físicos ou mentais."}></TextareaAutosize>
                            </div>
                        </div>
                        <div className={"textarea-meio"}>
                            <div className={"title-2-container"}>
                                <h2 className={"fichaComum title-2"}>traços positivos.</h2>
                            </div>
                            <div className={"textarea-container"}>
                            <TextareaAutosize className="form-control textarea-ficha"
                                      id="exampleFormControlTextarea1"
                                      value={tracosPositivos}
                                      onChange={handleChange(setTracosPositivos)}
                                      minRows="4"
                                      placeholder={"- Escreva um ou mais traços positivos.\n" +
                                          "- Os traços podem ser físicos ou mentais."}></TextareaAutosize>
                            </div>
                        </div>
                    </div>
                </section>
                <section className={"section-origem"}>
                    <div className={"title-2-container"}>
                        <h2 className={"fichaComum title-2"}>origem.</h2>
                    </div>
                    <div className={"textarea-container"}>
                        <TextareaAutosize className="form-control textarea-ficha"
                                  id="exampleFormControlTextarea1"
                                  value={origem}
                                  onChange={handleChange(setOrigem)}
                                  minRows="7"
                                  placeholder={"Escreva a sua origem."}></TextareaAutosize>
                    </div>
                </section>
                <section className={"section-origem-forma"}>
                    <div className={"title-2-container"}>
                        <h2 className={"fichaComum title-2"}>origem da forma.</h2>
                    </div>
                    <div className={"textarea-container"}>
                        <TextareaAutosize className="form-control textarea-ficha"
                                  id="exampleFormControlTextarea1"
                                  value={origemForma}
                                    onChange={handleChange(setOrigemForma)}
                                  minRows="7"
                                  placeholder={"Escreva a origem da sua forma."}></TextareaAutosize>
                    </div>
                </section>
            </div>
        </>
    )
}