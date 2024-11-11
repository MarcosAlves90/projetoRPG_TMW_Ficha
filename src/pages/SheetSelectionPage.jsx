import {useState, useEffect, useContext} from "react";
import {deleteUserData, getUserData, saveUserData, saveUserSheets} from "../firebaseUtils.js";
import { auth } from "../firebase.js";
import {
    compressValue,
    decompressValue,
    importDatabaseData,
    returnLocalStorageData
} from "../assets/systems/SaveLoad.jsx";
import {v4 as uuidv4} from 'uuid';
import {UserContext} from "../UserContext.jsx";
import {useNavigate} from "react-router-dom";

async function getUserSheets() {
    return await getUserData("sheets") || [];
}

export default function SheetSelectionPage() {
    const [sheets, setSheets] = useState([]);
    const [newSheetName, setNewSheetName] = useState("");
    const [loading, setLoading] = useState(true);

    const { sheetCode, setSheetCode } = useContext(UserContext);

    const navigate = useNavigate();

    function goToSettings() {
        navigate("/configuracoes");
    }

    useEffect(() => {
        if (localStorage.getItem('sheetCode') === null) {
            const key = uuidv4();
            setSheetCode(key);
            localStorage.setItem('sheetCode', key);
        }
    }, []);

    useEffect(() => {
        const fetchSheets = async () => {
            if (auth.currentUser) {
                const sheetsData = await getUserSheets();
                console.log(sheetsData.length > 0 ? 'Fichas encontradas. Carregando...' : 'Nenhuma ficha encontrada.');
                if (sheetsData.length > 0) {
                    setSheets(sheetsData);
                }
                updateSheets(sheetsData);
            }
            setLoading(false);
        };
        fetchSheets();
    }, [auth.currentUser]);

    function updateSheets(sheetsParam) {
        const key = sheetCode;
        const newSheet = returnLocalStorageData();
        let updatedSheets = sheetsParam.map(sheet =>
            sheet.sheetCode === key ? newSheet : sheet
        );

        if (!updatedSheets.some(sheet => sheet.sheetCode === key)) {
            updatedSheets.push(newSheet);
        }

        updatedSheets = updatedSheets.filter((sheet, index, self) =>
            index === self.findIndex((s) => s.sheetCode === sheet.sheetCode)
        );

        setSheets(updatedSheets);
        saveUserSheets(updatedSheets);
    }

    function addSheet() {
        const newSheet = { sheetCode: uuidv4(), nome: compressValue(newSheetName) };
        const updatedSheets = [...sheets, newSheet];
        setSheets(updatedSheets);
        saveUserSheets(updatedSheets);
        setNewSheetName("");
    }

    function deleteSheet(sheetCode) {
        const updatedSheets = sheets.filter(sheet => sheet.sheetCode !== sheetCode);
        setSheets(updatedSheets);
        saveUserSheets(updatedSheets);
    }

    function switchSheet(sheetCode) {
        const selectedSheet = sheets.find(sheet => sheet.sheetCode === sheetCode);
        if (selectedSheet) {
            importDatabaseData(selectedSheet);
            deleteUserData();
            saveUserData(selectedSheet);
            setSheetCode(selectedSheet.sheetCode);
            navigate("/individual");
        }
    }

    return (
        <main className={"mainCommon sheet-selection"}>
            <section className={"section-files"}>
                {loading ? (
                    <p>Carregando fichas...</p>
                ) : (
                    <>
                        <div className={"container-buttons display-flex-center"}>
                            <button className={"button-header active light back"} onClick={goToSettings}>Voltar&nbsp; <i
                                className="bi bi-arrow-up-circle"></i>
                            </button>
                            <input
                                type="text"
                                className={"input-name"}
                                value={newSheetName}
                                onChange={(e) => setNewSheetName(e.target.value)}
                                placeholder="Nome da nova ficha"
                            />
                            <button className={"button-header active light create"} onClick={addSheet}>Adicionar Ficha
                            </button>
                        </div>
                        <div className={"sheet-list"}>
                            {sheets.map(sheet => (
                                <div
                                    className={`sheet display-flex-center ${sheet.sheetCode === sheetCode ? "active" : ""}`} key={sheet.sheetCode}>
                                    <p className={"p-name"} onClick={() => switchSheet(sheet.sheetCode)}>{decompressValue(sheet.nome)}</p>
                                    <i className="bi bi-trash3" onClick={() => deleteSheet(sheet.sheetCode)}></i>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}