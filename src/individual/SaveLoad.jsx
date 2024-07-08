import LZString from "lz-string";

export const saveItem = (key, value) => {
    // Converte o valor para string antes da compressão
    const valueAsString = value.toString();
    const compressed = LZString.compressToUTF16(valueAsString);
    localStorage.setItem(key, compressed);
};

export const deleteItem = (key) => {
    localStorage.removeItem(key);
};

export const getItem = (key, defaultValue) => {
    const compressed = localStorage.getItem(key);
    if (compressed) {
        return decompressValue(compressed);
    }
    return defaultValue;
};

export const handleChange = (setter) => (event) => {
    const value = event.target.value;
    if (event.target.type === 'number') {
        setter(value === '' ? '' : parseFloat(value));
    } else {
        setter(value);
    }
};

function decompressValue(compressed) {
    const decompressed = LZString.decompressFromUTF16(compressed);
    if (decompressed === true) return true;
    if (decompressed === false) return false;
    return isNaN(parseFloat(decompressed)) ? decompressed : Number(decompressed);
}