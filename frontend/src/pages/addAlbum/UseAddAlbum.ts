import { useEffect, useState } from 'react';
import {API} from '../../utils/api';
import {useSessionManager} from "../../utils/sessionManager";
import {Language} from "../../types/language";
import {Category} from "../../types/category";

export const useAddAlbum = () => {
    const [languages, setLanguages] = useState<Language[] | undefined>(undefined);
    const [categories, setCategories] = useState<Category[] | undefined>(undefined);
    const sessionManager = useSessionManager();

    useEffect(() => {
        if(!sessionManager.currentUser){
            return;
        }

        fetchData();
    }, [sessionManager.currentUser]);

    const fetchData = async () => {
        try {
            const responseLanguages = await API(sessionManager).languages().get();
            const responseCategories = await API(sessionManager).categories().get();

            if( !responseLanguages || !responseCategories ) {
                return;
            }

            setLanguages(responseLanguages.data);
            setCategories(responseCategories.data);
        } catch (error) {
            console.trace(error);

            alert('Failed to fetch data.');
        }
    };

    const addAlbum = async (formData: FormData) => {
        try {
            await API(sessionManager).albums().add(formData);
            alert("Album added and sent to review!");
        } catch (error) {
            console.error(error);
        }
    }

    return {  languages, categories, addAlbum };
};