import { useState, useEffect, useCallback, useRef, useContext } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Collapsible from "react-collapsible";
import { v4 as uuidv4 } from 'uuid';
import { saveUserData } from "../firebaseUtils.js";
import { UserContext } from "../UserContext.jsx";
import {StyledButton, StyledTextField} from "../assets/systems/CommonComponents.jsx";
import styled from "styled-components";
import {Box, InputAdornment} from "@mui/material";
import {AddCircle, Delete, Search} from "@mui/icons-material";

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

const CreateAnnotations = ({ array, handleContentChange, handleDelete }) => {
    return array.length > 0 && array.map((annotation) => (
        <Collapsible
            className={"note"}
            openedClassName={"note"}
            trigger={annotation.title}
            triggerStyle={{ fontSize: "1.5em", color: "rgb(43, 43, 43)" }}
            transitionTime={100}
            transitionCloseTime={100}
            key={annotation.id}
        >
            <div className="container-textarea-annotation">
                <StyledTextField
                    multiline
                    variant={"outlined"}
                    className={"textarea"}
                    id={`textarea-${annotation.id}`}
                    value={annotation.content}
                    onChange={(event) => handleContentChange(event, annotation.id)}
                    minRows={5}
                    fullWidth
                    placeholder="Escreva suas anotações."
                />
                <div className={"box"}>
                    <StyledButton
                        className={"delete"}
                        variant="contained" color="primary"
                        fullWidth
                        onClick={() => handleDelete(annotation.id)}
                        endIcon={<Delete/>}
                    >
                        Excluir
                    </StyledButton>
                </div>
            </div>
        </Collapsible>
    ));
};

export default function Page5() {
    const [createTitle, setCreateTitle] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

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

    const saveAnnotations = (newAnnotations) => {
        handleElementChange('annotationsArray')(newAnnotations);
    };

    const handleContentChange = (event, id) => {
        const updatedAnnotations = userData.annotationsArray.map((annotation) =>
            annotation.id === id ? { ...annotation, content: event.target.value } : annotation
        );
        saveAnnotations(updatedAnnotations);
    };

    const handleDelete = (id) => {
        const updatedAnnotations = userData.annotationsArray.filter(annotation => annotation.id !== id);
        saveAnnotations(updatedAnnotations);
    };

    const filteredAnnotations = (userData.annotationsArray || []).filter(annotation =>
        annotation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        annotation.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const clearInput = () => setCreateTitle("");

    return (
        <main className="mainCommon page-5">
            <StyledInputsBox>
                <StyledTextField
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={createTitle}
                    onChange={(event) => setCreateTitle(event.target.value)}
                    placeholder="título da anotação..."
                />
                <Box className="buttonsBox">
                    <StyledButton
                        className={"big-width"}
                        variant="contained" color="primary"
                        onClick={() => {
                            if (createTitle.trim()) {
                                const annotationsArray = userData.annotationsArray || [];
                                saveAnnotations([
                                    ...annotationsArray,
                                    {
                                        id: uuidv4(),
                                        title: createTitle,
                                        content: ''
                                    }
                                ]);
                                clearInput();
                            }
                        }}
                        endIcon={<AddCircle/>}
                    >
                        Criar Anotação
                    </StyledButton>
                </Box>
                <StyledTextField
                    type="text"
                    variant="outlined"
                    placeholder="pesquisar anotações..."
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
            <section className={"container-annotations"}>
                <CreateAnnotations
                    array={filteredAnnotations}
                    handleContentChange={handleContentChange}
                    handleDelete={handleDelete}
                />
            </section>
        </main>
    );
}