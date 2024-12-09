import { useCallback, useEffect, useMemo, useRef, useState, useContext } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Collapsible from "react-collapsible";
import { v4 as uuidv4 } from 'uuid';
import { saveUserData } from "../firebaseUtils.js";
import { UserContext } from "../UserContext";

function CreateSkills({ array, handleContentChange, handleDelete, handleCopy }) {

    return array.length > 0 && array.map((skill) => (
        <Collapsible
            className={"skill"}
            openedClassName={"skill"}
            trigger={skill.title}
            triggerStyle={{ fontSize: "1.5em", color: "rgb(43, 43, 43)" }}
            transitionTime={100}
            transitionCloseTime={100}
            key={skill.id}
        >
            <div className={"container-skill-selectors color-gray-placeholder"}>
                <article className={"container-textarea-skill-left"}>
                    <section className={"section-skill-selectors"}>
                        <div className={"container-skill-select"}>
                            <p>Círculo: </p>
                            <select className={"form-select custom-select margin circle-skill"}
                                onChange={(e) => handleContentChange(e, skill.id)}
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
                                onChange={(e) => handleContentChange(e, skill.id)}
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
                                onChange={(e) => handleContentChange(e, skill.id)}
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
                                onChange={(e) => handleContentChange(e, skill.id)}
                                value={skill.art}
                                id={`select-art-${skill.id}`}
                                placeholder={"arte utilizada pela skill."}
                            />
                        </div>
                        <div className={"container-skill-select last-select"}>
                            <p>Execução: </p>
                            <select className={"form-select custom-select margin execution-skill"}
                                onChange={(e) => handleContentChange(e, skill.id)}
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
                                onChange={(e) => handleContentChange(e, skill.id)}
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
                                onChange={(e) => handleContentChange(e, skill.id)}
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
                                onChange={(e) => handleContentChange(e, skill.id)}
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
                                onChange={(e) => handleContentChange(e, skill.id)}
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
                                onChange={(e) => handleContentChange(e, skill.id)}
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
                            onChange={(e) => handleContentChange(e, skill.id)}
                        />
                    </div>
                    <div className={"container-skill-select"}>
                        <p>Domínio: </p>
                        <input
                            className={"input-skill skill-domain"}
                            value={skill.domain}
                            id={`skill-domain-${skill.id}`}
                            onChange={(e) => handleContentChange(e, skill.id)}
                        />
                    </div>
                </article>
            </div>
            <div className="container-textarea-annotation">
                <TextareaAutosize
                    className="form-control textarea-sheet content-skill"
                    id={`textarea-${skill.id}`}
                    value={skill.content}
                    onChange={(e) => handleContentChange(e, skill.id)}
                    minRows="5"
                    placeholder="Descrição da Skill."
                />
                <div className={"box"}>
                    <div className={"delete-button"}>
                        <button className={"button-header active clear w-100"} onClick={() => handleDelete(skill.id)}>
                            {"Excluir "}
                            <i className="bi bi-trash3-fill" /></button>
                    </div>
                    <button className={"buttonCopy"} onClick={() => handleCopy(skill)}>
                        {"Copiar "}
                        <i className="bi bi-clipboard2-fill"></i></button>
                </div>
            </div>
        </Collapsible>
    ));
}

