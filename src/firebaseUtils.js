import { doc, getDoc, updateDoc } from "firebase/firestore";
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
    console.error('%s %O', message, error);
};

const executeWithHandling = async (fn, errorMessage) => {
    try {
        return await fn();
    } catch (error) {
        handleError(errorMessage, error);
        return null;
    }
};

export const getUserData = async (type) => {
    const userId = getAuthenticatedUserId();
    if (!userId) return null;

    if (type !== 'data' && type !== 'sheets') {
        console.warn('getUserData: Tipo inválido fornecido');
        return null;
    }

    return executeWithHandling(async () => {
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
    }, 'getUserData: Erro ao recuperar dados:');
};

export const saveUserData = async (data) => {
    const userId = getAuthenticatedUserId();
    if (!userId) return;

    executeWithHandling(async () => {
        const userDoc = doc(db, 'userData', userId);
        await updateDoc(userDoc, { data });
        console.log('Dados salvos com sucesso!');
    }, 'Erro ao salvar dados:');
};

export const saveUserSheets = async (sheets) => {
    const userId = getAuthenticatedUserId();
    if (!userId) return;

    executeWithHandling(async () => {
        const userDoc = doc(db, 'userData', userId);
        await updateDoc(userDoc, { sheets });
        console.log('Fichas salvas com sucesso!');
    }, 'Erro ao salvar fichas:');
};