import {useState} from "react";
import {saveUserData} from "../firebaseUtils.js";
import {returnLocalStorageData} from "../assets/systems/SaveLoad.jsx";
import {v4 as uuidv4} from "uuid";

export default function Page6() {

    const [itemsArray, setItemsArray] = useState([]);

    const saveItems = (newItems) => {
        setItemsArray(newItems);
        localStorage.setItem('itemsArray', JSON.stringify(newItems));
        saveUserData(returnLocalStorageData());
    };

    const addItem = () => {
        saveItems([...itemsArray, {
            title: '',
            content: '',
            type: '',
            image: '',
            id: uuidv4()
        }]);
    }

    function handleContentChange(e, id) {
        const updatedItems = itemsArray.map((item) => {
            if (item.id === id) {
                if (e.target.classList.contains('content-item')) {
                    return {...item, content: e.target.value};
                } else if (e.target.classList.contains('type-item')) {
                    return {...item, type: e.target.value};
                } else if (e.target.classList.contains('title-item')) {
                    return {...item, title: e.target.value};
                } else if (e.target.classList.contains('image-item')) {
                    return {...item, image: e.target.value};
                }
            }
            return item;
        });

        saveItems(updatedItems);
    }

    const handleDelete = (id) => {
        const updatedItems = itemsArray.filter((item) => item.id !== id);
        saveItems(updatedItems);
    };

    const createItems = (array, handleContentChange, handleDelete) => {
        return array.length > 0 && array.map((item) => (
            <div key={item.id} className={"item"}>
                <img src={item.img} alt={"Item image"}/>
            </div>
        ))
    }

    return (
        <main className={"mainCommon page-6"}>
            <article className={"boxInventory"}>
                <div className={"item add"} onClick={addItem}>
                    <i className="bi bi-patch-plus-fill"></i>
                </div>
            </article>
        </main>
    )
}