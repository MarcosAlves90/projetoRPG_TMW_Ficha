import { useCallback, useEffect, useMemo, useRef, useState, useContext } from "react";
import { saveUserData } from "../firebaseUtils.js";
import { v4 as uuidv4 } from "uuid";
import ReactModal from 'react-modal';
import { UserContext } from "../UserContext";
import { StyledButton, StyledTextField } from "../assets/systems/CommonComponents.jsx";
import Box from "@mui/material/Box";
import styled from "styled-components";
import AddCircle from "@mui/icons-material/AddCircle";
import ContentPasteGo from "@mui/icons-material/ContentPasteGo";
import Search from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

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

ReactModal.setAppElement('#root');

export default function Page6() {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [localItem, setLocalItem] = useState(null);
    const [showQuantityInput, setShowQuantityInput] = useState(false);
    const inputRef = useRef(null);
    const [createItem, setCreateItem] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategories, setActiveCategories] = useState([]);

    const { userData, setUserData, user } = useContext(UserContext);
    const debounceTimeout = useRef(null);

    const [ducados, setDucados] = useState(userData.ducados || "000");
    const [criptogenes, setCriptogenes] = useState(userData.criptogenes || "000");

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
        let title = createItem;
        if (!title || title.trim() === "") title = "Novo item";
        const itemsArray = userData.itemsArray || [];
        saveItems([...itemsArray, { title: title, content: '', type: '', image: '', quantity: '', id: uuidv4() }]);
        setCreateItem("");
    }, [userData.itemsArray, saveItems, createItem]);

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

    const filteredItems = useMemo(() => {
        return (userData.itemsArray || []).filter(item => {
            const matchesSearchTerm = searchTerm === "" || Object.values(item).some(value => value.toString().toLowerCase().includes(searchTerm.toLowerCase()));
            const itemCategories = item.type.split(',').map(category => category.trim()).filter(category => category !== "");
            const matchesCategories = activeCategories.length === 0 || activeCategories.some(category => itemCategories.includes(category));
            return matchesSearchTerm && matchesCategories;
        });
    }, [userData.itemsArray, searchTerm, activeCategories]);

    const memoizedItems = useMemo(() => filteredItems.map((item) => (
        <div key={item.id} className="item inventory" onClick={() => openModal(item)}>
            <img className={`image ${!item.image ? "image-placeholder" : ""}`} src={item.image || placeHolderImage} alt="Item" />
            <p className="title">{item.title.toUpperCase()}</p>
            {/^\s*(consumível|consumíveis)\s*$/i.test(item.type) && <p className="title qty">{(item.quantity || '').toUpperCase()}</p>}
        </div>
    )), [filteredItems, openModal]);

    const uniqueCategories = useMemo(() => {
        const categories = (userData.itemsArray || [])
            .filter(item => item.type && item.type.trim() !== "")
            .flatMap(item => item.type.split(',')
                .map(category => category.trim())
                .filter(category => category !== "")
            );
        return Array.from(new Set(categories));
    }, [userData.itemsArray]);

    const searchByCategory = useCallback((category) => {
        const modifiedCategories = activeCategories.includes(category) ? activeCategories.filter(d => d !== category) : [...activeCategories, category];

        setActiveCategories(modifiedCategories);
    }, [activeCategories]);

    const handleCurrencyChange = (key, setter) => (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setter(value);
        handleElementChange(key, value);
    };

    const handleCurrencyBlur = (key, setter) => (e) => {
        const value = e.target.value || "000";
        setter(value);
        handleElementChange(key, value);
    }

    return (
        <>

            <ReactModal isOpen={modalIsOpen} onRequestClose={closeModal} className="popup" overlayClassName="popupOverlay" bodyOpenClassName="no-scroll">
                {localItem && (
                    <>
                        <i className="bi bi-x-lg closeButton" onClick={closeModal} />
                        <div className="leftBox">
                            <img className={`image ${!localItem.image ? "image-placeholder" : ""}`} src={localItem.image || placeHolderImage} alt="Item" />
                        </div>
                        <div className="rightBox">
                            <input ref={inputRef} value={localItem.title} name="title" className="input title" onChange={handleInputChange} placeholder="Título do seu item." />
                            <textarea className="popup-content textarea" value={localItem.content} name="content" onChange={handleInputChange} placeholder="Descrição do seu item." />
                            <div className="inputsSequence display-flex-center w-100">
                                <TextField variant="filled" fullWidth value={localItem.type} name="type" className="popupInput" onChange={handleInputChange} label="Categorias" placeholder="Categorias do item, divididas por vírgula." />
                                {showQuantityInput && <TextField variant="filled" fullWidth value={localItem.quantity || ''} name="quantity" className="popupInput" onChange={handleInputChange} label="Quantidade"/>}
                            </div>
                            <TextField variant="filled" fullWidth value={localItem.image} name="image" className="popupInput" onChange={handleInputChange} label="Link da imagem"/>
                            <div className="boxButtons display-flex-center w-100">
                                <button className="button delete" onClick={deleteItem}>Deletar <i className="bi bi-trash3" /></button>
                                <button className="button copy" onClick={copyItemCode}>Copiar <i className="bi bi-clipboard" /></button>
                            </div>
                        </div>
                    </>
                )}
            </ReactModal>
            <main className="mainCommon page-6">
                <StyledInputsBox>
                    <StyledTextField
                        type="text"
                        variant="outlined"
                        placeholder="nome do item..."
                        value={createItem}
                        onChange={(event) => setCreateItem(event.target.value)}
                        fullWidth
                    />
                    <Box className={"buttonsBox"}>
                        <StyledButton
                            variant="contained"
                            color="primary"
                            onClick={addItem}
                            endIcon={<AddCircle />}
                        >
                            Criar Item
                        </StyledButton>
                        <StyledButton
                            variant="contained"
                            color="primary"
                            onClick={pasteItemCode}
                            endIcon={<ContentPasteGo />}
                        >
                            Colar Item
                        </StyledButton>
                    </Box>
                    <StyledTextField
                        type="text"
                        variant="outlined"
                        placeholder="pesquisar itens..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        fullWidth
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </StyledInputsBox>
                <section className="tag-cloud display-flex-center">
                    <span className={"tag qty"}>
                        <i className="bi bi-backpack3-fill" />
                        {`${userData.itemsArray ? userData.itemsArray.length : 0
                            } Itens`}
                    </span>
                    <span className={"tag currency criptogenes"}>
                        <i className="bi bi-currency-euro" />
                        <input
                            type="text"
                            value={criptogenes}
                            onChange={handleCurrencyChange('criptogenes',setCriptogenes)}
                            onBlur={handleCurrencyBlur('criptogenes',setCriptogenes)}
                            maxLength={4}
                            className="value"
                        />
                        <i className="title">Criptogenes</i>
                    </span>
                    <span className={"tag currency ducados"}>
                        <i className="bi bi-currency-rupee" />
                        <input
                            type="text"
                            value={ducados}
                            onChange={handleCurrencyChange('ducados',setDucados)}
                            onBlur={handleCurrencyBlur('ducados',setDucados)}
                            maxLength={4}
                            className="value"
                        />
                        <i className="title">Rokhans</i>
                    </span>
                    {uniqueCategories.map((category) => {
                        const displayCategory = category.length > 40 ? `${category.slice(0, 30)}...` : category;
                        return (
                            <span
                                key={category}
                                className={`tag 
                                    ${activeCategories.includes(category) ? "active" : ""}`}
                                onClick={() => searchByCategory(category)}
                            >
                                <i className="bi bi-stars" />
                                {displayCategory}
                            </span>
                        );
                    })}
                </section>
                <article className="boxInventory">
                    {memoizedItems}
                </article>
            </main>
        </>
    );
}