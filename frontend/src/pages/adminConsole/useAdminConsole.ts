import { useEffect, useState } from 'react';
import { API } from '../../utils/api';
import {useSessionManager} from "../../utils/sessionManager";
import {Album} from "../../types/album";
import {AxiosResponse} from "axios";
import {User} from "../../types";
import {Review} from "../../types/review";

export const useAdminConsole = () => {
    const [albums, setAlbums] = useState<Album[] | undefined>(undefined);
    const [users, setUsers] = useState<User[] | undefined>(undefined);
    const [reviews, setReviews] = useState<Review[] | undefined>(undefined);
    const sessionManager = useSessionManager();

    useEffect(() => {
        if(!sessionManager.currentUser){
            return;
        }

        fetchData();
    }, [sessionManager.currentUser]);

    function isAxiosResponse(response: any): response is AxiosResponse {
        return response && response.data !== undefined;
    }

    const fetchData = async () => {
        try {
            const responseReviews = await API(sessionManager).reviews().getPending()
            const responseAlbums = await API(sessionManager).albums().getPending();
            const responseUsers = await API(sessionManager).users().getAll();

            if (!isAxiosResponse(responseAlbums) || !isAxiosResponse(responseUsers) || !isAxiosResponse(responseReviews)) {
                console.error('Unexpected response format');
                return;
            }

            setAlbums(responseAlbums.data);
            setUsers(responseUsers.data);
            setReviews(responseReviews.data);
        } catch (error) {
            console.trace(error);

            alert('Failed to fetch data.');
        }
    };

    const modifyAlbumStatus = async (albumId: string, action: string) => {
        try {
            await API(sessionManager).albums().modifyStatus(albumId, action);
            await fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const modifyReviewStatus = async (reviewId: string, action: string) => {
        try {
            await API(sessionManager).reviews().modifyStatus(reviewId, action);
            await fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const modifyUserRole = async (userId: string, action: string) => {
        try {
            await API(sessionManager).users().modifyRole(userId, action);
            await fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    return {  albums, fetchData, modifyAlbumStatus, users, modifyUserRole, reviews, modifyReviewStatus };
};