import { useEffect, useState } from 'react';
import { API } from '../../utils/api';
import {useSessionManager} from "../../utils/sessionManager";
import {Album} from "../../types/album";
import {AxiosResponse} from "axios";

export const useTopAlbums = () => {
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
            const responseAlbums = await API(sessionManager).albums().getTop();

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