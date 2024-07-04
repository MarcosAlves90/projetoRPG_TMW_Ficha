
export default function FichaPage2() {
    return (
        <>
            <div className={"fichaComum"}>
                <div className={"textarea-meio"}>
                    <div>
                        <h2 className={"fichaComum title-2"}>traços negativos.</h2>
                        <div className={"textarea-container"}>
                            <textarea className="form-control textarea-ficha" id="exampleFormControlTextarea1"
                                      rows="4" placeholder={"- Escreva um ou mais traços negativos."}></textarea>
                        </div>
                    </div>
                    <div>
                        <h2 className={"fichaComum title-2"}>traços positivos.</h2>
                        <div className={"textarea-container"}>
                            <textarea className="form-control textarea-ficha"
                                      id="exampleFormControlTextarea1"
                                      rows="4" placeholder={"- Escreva um ou mais traços positivos."}></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}