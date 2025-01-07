import { useEffect, useState } from 'react';
import { API } from '../../utils/api';
import {useSessionManager} from "../../utils/sessionManager";
import {Album} from "../../types/album";
import {AxiosResponse} from "axios";
import {User} from "../../types";

export const useAdminConsole = () => {
    const [albums, setAlbums] = useState<Album[] | undefined>(undefined);
    const [users, setUsers] = useState<User[] | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const sessionManager = useSessionManager();

    useEffect(() => {
        fetchData();
    }, [sessionManager.currentUser]);

    function isAxiosResponse(response: any): response is AxiosResponse {
        return response && response.data !== undefined;
    }

    const fetchData = async () => {
        try {
            setLoading(true);
            const responseAlbums = await API(sessionManager).albums().getPending();
            const responseUsers = await API(sessionManager).users().getAll();
            setLoading(false);

            if (!isAxiosResponse(responseAlbums) || !isAxiosResponse(responseUsers)) {
                console.error('Unexpected response format');
                return;
            }

            setAlbums(responseAlbums.data);
            setUsers(responseUsers.data);
        } catch (error) {
            console.trace(error);
            setLoading(false);

            alert('Failed to fetch data.');
        }
    };

    const modifyAlbumStatus = async (albumId: string, action: string) => {
        try {
            await API(sessionManager).albums().modifyStatus(albumId, action);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const modifyUserRole = async (userId: string, action: string) => {
        try {
            await API(sessionManager).users().modifyRole(userId, action);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    return {  albums, loading, fetchData, modifyAlbumStatus, users, modifyUserRole };
};