export default function Page4() {
    const [createSkill, setCreateSkill] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeDomains, setActiveDomains] = useState([]);

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

    const handleElementChange = (key) => (value) => {
        setUserData((prevUserData) => ({
            ...prevUserData,
            [key]: value,
        }));
    };

    const saveSkills = (newSkills) => {
        handleElementChange("skillsArray")(newSkills);
    };

    function handleContentChange(e, id) {
        const fieldMap = {
            'circle-skill': 'circle',
            'content-skill': 'content',
            'type-skill': 'type',
            'art-skill': 'art',
            'execution-skill': 'execution',
            'range-skill': 'range',
            'target-skill': 'target',
            'duration-skill': 'duration',
            'resistance-skill': 'resistance',
            'area-skill': 'area',
            'spent-skill': 'spent',
            'skill-title': 'title',
            'skill-domain': 'domain'
        };

        const updatedSkills = userData.skillsArray.map((skill) => {
            if (skill.id === id) {
                for (const [className, field] of Object.entries(fieldMap)) {
                    if (e.target.classList.contains(className) || e.target.id.includes(className)) {
                        const value = className.includes('skill') ? e.target.value : parseInt(e.target.value);
                        return { ...skill, [field]: value };
                    }
                }
            }
            return skill;
        });
        saveSkills(updatedSkills);
    }

    const handleDelete = (id) => {
        const updatedSkills = userData.skillsArray.filter((skill) => skill.id !== id);
        saveSkills(updatedSkills);
    };

    useEffect(() => {
        const handlePasteEvent = async (event) => {
            if (event.clipboardData) {
                const text = event.clipboardData.getData('text');
                try {
                    const skill = JSON.parse(text);
                    if (skill && skill.title && skill.id) {
                        const newSkill = { ...skill, id: uuidv4() };
                        setUserData((prevUserData) => {
                            const updatedSkills = [...prevUserData.skillsArray, newSkill];
                            saveSkills(updatedSkills);
                            return { ...prevUserData, skillsArray: updatedSkills };
                        });
                        event.preventDefault();
                    }
                } catch (err) {
                    console.error("Invalid JSON data: ", err);
                }
            }
        };

        const element = document.querySelector('.mainCommon.page-4');
        element.addEventListener('paste', handlePasteEvent);
        return () => {
            element.removeEventListener('paste', handlePasteEvent);
        };
    }, []);

    const handleCopy = async (skill) => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(skill));
        } catch (err) {
            console.error("Falha ao copiar a skill: ", err);
        }
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            const skill = JSON.parse(text);
            const newSkill = { ...skill, id: uuidv4() };
            saveSkills([...userData.skillsArray, newSkill]);
        } catch (err) {
            console.error("Falha ao colar a skill: ", err);
        }
    };

    const clearInput = () => {
        setCreateSkill("");
    };

    const uniqueDomains = useMemo(() => Array.from(new Set(
        (userData.skillsArray || [])
            .filter(skill => skill.domain && skill.domain.trim() !== "")
            .map(skill => skill.domain)
    )), [userData.skillsArray]);

    const filteredSkills = useMemo(() => (userData.skillsArray || []).filter(skill => {
        const matchesSearchTerm = searchTerm === "" || Object.values(skill).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesDomain = activeDomains.length === 0 || activeDomains.includes(skill.domain);
        return matchesSearchTerm && matchesDomain;
    }), [userData.skillsArray, searchTerm, activeDomains]);

    function searchByDomain(domain) {
        const updatedDomains = activeDomains.includes(domain)
            ? activeDomains.filter(d => d !== domain)
            : [...activeDomains, domain];

        setActiveDomains(updatedDomains);
    }

    const linkedDomains = ["Fass", "Ris", "Xata", "Lohk", "Khra", "Netra", "Vome", "Jahu"];

    return (
        <main className="mainCommon page-4">
            <section className="create-annotation">
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
                                saveSkills([
                                    ...(userData.skillsArray || []),
                                    {
                                        title: createSkill,
                                        domain: '',
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
                                        id: uuidv4()
                                    }
                                ]);
                                clearInput();
                            }
                        }}
                    >
                        Criar Skill
                    </button>
                    <button
                        className="button-header active create"
                        onClick={handlePaste}
                    >
                        Colar Skill
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
            </section>

            <section className="tag-cloud display-flex-center">
                {uniqueDomains.map((domain) => {
                    const isLinked = linkedDomains.includes(domain);
                    const isReflex = domain.toLowerCase() === "reflexo";
                    return (
                        <span key={domain}
                            className={`tag 
                            ${activeDomains.includes(domain) ? "active" : ""} ${isLinked ? "linked" : ""} 
                            ${isReflex ? "reflex" : ""}`}
                            onClick={() => searchByDomain(domain)}>
                            <i className="bi bi-stars"></i>
                            {domain}
                        </span>
                    );
                })}
            </section>

            <CreateSkills
                array={filteredSkills}
                handleContentChange={handleContentChange}
                handleDelete={handleDelete}
                handleCopy={handleCopy}
            />
        </main>
    );
}