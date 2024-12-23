import { useEffect, useState } from 'react';
import { API } from '../../utils/api';
import {useSessionManager} from "../../utils/sessionManager";
import {Language} from "../../types/language";
import {Category} from "../../types/category";
import {Album} from "../../types/album";

export const useDashboard = () => {
    const [languages, setLanguages] = useState<Language[] | undefined>(undefined);
    const [categories, setCategories] = useState<Category[] | undefined>(undefined);
    const [albums, setAlbums] = useState<Album[] | undefined>(undefined);
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
            const responseAlbums = await API(sessionManager).albums().getPublished();
            setLoading(false);

            if( !responseLanguages || !responseCategories || !responseAlbums ) {
                return;
            }

            setLanguages(responseLanguages.data);
            setCategories(responseCategories.data);
            setAlbums(responseAlbums.data);
        } catch (error) {
            console.trace(error);
            setLoading(false);

            alert('Failed to fetch data.');
        }
    };


    return {  languages, categories, albums, loading };
};
