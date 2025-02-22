import { useEffect, useState } from 'react';
import { API } from '../../utils/api';
import {useSessionManager} from "../../utils/sessionManager";
import {Album} from "../../types/album";
import {AxiosResponse} from "axios";

export const useYourFavorites = () => {
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
        if (!sessionManager.currentUser) {
            return;
        }

        try {
            const responseAlbums = await API(sessionManager).albums().getFavorites();

            if (!isAxiosResponse(responseAlbums)) {
                console.error('Unexpected response format');
                return;
            }

            setAlbums(responseAlbums.data);
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

    return {  albums, fetchData, toggleFavorite };
};