import { useCallback, useEffect, useMemo, useRef, useState, useContext } from "react";
import { saveUserData } from "../firebaseUtils.js";
import { v4 as uuidv4 } from "uuid";
import ReactModal from 'react-modal';
import { UserContext } from "../UserContext";

ReactModal.setAppElement('#root');

export default function Page6() {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [localItem, setLocalItem] = useState(null);
    const [showQuantityInput, setShowQuantityInput] = useState(false);
    const inputRef = useRef(null);

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

    const handleElementChange = useCallback((key, value) => {
        setUserData((prevUserData) => ({
            ...prevUserData,
            [key]: value,
        }));
    }, [setUserData]);

    useEffect(() => {
        if (modalIsOpen && inputRef.current) inputRef.current.focus();
    }, [modalIsOpen]);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setSelectedItem(null);
        setShowQuantityInput(false);
    }, []);

    const openModal = useCallback((item) => {
        setSelectedItem(item);
        setLocalItem(item);
        setIsOpen(true);
        setShowQuantityInput(/^\s*(consumível|consumíveis)\s*$/i.test(item.type));
    }, []);

    const saveItems = useCallback((newItems) => {
        handleElementChange('itemsArray', newItems);
    }, [handleElementChange]);

    const addItem = useCallback(() => {
        const itemsArray = userData.itemsArray || [];
        saveItems([...itemsArray, { title: '', content: '', type: '', image: '', quantity: '', id: uuidv4() }]);
    }, [userData.itemsArray, saveItems]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setLocalItem((prevItem) => {
            const updatedItem = { ...prevItem, [name]: value };
            if (name === "type") setShowQuantityInput(/^\s*(consumível|consumíveis)\s*$/i.test(value));
            return updatedItem;
        });

        setUserData((prevUserData) => {
            const updatedItems = prevUserData.itemsArray.map((item) => item.id === localItem.id ? { ...localItem, [name]: value } : item);
            return { ...prevUserData, itemsArray: updatedItems };
        });
    }, [localItem, setUserData]);

    const deleteItem = useCallback(() => {
        saveItems(userData.itemsArray.filter(item => item.id !== selectedItem.id));
        closeModal();
    }, [userData.itemsArray, selectedItem, saveItems, closeModal]);

    const copyItemCode = useCallback(async () => {
        if (selectedItem) {
            await navigator.clipboard.writeText(JSON.stringify(selectedItem));
            console.log('Código do item copiado para a área de transferência!');
        }
    }, [selectedItem]);

    const pasteItemCode = useCallback(async (e) => {
        e.preventDefault();
        try {
            const itemCode = (await navigator.clipboard.readText()).trim();
            const item = JSON.parse(itemCode);
            saveItems([...userData.itemsArray, { ...item, id: uuidv4() }]);
            console.log('Item colado com sucesso!');
        } catch (e) {
            console.log('Erro ao colar o código do item!', e);
        }
    }, [userData.itemsArray, saveItems]);

    useEffect(() => {
        const handlePaste = async (event) => {
            if (event.clipboardData) {
                const text = event.clipboardData.getData('text');
                try {
                    const item = JSON.parse(text);
                    if (item && item.id) {
                        const newItem = { ...item, id: uuidv4() };
                        setUserData((prevUserData) => {
                            const updatedItems = [...prevUserData.itemsArray, newItem];
                            saveItems(updatedItems);
                            return { ...prevUserData, itemsArray: updatedItems };
                        });
                        event.preventDefault();
                    }
                } catch (err) {
                    console.error("Invalid JSON data: ", err);
                }
            }
        };

        const element = document.querySelector('.mainCommon.page-6');
        element.addEventListener('paste', handlePaste);
        return () => {
            element.removeEventListener('paste', handlePaste);
        };
    }, [setUserData, saveItems]);

    const placeHolderImage = "https://pbs.twimg.com/profile_images/1488183450406461452/tH7EIigT_400x400.png";

    const memoizedItems = useMemo(() => (userData.itemsArray || []).map((item) => (
        <div key={item.id} className="item inventory" onClick={() => openModal(item)}>
            <img className={`image ${!item.image ? "image-placeholder" : ""}`} src={item.image || placeHolderImage} alt="Item image" />
            <p className="title">{item.title.toUpperCase()}</p>
            {/^\s*(consumível|consumíveis)\s*$/i.test(item.type) && <p className="title qty">{(item.quantity || '').toUpperCase()}</p>}
        </div>
    )), [userData.itemsArray, openModal]);

    return (
        <>
            <ReactModal isOpen={modalIsOpen} onRequestClose={closeModal} className="popup" overlayClassName="popupOverlay" bodyOpenClassName="no-scroll">
                {localItem && (
                    <>
                        <i className="bi bi-x-lg closeButton" onClick={closeModal}></i>
                        <div className="leftBox">
                            <img className={`image ${!localItem.image ? "image-placeholder" : ""}`} src={localItem.image || placeHolderImage} alt="Item image" />
                        </div>
                        <div className="rightBox">
                            <input ref={inputRef} value={localItem.title} name="title" className="input title" onChange={handleInputChange} placeholder="Título do seu item." />
                            <textarea className="popup-content textarea" value={localItem.content} name="content" onChange={handleInputChange} placeholder="Descrição do seu item." />
                            <div className="inputsSequence display-flex-center w-100">
                                <input value={localItem.type} name="type" className="popup-type input" onChange={handleInputChange} placeholder="Categorias do item, divididas por vírgula." />
                                {showQuantityInput && <input value={localItem.quantity || ''} name="quantity" className="popup-quantity input" onChange={handleInputChange} placeholder="Qtde." />}
                            </div>
                            <input value={localItem.image} name="image" className="popup-image input" onChange={handleInputChange} placeholder="Link para a imagem do item." />
                            <div className="boxButtons display-flex-center w-100">
                                <button className="button delete" onClick={deleteItem}>Deletar <i className="bi bi-trash3"></i></button>
                                <button className="button copy" onClick={copyItemCode}>Copiar <i className="bi bi-clipboard"></i></button>
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