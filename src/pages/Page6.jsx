import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {saveUserData} from "../firebaseUtils.js";
import {returnLocalStorageData} from "../assets/systems/SaveLoad.jsx";
import {v4 as uuidv4} from "uuid";
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

export default function Page6() {
    const [itemsArray, setItemsArray] = useState(() => {
        const savedItems = localStorage.getItem('itemsArray');
        return savedItems ? JSON.parse(savedItems) : [];
    });
    const [modalIsOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (modalIsOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [modalIsOpen]);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setSelectedItem(null);
    }, []);

    const openModal = useCallback((item) => {
        setSelectedItem(item);
        setIsOpen(true);
    }, []);

    const saveItems = useCallback((newItems) => {
        setItemsArray(newItems);
        localStorage.setItem('itemsArray', JSON.stringify(newItems));
        saveUserData(returnLocalStorageData());
    }, []);

    const addItem = useCallback(() => {
        saveItems([...itemsArray, { title: '', content: '', type: '', image: '', id: uuidv4() }]);
    }, [itemsArray, saveItems]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setSelectedItem((prevItem) => {
            const updatedItem = { ...prevItem, [name]: value };
            const updatedItems = itemsArray.map((item) =>
                item.id === updatedItem.id ? updatedItem : item
            );
            saveItems(updatedItems);
            return updatedItem;
        });
    }, [itemsArray, saveItems]);

    const deleteItem = useCallback(() => {
        const updatedItems = itemsArray.filter(item => item.id !== selectedItem.id);
        saveItems(updatedItems);
        closeModal();
    }, [itemsArray, selectedItem, saveItems, closeModal]);

    const copyItemCode = useCallback(async () => {
        if (selectedItem) {
            const itemCode = JSON.stringify(selectedItem);
            await navigator.clipboard.writeText(itemCode);
            console.log('Código do item copiado para a área de transferência!');
        }
    }, [selectedItem]);

    const pasteItemCode = async () => {
        try {
            const itemCode = (await navigator.clipboard.readText()).trim();
            console.log('Código do item da área de transferência:', itemCode);
            const item = JSON.parse(itemCode);
            const newItem = { ...item, id: uuidv4() };
            saveItems([...itemsArray, newItem]);
            console.log('Item colado com sucesso!');
        } catch (e) {
            console.log('Erro ao colar o código do item!', e);
        }
    };

    const placeHolderImage = "https://pbs.twimg.com/profile_images/1488183450406461452/tH7EIigT_400x400.png";

    const memoizedItems = useMemo(() => itemsArray.map((item) => (
        <div key={item.id} className="item inventory" onClick={() => openModal(item)}>
            <img className={`image ${!item.image ? "image-placeholder" : ""}`}
                 src={item.image || placeHolderImage}
                 alt="Item image"/>
            <p className={"title"}>{item.title.toUpperCase()}</p>
        </div>
    )), [itemsArray, openModal]);

    return (
        <>
            <ReactModal isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        className="popup"
                        overlayClassName="popupOverlay"
                        bodyOpenClassName="no-scroll">
                {selectedItem && (
                    <>
                        <i className="bi bi-x-lg closeButton" onClick={closeModal}></i>
                        <div className={"leftBox"}>
                            <img className={`image ${!selectedItem.image ? "image-placeholder" : ""}`}
                                 src={selectedItem.image || placeHolderImage} alt="Item image"/>
                        </div>
                        <div className={"rightBox"}>
                            <input ref={inputRef} value={selectedItem.title} name="title" className="input title"
                                   onChange={handleInputChange} placeholder="Título do seu item."/>
                            <textarea
                                className="popup-content textarea"
                                value={selectedItem.content}
                                name="content"
                                onChange={handleInputChange}
                                placeholder="Descrição do seu item."
                            />
                            <input value={selectedItem.type} name="type" className="popup-type input"
                                   onChange={handleInputChange} placeholder={"Categorias do item, divididas por vírgula."}/>
                            <input value={selectedItem.image} name="image" className="popup-image input"
                                   onChange={handleInputChange} placeholder={"Link para a imagem do item."}/>
                            <div className={"boxButtons display-flex-center w-100"}>
                                <button className={"button delete"} onClick={deleteItem}>Deletar <i
                                    className="bi bi-trash3"></i></button>
                                <button className={"button copy"} onClick={copyItemCode}>Copiar <i
                                    className="bi bi-clipboard"></i></button>
                            </div>
                        </div>
                    </>
                )}
            </ReactModal>
            <main className="mainCommon page-6">
                <article className="boxInventory">
                    <div className="item regular" onClick={addItem}>
                        <i className="bi add bi-patch-plus-fill"></i>
                    </div>
                    <div className="item regular" onClick={pasteItemCode}>
                        <i className="bi bi-clipboard2-fill"></i>
                    </div>
                    {memoizedItems}
                </article>
            </main>
        </>
    );
}