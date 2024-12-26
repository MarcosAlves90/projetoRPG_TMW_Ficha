import {saveUserData} from "../firebaseUtils.js";
import {useState, useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {auth} from "../firebase.js";
import {UserContext} from "../UserContext";
import {v4 as uuidv4} from 'uuid';
import {decompressData} from '../assets/systems/SaveLoad.jsx';
import styled from 'styled-components';
import {Button} from '@mui/material';

const StyledButton = styled(Button)`
    width: 100%;
    padding: 0.4rem;
    border-radius: 3px;
    font-weight: bold;
    font-size: 1rem;
    color: var(--background);
    font-family: var(--common-font-family), sans-serif !important;
    
    &.full {
        grid-column: span 2;
    }

    &.confirmation, &.delete.confirmation {
        background-color: var(--warn);

        &:hover {
            background-color: var(--warn-hover);
        }
    }

    &.delete {
        background-color: var(--danger);

        &:hover {
            background-color: var(--danger-hover);
        }
    }

    @media (max-width: 991px) {
        font-size: 4vw;
        &.save, &.delete {
            grid-column: span 2;
        }
    }
`;



export default function Config() {
    const [unlockedStates, setUnlockedStates] = useState({Delete: false, CloudSave: false});
    const {userData, setUserData, user} = useContext(UserContext);

    const navigate = useNavigate();

    useEffect(() => {
        const handleFileLoad = (event) => {
            const {files} = event.target;
            if (!files.length) return;
            const sheetCode = userData.sheetCode || uuidv4();

            const reader = new FileReader();
            reader.onload = ({target}) => {
                try {
                    let data = JSON.parse(target.result);
                    if (!data) throw new Error('Missing data');
                    data = decompressData(data);
                    if (!data.sheetCode || user !== null) {
                        data.sheetCode = sheetCode
                    }
                    setUserData(data);
                    if (user) {
                        saveUserData(data);
                    }
                } catch (error) {
                    console.error('Error processing the file:', error);
                }
            };
            reader.onerror = (error) => console.error('Error reading the file:', error);
            reader.readAsText(files[0]);
        };

        const inputElement = document.getElementById('formFile');
        inputElement.addEventListener('change', handleFileLoad);

        return () => {
            inputElement.removeEventListener('change', handleFileLoad);
        };
    }, []);

    function verifyDeleteUnlock() {
        if (!unlockedStates.Delete) {
            setUnlockedStates({...unlockedStates, Delete: true});
        } else {
            const sheetCode = userData.sheetCode || uuidv4();
            setUserData({nivel: 0, sheetCode: sheetCode});
            saveUserData({nivel: 0, sheetCode: sheetCode});
            setUnlockedStates({...unlockedStates, Delete: false});
        }
    }

    function verifyCloudSaveUnlock() {
        if (!unlockedStates.CloudSave) {
            setUnlockedStates({...unlockedStates, CloudSave: true});
        } else {
            saveUserData(userData);
            setUnlockedStates({...unlockedStates, CloudSave: false});
        }
    }

    function handleSheetsButtonClick() {
        navigate("/fichas");
    }

    const createBlobURL = (data) => {
        const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
        return URL.createObjectURL(blob);
    };

    const downloadFile = (url, filename) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        try {
            link.click();
        } finally {
            document.body.removeChild(link);
        }
    };

    const saveSheetFile = () => {
        const data = userData;
        const url = createBlobURL(data);
        const filename = `TMW - ${userData.nome || 'Ficha'}.json`;
        downloadFile(url, filename);
    };

    return (
        <main className={"mainCommon page-config"}>
            <section className={"section-files"}>
                <p>Configurações</p>
                <p className={"sheet"}>{`Ficha atual: ${userData.nome || "Indefinido"}`}</p>
                <p className={"sheet"}>{`Código: ${userData.sheetCode || "Indefinido"}`}</p>
                <input className="form-control dark" type="file" id="formFile"
                       style={{display: 'none'}}/>
                <StyledButton variant="contained" color="primary"
                        onClick={() => document.getElementById('formFile').click()}>
                    <label htmlFor="formFile" style={{width: "100%", cursor: "pointer"}} className="file-selector">
                        {"Importar"}
                        <i className="bi bi-arrow-down-circle"/>
                    </label>
                </StyledButton>
                <StyledButton variant="contained" color="primary" onClick={saveSheetFile}>
                    {"Baixar"}
                    <i className="bi bi-arrow-up-circle"/>
                </StyledButton>
                <StyledButton variant="contained" color="primary"
                    className={`save ${!unlockedStates.CloudSave ? "" : "confirmation"}`}
                    onClick={() => verifyCloudSaveUnlock()}>
                    {!unlockedStates.CloudSave ? "Salvar na nuvem" : "Tem certeza?"}
                    <i className="bi bi-cloud-arrow-down-fill"/>
                </StyledButton>
                <StyledButton variant="contained"
                    className={`delete ${!unlockedStates.Delete ? "" : "confirmation"}`}
                    onClick={() => verifyDeleteUnlock()}>
                    {!unlockedStates.Delete ? "Limpar" : "Tem certeza?"}
                    <i className="bi bi-trash3-fill"/>
                </StyledButton>
                {auth.currentUser && (
                    <StyledButton variant="contained"
                                  className={"full"}
                            onClick={() => handleSheetsButtonClick()}>
                        {"Trocar ficha"}
                        <i className="bi bi-file-spreadsheet-fill"></i>
                    </StyledButton>
                )}
            </section>
        </main>
    );
}