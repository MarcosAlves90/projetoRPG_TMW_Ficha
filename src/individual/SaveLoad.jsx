import LZString from "lz-string";

export const saveItem = (key, value) => {
    // Converte o valor para string antes da compressão
    const valueAsString = value.toString();
    const compressed = LZString.compressToUTF16(valueAsString);
    localStorage.setItem(key, compressed);
};

export const getItem = (key, defaultValue) => {
    const compressed = localStorage.getItem(key);
    if (compressed) {
        const decompressed = LZString.decompressFromUTF16(compressed);
        // Tenta converter o valor de volta para número, se falhar, retorna o valor padrão
        return isNaN(parseInt(decompressed)) ? decompressed : Number(decompressed);
    }
    return defaultValue;
};