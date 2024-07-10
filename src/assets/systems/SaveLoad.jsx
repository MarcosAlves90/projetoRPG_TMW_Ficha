import LZString from "lz-string";

export const saveItem = (key, value) => {
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

// ----- Importar e Exportar -----

// Função para salvar o localStorage em um arquivo
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

// Função para carregar um arquivo e substituir o localStorage
export function loadLocalStorageFile(event) {
    const { files } = event.target;
    if (!files.length) return;

    const reader = new FileReader();
    reader.onload = ({ target }) => {
        try {
            localStorage.clear();
            const data = JSON.parse(target.result);
            Object.entries(data).forEach(([key, value]) => localStorage.setItem(key, value));
            console.log('Dados importados com sucesso!');
            location.reload();
        } catch (error) {
            console.error('Erro ao processar o arquivo:', error);
        }
    };
    reader.onerror = (error) => console.error('Erro ao ler o arquivo:', error);
    reader.readAsText(files[0]);
}