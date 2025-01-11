import {useEffect, useState} from 'react';
import {API} from '../../utils/api';
import {useSessionManager} from "../../utils/sessionManager";
import {Language} from "../../types/language";
import {Category} from "../../types/category";
import {Album} from "../../types/album";
import {AxiosResponse} from "axios";

export const useDashboard = () => {
    const [languages, setLanguages] = useState<Language[] | undefined>(undefined);
    const [categories, setCategories] = useState<Category[] | undefined>(undefined);
    const [albums, setAlbums] = useState<Album[] | undefined>(undefined);
    const sessionManager = useSessionManager();

    useEffect(() => {
        if (!sessionManager.currentUser) {
            return;
        }
        fetchData();
    }, [sessionManager.currentUser]);

    function isAxiosResponse(response: any): response is AxiosResponse {
        return response && response.data !== undefined;
    }

    const fetchData = async () => {
        try {
            const responseLanguages = await API(sessionManager).languages().get();
            const responseCategories = await API(sessionManager).categories().get();
            const responseAlbums = await API(sessionManager).albums().getByParams();

            if (
                !isAxiosResponse(responseLanguages) ||
                !isAxiosResponse(responseCategories) ||
                !isAxiosResponse(responseAlbums)
            ) {
                console.error('Unexpected response format');
                return;
            }

            setLanguages(responseLanguages.data);
            setCategories(responseCategories.data);
            setAlbums(responseAlbums.data);
        } catch (error) {
            console.trace(error);

            alert('Failed to fetch data.');
        }
    };

    const searchAlbums = async (title?: string, author?: string, category?: string, language?: string) => {
        try {
            const searchedAlbums = await API(sessionManager).albums().getByParams({
                title,
                author,
                category,
                language
            });

            if (!isAxiosResponse(searchedAlbums)) {
                console.error('Unexpected response format');
                return;
            }

            if (searchedAlbums) {
                return searchedAlbums.data;
            }
        } catch (error) {
            console.trace(error);
            alert('Failed to fetch data.');
        }
    };

    const toggleFavorite = async (albumId: string) => {
        try {
            await API(sessionManager).favorites().toggle(albumId);
        } catch (error) {
            console.error(error);
        }
    };

    return {languages, categories, albums, searchAlbums, fetchData, toggleFavorite};
};