import { useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Collapsible from "react-collapsible";

const CreateSkills = ({ array, handleContentChange, handleDelete }) => {

    return array.length > 0 && array.map((skill, index) => (
        <Collapsible
            className={"skill"}
            openedClassName={"skill"}
            trigger={skill.title}
            triggerStyle={{fontSize: "1.5em", color: "rgb(43, 43, 43)"}}
            transitionTime={100}
            transitionCloseTime={100}
            key={skill.id}
        >
            <container className={"container-skill-selectors color-gray-placeholder"}>
                <article className={"container-textarea-skill-left"}>
                    <section className={"section-skill-selectors"}>
                        <div className={"container-skill-select"}>
                            <p>Círculo: </p>
                            <select className={"form-select custom-select margin circle-skill"}
                                    onChange={(event) => handleContentChange(event, index)}
                                    value={skill.circle}
                                    id={`select-${skill.id}`}>
                                <option value={1}>
                                    1° Círculo
                                </option>
                                <option value={2}>
                                    2° Círculo
                                </option>
                                <option value={3}>
                                    3° Círculo
                                </option>
                            </select>
                        </div>
                        <div className={"container-skill-select"}>
                            <p>Categoria: </p>
                            <select className={"form-select custom-select margin type-skill"}
                                    onChange={(event) => handleContentChange(event, index)}
                                    value={skill.type}
                                    id={`select-type-${skill.id}`}>
                                <option value={1}>
                                    Ativa
                                </option>
                                <option value={2}>
                                    Passiva
                                </option>
                            </select>
                        </div>
                        <div className={"container-skill-select"}>
                            <p>Gasto: </p>
                            <input
                                type={"text"}
                                className={"input-skill spent-skill"}
                                onChange={(event) => handleContentChange(event, index)}
                                value={skill.spent}
                                id={`select-spent-${skill.id}`}
                                placeholder={"gasto da skill."}
                            />
                        </div>
                        <div className={"container-skill-select"}>
                            <p>Arte: </p>
                            <input
                                type={"text"}
                                className={"input-skill art-skill"}
                                onChange={(event) => handleContentChange(event, index)}
                                value={skill.art}
                                id={`select-art-${skill.id}`}
                                placeholder={"arte utilizada pela skill."}
                            />
                        </div>
                        <div className={"container-skill-select last-select"}>
                            <p>Execução: </p>
                            <select className={"form-select custom-select margin execution-skill"}
                                    onChange={(event) => handleContentChange(event, index)}
                                    value={skill.execution}
                                    id={`select-execution-${skill.id}`}>
                                <option value={1}>
                                    Padrão
                                </option>
                                <option value={2}>
                                    Livre
                                </option>
                                <option value={3}>
                                    Completa
                                </option>
                                <option value={4}>
                                    Reação
                                </option>
                                <option value={5}>
                                    Movimento
                                </option>
                                <option value={6}>
                                    Outros
                                </option>
                            </select>
                        </div>
                    </section>
                    <section className={"section-skill-selectors right"}>
                        <div className={"container-skill-select"}>
                            <p>Alcance: </p>
                            <select className={"form-select custom-select margin range-skill"}
                                    onChange={(event) => handleContentChange(event, index)}
                                    value={skill.range}
                                    id={`select-range-${skill.id}`}>
                                <option value={1}>
                                    Pessoal
                                </option>
                                <option value={2}>
                                    Toque
                                </option>
                                <option value={3}>
                                    Curto
                                </option>
                                <option value={4}>
                                    Médio
                                </option>
                                <option value={5}>
                                    Longo
                                </option>
                                <option value={6}>
                                    Extremo
                                </option>
                                <option value={7}>
                                    Ilimitado
                                </option>
                            </select>
                        </div>
                        <div className={"container-skill-select"}>
                            <p>Área: </p>
                            <input
                                type={"text"}
                                className={"input-skill area-skill"}
                                onChange={(event) => handleContentChange(event, index)}
                                value={skill.area}
                                id={`select-area-${skill.id}`}
                                placeholder={"área da skill."}
                            />
                        </div>
                        <div className={"container-skill-select"}>
                            <p>Alvo: </p>
                            <input
                                type={"text"}
                                className={"input-skill target-skill"}
                                onChange={(event) => handleContentChange(event, index)}
                                value={skill.target}
                                id={`select-target-${skill.id}`}
                                placeholder={"alvos da skill."}
                            />
                        </div>
                        <div className={"container-skill-select"}>
                            <p>Duração: </p>
                            <input
                                type={"text"}
                                className={"input-skill duration-skill"}
                                onChange={(event) => handleContentChange(event, index)}
                                value={skill.duration}
                                id={`select-duration-${skill.id}`}
                                placeholder={"duração da skill."}
                            />
                        </div>
                        <div className={"container-skill-select last-select"}>
                            <p>Resistência: </p>
                            <input
                                type={"text"}
                                className={"input-skill resistance-skill"}
                                onChange={(event) => handleContentChange(event, index)}
                                value={skill.resistance}
                                id={`select-resistance-${skill.id}`}
                                placeholder={"resistência da skill."}
                            />
                        </div>
                    </section>
                </article>
                <article className={"container-textarea-skill-right"}>
                    <div className={"container-skill-select"}>
                        <p>Nome: </p>
                        <input
                            type={"text"}
                            className={"input-skill skill-title"}
                            value={skill.title}
                            id={`skill-title-${skill.id}`}
                            onChange={(event) => handleContentChange(event, index)}
                        />
                    </div>

                </article>
            </container>
            <div className="container-textarea-annotation">
                <TextareaAutosize
                    className="form-control textarea-sheet content-skill"
                    id={`textarea-${skill.id}`}
                    value={skill.content}
                    onChange={(event) => handleContentChange(event, index)}
                    minRows="4"
                    placeholder="Descrição da Skill."
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

export default function Page4() {
    const [createSkill, setCreateSkill] = useState("");
    const [skillsArray, setSkillsArray] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const savedSkills = JSON.parse(localStorage.getItem('skillsArray'));
        if (savedSkills) {
            setSkillsArray(savedSkills);
        }
    }, []);

    const saveSkills = (newSkills) => {
        setSkillsArray(newSkills);
        localStorage.setItem('skillsArray', JSON.stringify(newSkills));
    };

    const handleContentChange = (event, index) => {
        const updatedSkills = skillsArray.map((skill, i) => {
            if (i === index) {
                if (event.target.classList.contains('circle-skill')) {
                    return {...skill, circle: parseInt(event.target.value)};
                } else if (event.target.classList.contains('content-skill')) {
                    return {...skill, content: event.target.value};
                } else if (event.target.classList.contains('type-skill')) {
                    return {...skill, type: parseInt(event.target.value)};
                } else if (event.target.classList.contains('art-skill')) {
                    return {...skill, art: event.target.value};
                } else if (event.target.classList.contains('execution-skill')) {
                    return {...skill, execution: parseInt(event.target.value)};
                } else if (event.target.classList.contains('range-skill')) {
                    return {...skill, range: parseInt(event.target.value)}
                } else if (event.target.classList.contains('target-skill')) {
                    return {...skill, target: event.target.value};
                } else if (event.target.classList.contains('duration-skill')) {
                    return {...skill, duration: event.target.value};
                } else if (event.target.classList.contains('resistance-skill')) {
                    return {...skill, resistance: event.target.value};
                } else if (event.target.classList.contains('area-skill')) {
                    return {...skill, area: event.target.value};
                } else if (event.target.classList.contains('spent-skill')) {
                    return {...skill, spent: event.target.value};
                } else if (event.target.id.includes('skill-title')) {
                    return {...skill, title: event.target.value};
                }
            }
            return skill;
        });
        saveSkills(updatedSkills);
    };

    const handleDelete = (index) => {
        const updatedSkills = skillsArray.filter((_, i) => i !== index);
        saveSkills(updatedSkills);
    };

    const filteredSkills = skillsArray.filter(skill =>
        skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const clearInput = () => {
        setCreateSkill("");
    };

    return (
        <>
            <main className="mainCommon">
                <div className="create-annotation">
                    <div className="create-annotation input">
                        <input
                            className="create-annotation-title"
                            type="text"
                            value={createSkill}
                            onChange={(event) => setCreateSkill(event.target.value)}
                            placeholder="Nome da Skill."
                        />
                    </div>
                    <div className="create-annotation button">
                        <button
                            className="button-header active create"
                            onClick={() => {
                                if (createSkill.trim()) {
                                    saveSkills([...skillsArray, {
                                        title: createSkill,
                                        content: '',
                                        circle: 1,
                                        type: 1,
                                        art: '',
                                        execution: 1,
                                        range: 1,
                                        target: '',
                                        duration: '',
                                        resistance: '',
                                        area: '',
                                        spent: '',
                                    }]);
                                    clearInput();
                                }
                            }}
                        >
                            Criar Skill
                        </button>
                    </div>
                    <div className={"search"}>
                        <input
                            className={"search skill"}
                            type="text"
                            placeholder="pesquisar skills..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />

                    </div>
                </div>
                <CreateSkills
                    array={filteredSkills}
                    handleContentChange={handleContentChange}
                    handleDelete={handleDelete}
                />
            </main>
        </>
    );
}