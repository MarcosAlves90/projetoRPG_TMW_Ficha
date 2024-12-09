import {useState, useEffect, useContext} from "react";
import {getUserData, saveUserSheets, saveUserData} from "../firebaseUtils.js";
import { auth } from "../firebase.js";
import {v4 as uuidv4} from 'uuid';
import {UserContext} from "../UserContext.jsx";
import {useNavigate} from "react-router-dom";
import { decompressData } from '../assets/systems/SaveLoad.jsx';

export default function SheetSelectionPage() {
    const [sheets, setSheets] = useState([]);
    const [newSheetName, setNewSheetName] = useState("");
    const [loading, setLoading] = useState(true);

    const { userData, setUserData } = useContext(UserContext);

    const navigate = useNavigate();

    function goToSettings() {
        navigate("/configuracoes");
    }

    useEffect(() => {
        const fetchSheets = async () => {
            if (auth.currentUser) {
                let sheetsData = await getUserData('sheets') || [];
                console.log(sheetsData.length > 0 ? 'Fichas encontradas. Carregando...' : 'Nenhuma ficha encontrada.');
    
                if (sheetsData.length > 0) {
                    sheetsData = sheetsData.map(sheet => {
                        if (sheet.sheetCode === userData.sheetCode) {
                            sheet.sheetCode = uuidv4();
                        }
                        if (sheet.nome === userData.nome) {
                            sheet.nome += " [Erro]";
                        }
                        return sheet;
                    });
                    setSheets(sheetsData);
                    saveUserSheets(sheetsData);
                }
            }
            setLoading(false);
        };
        fetchSheets();
    }, [userData]);

    function addSheet() {
        if (!newSheetName.trim() || sheets.some(sheet => sheet.nome === newSheetName)) {
            console.error("O nome da ficha está vazio ou é igual ao nome de outra ficha.");
            return;
        }
        const newSheet = { sheetCode: uuidv4(), nome: newSheetName };
        const updatedSheets = [...sheets, newSheet];
        try {
            saveUserSheets(updatedSheets);
            setSheets(updatedSheets);
        } catch (err) {
            console.error("Falha ao salvar fichas:", err);
        }
        setNewSheetName("");
    }

    function deleteSheet(sheetCode) {
        if (window.confirm("Quer mesmo deletar essa ficha? Esse processo é irreversível.")) {
            const updatedSheets = sheets.filter(sheet => sheet.sheetCode !== sheetCode);
            try {
                saveUserSheets(updatedSheets);
                setSheets(updatedSheets);
            } catch (err) {
                console.error("Falha ao salvar fichas:", err);
            }
        }
    }

    function switchSheet(sheetCode) {
        let selectedSheet = sheets.find(sheet => sheet.sheetCode === sheetCode);
        if (selectedSheet) {
            let updatedSheets = sheets.filter(sheet => sheet.sheetCode !== sheetCode);
            updatedSheets = [...updatedSheets, userData];
            saveUserSheets(updatedSheets);
            selectedSheet = decompressData(selectedSheet);
            saveUserData(selectedSheet);
            setUserData(selectedSheet);
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
                            <button className={"button-header active light back"} onClick={goToSettings}>Voltar&nbsp; 
                                <i className="bi bi-arrow-up-circle"></i>
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
                                    className={`sheet display-flex-center`} key={sheet.sheetCode}>
                                    <p className={"p-name"} onClick={() => switchSheet(sheet.sheetCode)}>{sheet.nome || sheet.sheetCode}</p>
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