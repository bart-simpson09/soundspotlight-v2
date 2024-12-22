import { useEffect, useState } from 'react';
import { API } from '../../utils/api';
import {useSessionManager} from "../../utils/sessionManager";
import {Language} from "../../types/language";
import {Category} from "../../types/category";

export const useDashboard = () => {
    const [languages, setLanguages] = useState<Language[] | undefined>(undefined);
    const [categories, setCategories] = useState<Category[] | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const sessionManager = useSessionManager();

    useEffect(() => {
        fetchData();
    }, [sessionManager.currentUser]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const responseLanguages = await API(sessionManager).languages().get();
            const responseCategories = await API(sessionManager).categories().get();
            setLoading(false);

            if( !responseLanguages || !responseCategories ) {
                return;
            }

            setLanguages(responseLanguages.data);
            setCategories(responseCategories.data);
        } catch (error) {
            console.trace(error);
            setLoading(false);

            alert('Failed to fetch books.');
        }
    };


    return {  languages, categories, loading };
};
