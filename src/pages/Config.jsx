import {
    clearLocalStorage, getItem,
    loadLocalStorageFile,
    returnLocalStorageData,
    saveLocalStorageFile
} from "../assets/systems/SaveLoad.jsx";
import {saveUserData} from "../firebaseUtils.js";
import {useState} from "react";

export default function Config() {

    const [unlockedStates, setUnlockedStates] = useState({Delete: false, CloudSave: false});

    function verifyDeleteUnlock() {
        if (!unlockedStates.Delete) {
            setUnlockedStates({...unlockedStates, Delete: true});
        } else {
            clearLocalStorage();
        }
    }

    function verifyCloudSaveUnlock() {
        if (!unlockedStates.CloudSave) {
            setUnlockedStates({...unlockedStates, CloudSave: true});
        } else {
            saveUserData(returnLocalStorageData());
            setUnlockedStates({...unlockedStates, CloudSave: false});
        }
    }

    return (
        <main className={"mainCommon page-config"}>
            <section className={"section-files"}>
                <p>Configurações</p>
                <p className={"sheet"}>{`Ficha atual: ${getItem("nome", "Indefinido")}`}</p>
                <input className="form-control dark" type="file" id="formFile"
                       onChange={loadLocalStorageFile} style={{display: 'none'}}/>
                <button className="button-header active file"
                        onClick={() => document.getElementById('formFile').click()}>
                    <label htmlFor="formFile" style={{width: "100%"}} className="file-selector">
                        {"Importar "}
                        <i className="bi bi-arrow-down-circle"/>
                    </label>
                </button>
                <button className="button-header active save" onClick={saveLocalStorageFile}>
                    {"Baixar "}
                    <i className="bi bi-arrow-up-circle"/>
                </button>
                <button className={`button-header active cloud-save ${!unlockedStates.CloudSave ? "" : "confirmation"}`}
                        onClick={() => verifyCloudSaveUnlock()}>
                    {!unlockedStates.CloudSave ? "Salvar na nuvem " : "Tem certeza? "}
                    <i className="bi bi-cloud-arrow-down-fill"/>
                </button>
                <button className={`button-header active clear ${!unlockedStates.Delete ? "" : "confirmation"}`}
                        onClick={() => verifyDeleteUnlock()}>
                    {!unlockedStates.Delete ? "Limpar " : "Tem certeza? "}
                    <i className="bi bi-trash3-fill"/>
                </button>
            </section>
        </main>
    );
}