import {useCallback, useEffect, useMemo, useRef, useState, useContext} from "react";
import Collapsible from "react-collapsible";
import {v4 as uuidv4} from 'uuid';
import {saveUserData} from "../firebaseUtils.js";
import {UserContext} from "../UserContext";
import {StyledButton, StyledFormControl, StyledTextField} from "../assets/systems/CommonComponents.jsx";
import {Box, InputAdornment, MenuItem, Select} from "@mui/material";
import {Search, Delete, FileCopy, ContentPasteGo, AddCircle} from "@mui/icons-material";
import styled from "styled-components";

const StyledInputsBox = styled(Box)`
    display: flex;
    gap: 1rem;
    margin: 1rem 0;

    .buttonsBox {
        display: flex;
        gap: 1rem;
    }

    @media (max-width: 991px) {
        flex-direction: column;
        gap: 2vw;
        margin: 2vw 0;
        .buttonsBox {
            gap: 2vw;

            button {
                width: 100%;
            }
        }
    }
`;

export default function Page4() {
    const [createSkill, setCreateSkill] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeDomains, setActiveDomains] = useState([]);

    const {userData, setUserData, user} = useContext(UserContext);
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

    const handleElementChange = useCallback((key) => (value) => {
        setUserData((prevUserData) => ({
            ...prevUserData, [key]: value,
        }));
    }, [setUserData]);

    const saveSkills = useCallback((newSkills) => {
        handleElementChange("skillsArray")(newSkills);
    }, [handleElementChange]);

    const handleContentChange = useCallback((e, id, fieldName) => {
        const updatedSkills = userData.skillsArray.map((skill) => {
            if (skill.id === id) {
                const value = e.target.value;
                return {...skill, [fieldName]: value};
            }
            return skill;
        });

        saveSkills(updatedSkills);
    }, [userData.skillsArray, saveSkills]);

    const handleDelete = useCallback((id) => {
        const updatedSkills = userData.skillsArray.filter((skill) => skill.id !== id);
        saveSkills(updatedSkills);
    }, [userData.skillsArray, saveSkills]);

    const pasteRef = useRef(null);

    useEffect(() => {
        const handlePasteEvent = async (event) => {
            if (event.clipboardData) {
                const text = event.clipboardData.getData('text');
                try {
                    const skill = JSON.parse(text);
                    if (skill && skill.title && skill.id) {
                        const newSkill = {...skill, id: uuidv4()};
                        setUserData((prevUserData) => {
                            const updatedSkills = [...(prevUserData.skillsArray || []), newSkill];
                            saveSkills(updatedSkills);
                            return {...prevUserData, skillsArray: updatedSkills};
                        });
                        event.preventDefault();
                    }
                } catch (err) {
                    console.error("Invalid JSON data: ", err);
                }
            }
        };

        const element = pasteRef.current;
        element.addEventListener('paste', handlePasteEvent);
        return () => {
            element.removeEventListener('paste', handlePasteEvent);
        };
    }, [saveSkills]);

    const handleCopy = useCallback(async (skill) => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(skill));
        } catch (err) {
            console.error("Falha ao copiar a skill: ", err);
        }
    }, []);

    const handlePaste = useCallback(async () => {
        try {
            const text = await navigator.clipboard.readText();
            const skill = JSON.parse(text);
            const newSkill = {...skill, id: uuidv4()};
            saveSkills([...userData.skillsArray, newSkill]);
        } catch (err) {
            console.error("Falha ao colar a skill: ", err);
        }
    }, [saveSkills, userData.skillsArray]);

    const clearInput = useCallback(() => {
        setCreateSkill("");
    }, []);

    const uniqueDomains = useMemo(() => Array.from(new Set((userData.skillsArray || [])
        .filter(skill => skill.domain && skill.domain.trim() !== "")
        .map(skill => skill.domain))), [userData.skillsArray]);

    const filteredSkills = useMemo(() => (userData.skillsArray || []).filter(skill => {
        const matchesSearchTerm = searchTerm === "" || Object.values(skill).some(value => value.toString().toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesDomain = activeDomains.length === 0 || activeDomains.includes(skill.domain);
        return matchesSearchTerm && matchesDomain;
    }), [userData.skillsArray, searchTerm, activeDomains]);

    const searchByDomain = useCallback((domain) => {
        const updatedDomains = activeDomains.includes(domain) ? activeDomains.filter(d => d !== domain) : [...activeDomains, domain];

        setActiveDomains(updatedDomains);
    }, [activeDomains]);

    const linkedDomains = useMemo(() => ["Fass", "Ris", "Xata", "Lohk", "Khra", "Netra", "Vome", "Jahu"], []);

    const handleCreateSkill = useCallback(() => {
        if (createSkill.trim()) {
            saveSkills([...(userData.skillsArray || []), {
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
            }]);
            clearInput();
        }
    }, [createSkill, saveSkills, userData.skillsArray, clearInput]);

    const createSkills = useCallback(({array, handleContentChange, handleDelete, handleCopy}) => {
        return array.length > 0 && array.map((skill) => (
            <Collapsible
                className={"skill"}
                openedClassName={"skill"}
                trigger={skill.title || `Skill: ${skill.id}`}
                triggerStyle={{fontSize: "1.5em", color: "rgb(43, 43, 43)"}}
                transitionTime={100}
                transitionCloseTime={100}
                key={skill.id}
            >
                <div className={"container-skill-selectors color-gray-placeholder"}>
                    <article className={"container-textarea-skill-left"}>
                        <section className={"section-skill-selectors"}>
                            <div className={"container-skill-select"}>
                                <p>Círculo: </p>
                                <StyledFormControl variant={"outlined"} fullWidth size={"small"}>
                                    <Select
                                        onChange={(e) => handleContentChange(e, skill.id, 'circle')}
                                        value={skill.circle}>
                                        <MenuItem value={1}>
                                            1° Círculo
                                        </MenuItem>
                                        <MenuItem value={2}>
                                            2° Círculo
                                        </MenuItem>
                                        <MenuItem value={3}>
                                            3° Círculo
                                        </MenuItem>
                                    </Select>
                                </StyledFormControl>
                            </div>
                            <div className={"container-skill-select"}>
                                <p>Categoria: </p>
                                <StyledFormControl variant={"outlined"} fullWidth size={"small"}>
                                    <Select
                                        onChange={(e) => handleContentChange(e, skill.id, 'type')}
                                        value={skill.type}>
                                        <MenuItem value={1}>
                                            Ativa
                                        </MenuItem>
                                        <MenuItem value={2}>
                                            Passiva
                                        </MenuItem>
                                    </Select>
                                </StyledFormControl>
                            </div>
                            <div className={"container-skill-select"}>
                                <p>Gasto: </p>
                                <StyledTextField
                                    type={"text"}
                                    variant="outlined"
                                    size={"small"}
                                    fullWidth
                                    onChange={(e) => handleContentChange(e, skill.id, 'spent')}
                                    value={skill.spent}
                                    placeholder={"gasto..."}
                                />
                            </div>
                            <div className={"container-skill-select"}>
                                <p>Arte: </p>
                                <StyledTextField
                                    type={"text"}
                                    variant="outlined"
                                    size={"small"}
                                    fullWidth
                                    onChange={(e) => handleContentChange(e, skill.id, 'art')}
                                    value={skill.art}
                                    placeholder={"arte utilizada..."}
                                />
                            </div>
                            <div className={"container-skill-select last-select"}>
                                <p>Execução: </p>
                                <StyledFormControl variant={"outlined"} fullWidth size={"small"}>
                                    <Select
                                        onChange={(e) => handleContentChange(e, skill.id, 'execution')}
                                        value={skill.execution}>
                                        <MenuItem value={1}>
                                            Padrão
                                        </MenuItem>
                                        <MenuItem value={2}>
                                            Livre
                                        </MenuItem>
                                        <MenuItem value={3}>
                                            Completa
                                        </MenuItem>
                                        <MenuItem value={4}>
                                            Reação
                                        </MenuItem>
                                        <MenuItem value={5}>
                                            Movimento
                                        </MenuItem>
                                        <MenuItem value={6}>
                                            Outros
                                        </MenuItem>
                                    </Select>
                                </StyledFormControl>
                            </div>
                        </section>
                        <section className={"section-skill-selectors right"}>
                            <div className={"container-skill-select"}>
                                <p>Alcance: </p>
                                <StyledFormControl variant={"outlined"} fullWidth size={"small"}>
                                    <Select
                                        onChange={(e) => handleContentChange(e, skill.id, 'range')}
                                        value={skill.range}>
                                        <MenuItem value={1}>
                                            Pessoal
                                        </MenuItem>
                                        <MenuItem value={2}>
                                            Toque
                                        </MenuItem>
                                        <MenuItem value={3}>
                                            Curto
                                        </MenuItem>
                                        <MenuItem value={4}>
                                            Médio
                                        </MenuItem>
                                        <MenuItem value={5}>
                                            Longo
                                        </MenuItem>
                                        <MenuItem value={6}>
                                            Extremo
                                        </MenuItem>
                                        <MenuItem value={7}>
                                            Ilimitado
                                        </MenuItem>
                                    </Select>
                                </StyledFormControl>
                            </div>
                            <div className={"container-skill-select"}>
                                <p>Área: </p>
                                <StyledTextField
                                    type={"text"}
                                    variant={"outlined"}
                                    size={"small"}
                                    fullWidth
                                    onChange={(e) => handleContentChange(e, skill.id, 'area')}
                                    value={skill.area}
                                    placeholder={"área da skill..."}
                                />
                            </div>
                            <div className={"container-skill-select"}>
                                <p>Alvo: </p>
                                <StyledTextField
                                    type={"text"}
                                    variant={"outlined"}
                                    size={"small"}
                                    fullWidth
                                    onChange={(e) => handleContentChange(e, skill.id, 'target')}
                                    value={skill.target}
                                    placeholder={"alvos da skill..."}
                                />
                            </div>
                            <div className={"container-skill-select"}>
                                <p>Duração: </p>
                                <StyledTextField
                                    type={"text"}
                                    variant={"outlined"}
                                    size={"small"}
                                    fullWidth
                                    onChange={(e) => handleContentChange(e, skill.id, 'duration')}
                                    value={skill.duration}
                                    placeholder={"duração da skill..."}
                                />
                            </div>
                            <div className={"container-skill-select last-select"}>
                                <p>Resistência: </p>
                                <StyledTextField
                                    type={"text"}
                                    variant={"outlined"}
                                    size={"small"}
                                    fullWidth
                                    onChange={(e) => handleContentChange(e, skill.id, 'resistance')}
                                    value={skill.resistance}
                                    placeholder={"resistência da skill..."}
                                />
                            </div>
                        </section>
                    </article>
                    <article className={"container-textarea-skill-right"}>
                        <div className={"container-skill-select"}>
                            <p>Nome: </p>
                            <StyledTextField
                                type={"text"}
                                variant={"outlined"}
                                size={"small"}
                                fullWidth
                                placeholder={"nome da skill..."}
                                value={skill.title}
                                onChange={(e) => handleContentChange(e, skill.id, 'title')}
                            />
                        </div>
                        <div className={"container-skill-select"}>
                            <p>Domínio: </p>
                            <StyledTextField
                                variant={"outlined"}
                                size={"small"}
                                fullWidth
                                placeholder={"domínios da skill..."}
                                value={skill.domain}
                                onChange={(e) => handleContentChange(e, skill.id, 'domain')}
                            />
                        </div>
                    </article>
                </div>
                <div className="container-textarea-annotation">
                    <StyledTextField
                        multiline
                        variant={"outlined"}
                        className={"textarea"}
                        value={skill.content}
                        onChange={(e) => handleContentChange(e, skill.id, 'content')}
                        minRows={5}
                        fullWidth
                        placeholder="descrição da Skill..."
                    />
                    <div className={"box"}>
                        <StyledButton className={"delete"}
                                      variant="contained" color="primary"
                                      fullWidth
                                      onClick={() => handleDelete(skill.id)}
                                      endIcon={<Delete/>}>Excluir</StyledButton>
                        <StyledButton
                            variant="contained" color="primary"
                            fullWidth
                            onClick={() => handleCopy(skill)}
                            endIcon={<FileCopy/>}>Copiar</StyledButton>
                    </div>
                </div>
            </Collapsible>
        ));
    }, []);

    return (
        <main className="mainCommon page-4" ref={pasteRef}>
            <StyledInputsBox>
                <StyledTextField
                    type="text"
                    variant="outlined"
                    placeholder="nome da skill..."
                    value={createSkill}
                    onChange={(event) => setCreateSkill(event.target.value)}
                    fullWidth
                />
                <Box className={"buttonsBox"}>
                    <StyledButton
                        variant="contained" color="primary"
                        onClick={handleCreateSkill}
                        endIcon={<AddCircle/>}
                    >
                        Criar Skill
                    </StyledButton>
                    <StyledButton
                        variant="contained" color="primary"
                        onClick={handlePaste}
                        endIcon={<ContentPasteGo/>}
                    >
                        Colar Skill
                    </StyledButton>
                </Box>
                <StyledTextField
                    type="text"
                    variant="outlined"
                    placeholder="pesquisar skills..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    fullWidth
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search/>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </StyledInputsBox>

            <section className="tag-cloud display-flex-center">
                <span className={"tag qty"}>
                    <i className="bi bi-archive-fill" />
                    {`${userData.skillsArray ? userData.skillsArray.length : 0}/10 Skills`}
                </span>
                {uniqueDomains.map((domain) => {
                    const isLinked = linkedDomains.includes(domain);
                    const isReflex = domain.toLowerCase() === "reflexo";
                    return (
                        <span key={domain}
                            className={`tag 
                            ${activeDomains.includes(domain) ? "active" : ""} ${isLinked ? "linked" : ""} 
                            ${isReflex ? "reflex" : ""}`}
                            onClick={() => searchByDomain(domain)}>
                            <i className="bi bi-stars" />
                            {domain}
                        </span>
                    );
                })}
            </section>

            {createSkills({
                array: filteredSkills,
                handleContentChange,
                handleDelete,
                handleCopy
            })}
        </main>
    );
}