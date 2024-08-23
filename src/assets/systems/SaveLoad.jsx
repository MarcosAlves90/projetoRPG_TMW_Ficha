import LZString from "lz-string";

/**
 * Saves a given value under a specified key in localStorage after compressing it.
 * @param {string} key - The key under which the value is stored.
 * @param {*} value - The value to be stored. This value is converted to a string before compression.
 */
export const saveItem = (key, value) => {
    const valueAsString = value.toString();
    const compressed = LZString.compressToUTF16(valueAsString);
    localStorage.setItem(key, compressed);
};

/**
 * Removes a specified item from localStorage.
 * @param {string} key - The key of the item to be removed.
 */
export const deleteItem = (key) => {
    localStorage.removeItem(key);
};

/**
 * Decompresses a value from a compressed string.
 * @param {string} compressed - The compressed string to decompress.
 * @returns {*} The decompressed value, converted to the appropriate type.
 */
function decompressValue(compressed) {
    const decompressed = LZString.decompressFromUTF16(compressed);
    if (decompressed === true) return true;
    if (decompressed === false) return false;
    return isNaN(parseFloat(decompressed)) ? decompressed : Number(decompressed);
}

/**
 * Retrieves a value from localStorage by key, decompresses it, and returns it. Returns a default value if the key does not exist.
 * @param {string} key - The key of the item to retrieve.
 * @param {*} defaultValue - The default value to return if the key is not found.
 * @returns {*} The decompressed value if the key exists, otherwise the default value.
 */
export const getItem = (key, defaultValue) => {
    const compressed = localStorage.getItem(key);
    if (compressed) {
        return decompressValue(compressed);
    }
    return defaultValue;
};

/**
 * A utility function for handling change events from input elements, updating state accordingly.
 * @param {Function} setter - The state setter function to call with the new value.
 * @returns {Function} A function that takes an event, processes it, and calls the setter with the appropriate value.
 */
export const handleChange = (setter) => (event) => {
    const value = event.target.value;
    if (event.target.type === 'number') {
        setter(value === '' ? '' : parseFloat(value));
    } else {
        setter(value);
    }
};

/**
 * Saves the current state of localStorage to a file, allowing it to be downloaded.
 */
export function saveLocalStorageFile() {
    const dados = {};
    for (let i = 0; i < localStorage.length; i++) {
        const chave = localStorage.key(i);
        dados[chave] = localStorage.getItem(chave);
    }
    const blob = new Blob([JSON.stringify(dados)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TMW - ${getItem('nome', '') !== '' ? getItem('nome', '') : 'Ficha'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Loads a file selected by the user and replaces the current localStorage data with the contents of the file.
 * @param {Event} event - The event triggered by file selection.
 */
export function loadLocalStorageFile(event) {
    const { files } = event.target;
    if (!files.length) return;

    const reader = new FileReader();
    reader.onload = ({ target }) => {

        function checkFile(file) {
            if (!file) throw Error('Missing data')
        }

        try {
            const data = JSON.parse(target.result);
            checkFile(data);
            localStorage.clear();
            Object.entries(data).forEach(([key, value]) => localStorage.setItem(key, value));
            location.reload();
        } catch (error) {
            console.error('Error processing the file:', error);
        }
    };
    reader.onerror = (error) => console.error('Erro ao ler o arquivo:', error);
    reader.readAsText(files[0]);
}