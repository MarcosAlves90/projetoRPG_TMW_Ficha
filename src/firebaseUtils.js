import { doc, getDoc, setDoc } from "firebase/firestore";
import {auth, db} from './firebase';

export const getUserData = async (type) => {
    const userId = auth.currentUser.uid;
    try {
        const userDoc = doc(db, 'userData', userId);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
            console.log('Dados recuperados!');

            if (type === 'data') return docSnap.data().data;
            if (type === 'sheets') return docSnap.data().sheets;

        } else {
            console.log('Nenhum dado encontrado!');
            return null;
        }
    } catch (error) {
        console.error('Erro ao recuperar dados:', error);
    }
    return null;
};

export const saveUserData = async (data) => {
    const userId = auth.currentUser.uid;
    try {
        const userDoc = doc(db, 'userData', userId);
        await setDoc(userDoc, { data }, { merge: true });
        console.log('Dados salvos com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
    }
};

export const saveUserSheets = async (sheets) => {
    const userId = auth.currentUser.uid;
    try {
        const userDoc = doc(db, 'userData', userId);
        await setDoc(userDoc, { sheets }, { merge: true });
        console.log('Fichas salvas com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar fichas:', error);
    }
}

export const deleteUserData = async () => {
    const userId = auth.currentUser.uid;
    try {
        const userDoc = doc(db, 'userData', userId);
        await setDoc(userDoc, { data: ''}, { merge: true });
        console.log('Dados deletados com sucesso!');
    } catch (error) {
        console.error('Erro ao deletar dados:', error);
    }
}