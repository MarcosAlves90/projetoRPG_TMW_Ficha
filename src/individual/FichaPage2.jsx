
export default function FichaPage2() {
    return (
        <>
            <div className={"fichaComum"}>
                <section className={"section-ideais"}>
                    <h2 className={"fichaComum title-2"}>ideais.</h2>
                    <div className={"textarea-container"}>
                        <textarea className="form-control textarea-ficha" id="exampleFormControlTextarea1"
                                  rows="4" placeholder={"- Escreva um ou mais ideais."}></textarea>
                    </div>
                </section>
                <section className={"section-tracos"}>
                    <div className={"textarea-meio"}>
                        <div>
                            <h2 className={"fichaComum title-2"}>traços negativos.</h2>
                            <div className={"textarea-container"}>
                            <textarea className="form-control textarea-ficha" id="exampleFormControlTextarea1"
                                      rows="4" placeholder={"- Escreva um ou mais traços negativos.\n" +
                                "- Os traços podem ser físicos ou mentais."}></textarea>
                            </div>
                        </div>
                        <div>
                            <h2 className={"fichaComum title-2"}>traços positivos.</h2>
                            <div className={"textarea-container"}>
                            <textarea className="form-control textarea-ficha"
                                      id="exampleFormControlTextarea1"
                                      rows="4" placeholder={"- Escreva um ou mais traços positivos.\n" +
                                "- Os traços podem ser físicos ou mentais."}></textarea>
                            </div>
                        </div>
                    </div>
                </section>
                <section className={"section-origem"}>
                    <h2 className={"fichaComum title-2"}>origem.</h2>
                    <div className={"textarea-container"}>
                        <textarea className="form-control textarea-ficha" id="exampleFormControlTextarea1"
                                  rows="7" placeholder={"Escreva a sua origem."}></textarea>
                    </div>
                </section>
                <section className={"section-origem-forma"}>
                    <h2 className={"fichaComum title-2"}>origem da forma.</h2>
                    <div className={"textarea-container"}>
                        <textarea className="form-control textarea-ficha" id="exampleFormControlTextarea1"
                                  rows="7" placeholder={"Escreva a origem da sua forma."}></textarea>
                    </div>
                </section>
            </div>
        </>
    )
}