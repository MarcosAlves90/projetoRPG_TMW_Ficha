import {useState, useEffect} from "react";
import {getItem, saveItem, handleChange, deleteItem} from "./SaveLoad.jsx";

export default function FichaPage2() {

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
            <div className={"fichaComum"}>
                <section className={"section-ideais"}>
                    <h2 className={"fichaComum title-2"}>ideais.</h2>
                    <div className={"textarea-container"}>
                        <textarea className="form-control textarea-ficha"
                                  id="exampleFormControlTextarea1"
                                  value={ideais}
                                  onChange={handleChange(setIdeais)}
                                  rows="4"
                                  placeholder={"- Escreva um ou mais ideais."}>

                        </textarea>
                    </div>
                </section>
                <section className={"section-tracos"}>
                    <div className={"textarea-meio"}>
                        <div>
                            <h2 className={"fichaComum title-2"}>traços negativos.</h2>
                            <div className={"textarea-container"}>
                            <textarea className="form-control textarea-ficha" 
                                      id="exampleFormControlTextarea1"
                                      value={tracosNegativos}
                                      onChange={handleChange(setTracosNegativos)}
                                      rows="4" 
                                      placeholder={"- Escreva um ou mais traços negativos.\n" +
                                "- Os traços podem ser físicos ou mentais."}></textarea>
                            </div>
                        </div>
                        <div>
                            <h2 className={"fichaComum title-2"}>traços positivos.</h2>
                            <div className={"textarea-container"}>
                            <textarea className="form-control textarea-ficha"
                                      id="exampleFormControlTextarea1"
                                      value={tracosPositivos}
                                      onChange={handleChange(setTracosPositivos)}
                                      rows="4" 
                                      placeholder={"- Escreva um ou mais traços positivos.\n" +
                                "- Os traços podem ser físicos ou mentais."}></textarea>
                            </div>
                        </div>
                    </div>
                </section>
                <section className={"section-origem"}>
                    <h2 className={"fichaComum title-2"}>origem.</h2>
                    <div className={"textarea-container"}>
                        <textarea className="form-control textarea-ficha"
                                  id="exampleFormControlTextarea1"
                                  value={origem}
                                  onChange={handleChange(setOrigem)}
                                  rows="7"
                                  placeholder={"Escreva a sua origem."}></textarea>
                    </div>
                </section>
                <section className={"section-origem-forma"}>
                    <h2 className={"fichaComum title-2"}>origem da forma.</h2>
                    <div className={"textarea-container"}>
                        <textarea className="form-control textarea-ficha"
                                  id="exampleFormControlTextarea1"
                                  value={origemForma}
                                    onChange={handleChange(setOrigemForma)}
                                  rows="7"
                                  placeholder={"Escreva a origem da sua forma."}></textarea>
                    </div>
                </section>
            </div>
        </>
    )
}