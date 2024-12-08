import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from './firebase';

const getAuthenticatedUserId = () => {
    const user = auth.currentUser;
    if (!user) {
        console.warn('getUserData: Usuário não autenticado');
        return null;
    }
    return user.uid;
};

const handleError = (message, error) => {
    console.error(message, error);
};

export const getUserData = async (type) => {
    const userId = getAuthenticatedUserId();
    if (!userId) return null;

    try {
        const userDoc = doc(db, 'userData', userId);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
            console.info('getUserData: Dados recuperados!');

            if (type === 'data') return docSnap.data().data;
            if (type === 'sheets') return docSnap.data().sheets;

        } else {
            console.info('getUserData: Nenhum dado encontrado!');
            return null;
        }
    } catch (error) {
        handleError('getUserData: Erro ao recuperar dados:', error);
    }
    return null;
};

export const deleteUserData = async () => {
    const userId = getAuthenticatedUserId();
    if (!userId) return;

    try {
        const userDoc = doc(db, 'userData', userId);
        await deleteDoc(userDoc);
        console.info('deleteUserData: Dados deletados com sucesso!');
    } catch (error) {
        handleError('deleteUserData: Erro ao deletar dados:', error);
    }
};

export const saveUserData = async (data) => {
    const userId = getAuthenticatedUserId();
    if (!userId) return;

    try {
        const userDoc = doc(db, 'userData', userId);
        await setDoc(userDoc, { data }, { merge: true });
        console.log('Dados salvos com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
    }
};

export const saveUserSheets = async (sheets) => {
    const userId = getAuthenticatedUserId();
    if (!userId) return;

    try {
        const userDoc = doc(db, 'userData', userId);
        await setDoc(userDoc, { sheets }, { merge: true });
        console.log('Fichas salvas com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar fichas:', error);
    }
}