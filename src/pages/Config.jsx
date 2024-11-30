import {
    clearLocalStorage, getItem,
    loadLocalStorageFile,
    returnLocalStorageData,
    saveLocalStorageFile
} from "../assets/systems/SaveLoad.jsx";
import { saveUserData } from "../firebaseUtils.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase.js";

export default function Config() {
    const [unlockedStates, setUnlockedStates] = useState({ Delete: false, CloudSave: false });
    const [sheetName, setSheetName] = useState(getItem("nome", "Indefinido"));

    const navigate = useNavigate();

    useEffect(() => {
        const handleFileLoad = (event) => {
            const { files } = event.target;
            if (!files.length) return;

            const reader = new FileReader();
            reader.onload = ({ target }) => {
                try {
                    const data = JSON.parse(target.result);
                    if (!data) throw new Error('Missing data');
                    localStorage.clear();
                    Object.entries(data).forEach(([key, value]) => localStorage.setItem(key, value));
                    setSheetName(getItem("nome", "Indefinido"));
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
            setUnlockedStates({ ...unlockedStates, Delete: true });
        } else {
            console.log("Limpando dados...");
            clearLocalStorage();
            setUnlockedStates({ ...unlockedStates, Delete: false });
            setSheetName("Indefinido");
            console.log("Dados limpos.");
        }
    }

    function verifyCloudSaveUnlock() {
        if (!unlockedStates.CloudSave) {
            setUnlockedStates({ ...unlockedStates, CloudSave: true });
        } else {
            saveUserData(returnLocalStorageData());
            setUnlockedStates({ ...unlockedStates, CloudSave: false });
        }
    }

    function handleSheetsButtonClick() {
        navigate("/fichas");
    }

    return (
        <main className={"mainCommon page-config"}>
            <section className={"section-files"}>
                <p>Configurações</p>
                <p className={"sheet"}>{`Ficha atual: ${sheetName}`}</p>
                <input className="form-control dark" type="file" id="formFile"
                       style={{ display: 'none' }} />
                <button className="button-header active light file"
                        onClick={() => document.getElementById('formFile').click()}>
                    <label htmlFor="formFile" style={{ width: "100%" }} className="file-selector">
                        {"Importar "}
                        <i className="bi bi-arrow-down-circle" />
                    </label>
                </button>
                <button className="button-header active light save" onClick={saveLocalStorageFile}>
                    {"Baixar "}
                    <i className="bi bi-arrow-up-circle" />
                </button>
                <button className={`button-header active dark cloud-save ${!unlockedStates.CloudSave ? "" : "confirmation"}`}
                        onClick={() => verifyCloudSaveUnlock()}>
                    {!unlockedStates.CloudSave ? "Salvar na nuvem " : "Tem certeza? "}
                    <i className="bi bi-cloud-arrow-down-fill" />
                </button>
                <button className={`button-header active dark clear-delete ${!unlockedStates.Delete ? "" : "confirmation"}`}
                        onClick={() => verifyDeleteUnlock()}>
                    {!unlockedStates.Delete ? "Limpar " : "Tem certeza? "}
                    <i className="bi bi-trash3-fill" />
                </button>
                {auth.currentUser && (
                    <button className={`button-header active light sheets`}
                            onClick={() => handleSheetsButtonClick()}>
                        {"Trocar ficha "}
                        <i className="bi bi-file-spreadsheet-fill"></i>
                    </button>
                )}
            </section>
        </main>
    );
}