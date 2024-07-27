import { useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Collapsible from "react-collapsible";
import {saveItem} from "../assets/systems/SaveLoad.jsx";

const CreateAnnotations = ({ array, handleContentChange, handleDelete }) => {
    return array.length > 0 && array.map((annotation, index) => (
        <Collapsible
            className={"note"}
            openedClassName={"note"}
            trigger={annotation.title}
            triggerStyle={{fontSize: "1.5em", color: "rgb(43, 43, 43)"}}
            transitionTime={100}
            transitionCloseTime={100}
            key={annotation.id}
        >
            <div className="textarea-container-annotation">
                <TextareaAutosize
                    className="form-control textarea-ficha"
                    id={`textarea-${annotation.id}`} // Usar ID único aqui também
                    value={annotation.content}
                    onChange={(event) => handleContentChange(event, index)}
                    minRows="4"
                    placeholder="Escreva suas anotações."
                ></TextareaAutosize>
                <div className={"delete-button"}>
                    <button className={"button-header active clear"} onClick={() => handleDelete(index)}>
                        {"Excluir "}
                        <i className="bi bi-trash3-fill"></i></button>
                </div>
            </div>
        </Collapsible>
    ));
};

export default function Page5() {
    const [createTitle, setCreateTitle] = useState("");
    const [annotationsArray, setAnnotationsArray] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const savedAnnotations = JSON.parse(localStorage.getItem('annotationsArray'));
        if (savedAnnotations) {
            setAnnotationsArray(savedAnnotations);
        }
    }, []);

    const saveAnnotations = (newAnnotations) => {
        setAnnotationsArray(newAnnotations);
        saveItem('annotationsArray', newAnnotations);
        localStorage.setItem('annotationsArray', JSON.stringify(newAnnotations));
    };

    const handleContentChange = (event, index) => {
        const updatedAnnotations = annotationsArray.map((annotation, i) =>
            i === index ? { ...annotation, content: event.target.value } : annotation
        );
        saveAnnotations(updatedAnnotations);
    };

    const handleDelete = (index) => {
        const updatedAnnotations = annotationsArray.filter((_, i) => i !== index);
        saveAnnotations(updatedAnnotations);
    };

    const filteredAnnotations = annotationsArray.filter(annotation =>
        annotation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        annotation.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <main className="mainCommon">
                <div className="create-annotation">
                    <div className="create-annotation input">
                        <input
                            className="create-annotation-title"
                            type="text"
                            onChange={(event) => setCreateTitle(event.target.value)}
                            placeholder="Título da anotação."
                        />
                    </div>
                    <div className="create-annotation button">
                        <button
                            className="button-header active create"
                            onClick={() => (createTitle.trim()) ? saveAnnotations([...annotationsArray, {
                                title: createTitle,
                                content: ''
                            }]) : null}
                        >
                            Criar Anotação
                        </button>
                    </div>
                    <div className={"search"}>
                        <input
                            className={"search skill"}
                            type="text"
                            placeholder="pesquisar anotações..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </div>
                </div>
                <section className={"container-annotations"}>
                    <CreateAnnotations
                        array={filteredAnnotations}
                        handleContentChange={handleContentChange}
                        handleDelete={handleDelete}
                    />
                </section>
            </main>
        </>
    );
}
