import LZString from "lz-string";
import { auth } from "../../firebase.js";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { saveUserData } from "../../firebaseUtils.js";

export const compressValue = LZString.compressToUTF16;
export const decompressValue = LZString.decompressFromUTF16;

const isNumber = (value) => /^[0-9]+(\.[0-9]+)?$/.test(value);

export const saveItem = (key, value) => {
    localStorage.setItem(key, compressValue(value.toString()));
};

export const deleteItem = (key) => {
    localStorage.removeItem(key);
};

export const getItem = (key, defaultValue) => {
    const compressed = localStorage.getItem(key);
    if (compressed) {
        const decompressed = decompressValue(compressed);
        return decompressed === null ? null : isNumber(decompressed) ? Number(decompressed) : decompressed;
    }
    return defaultValue;
};

export const handleChange = (setter) => (event) => {
    const { value, type } = event.target;
    setter(type === 'number' ? (value === '' ? '' : parseFloat(value)) : value);
};

const createBlobURL = (data) => {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    return URL.createObjectURL(blob);
};

const downloadFile = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const saveLocalStorageFile = () => {
    const data = Object.fromEntries([...Array(localStorage.length).keys()].map(i => [localStorage.key(i), localStorage.getItem(localStorage.key(i))]));
    const url = createBlobURL(data);
    const filename = `TMW - ${getItem('nome', '') || 'Ficha'}.json`;
    downloadFile(url, filename);
};

export const loadLocalStorageFile = (event) => {
    const { files } = event.target;
    if (!files.length) return;

    const reader = new FileReader();
    reader.onload = ({ target }) => {
        try {
            const data = JSON.parse(target.result);
            if (!data) throw new Error('Missing data');
            localStorage.clear();
            Object.entries(data).forEach(([key, value]) => localStorage.setItem(key, value));
        } catch (error) {
            console.error('Error processing the file:', error);
        }
    };
    reader.onerror = (error) => console.error('Error reading the file:', error);
    reader.readAsText(files[0]);
};

export const clearLocalStorage = () => {
    localStorage.clear();
};

export const returnLocalStorageData = () => {
    return Object.fromEntries([...Array(localStorage.length).keys()].map(i => [localStorage.key(i), localStorage.getItem(localStorage.key(i))]));
};

export const useSignOut = () => {
    const navigate = useNavigate();
    return useCallback(async () => {
        try {
            await saveUserData(returnLocalStorageData());
            await auth.signOut();
            clearLocalStorage();
            navigate('/login');
            console.log('Sign-out successful.');
        } catch (error) {
            console.error('Error during sign-out:', error);
        }
    }, [navigate]);
};

export const importDatabaseData = (data) => {
    localStorage.clear();
    Object.entries(data).forEach(([key, value]) => localStorage.setItem(key, value));
};