import {getItem} from "./SaveLoad.jsx";

export function sumOfAtributos(atributos) {
    if (!atributos) {
        // Handle the case where atributos is undefined
        console.error('sumOfAtributos was called with an undefined object.');
        return 0; // or appropriate error handling
    }

    // Assuming sumOfAtributos sums the values of the attributes
    let sum = 0;
    for (let key in atributos) {
        if (Object.prototype.hasOwnProperty.call(atributos, key)) {
            sum += atributos[key];
        }
    }
    return sum;
}

// In FichaPage3System.jsx
export const handleChangePericias = (setter, atr = null, atributos) => (event) => {
    const newValue = event.target.value;
    const currentValue = getItem(`atributo-${atr}`, 0);

    // Pass atributos to sumOfAtributos
    if (atr && sumOfAtributos(atributos) >= 10 && parseInt(newValue, 10) > parseInt(currentValue, 10)) {
        return;
    }

    if (event.target.type === 'number') {
        setter(newValue === '' ? '' : parseFloat(newValue));
    } else {
        setter(newValue);
    }
};