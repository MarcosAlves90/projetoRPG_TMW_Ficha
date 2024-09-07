import { doc, getDoc, setDoc } from "firebase/firestore";
import {auth, db} from './firebase';

export const getUserData = async () => {
    const userId = auth.currentUser.uid;
    try {
        const userDoc = doc(db, 'userData', userId);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
            console.log('Dados recuperados!');
            return docSnap.data().data;
        } else {
            console.log('Nenhum dado encontrado!');
            return null;
        }
    } catch (error) {
        console.error('Erro ao recuperar dados:', error);
    }
};

export const saveUserData = async (data) => {
    const userId = auth.currentUser.uid;
    try {
        const userDoc = doc(db, 'userData', userId);
        await setDoc(userDoc, { data: data });
        console.log('Dados salvos com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
    }
};
