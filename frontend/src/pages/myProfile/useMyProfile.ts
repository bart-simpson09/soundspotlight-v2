import { useEffect, useState } from 'react';
import { API } from '../../utils/api';
import {useSessionManager} from "../../utils/sessionManager";
import {Album} from "../../types/album";
import {AxiosResponse} from "axios";
import {Review} from "../../types/review";

export const useMyProfile = () => {
    const [albums, setAlbums] = useState<Album[] | undefined>(undefined);
    const [reviews, setReviews] = useState<Review[] | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
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
            setLoading(true);
            const responseReviews = await API(sessionManager).reviews().getPending()
            const responseAlbums = await API(sessionManager).albums().getUserAlbums();
            setLoading(false);

            if (!isAxiosResponse(responseAlbums) || !isAxiosResponse(responseReviews)) {
                console.error('Unexpected response format');
                return;
            }

            setAlbums(responseAlbums.data);
            setReviews(responseReviews.data);
        } catch (error) {
            console.trace(error);
            setLoading(false);

            alert('Failed to fetch data.');
        }
    };

    return {  albums, loading, fetchData, reviews, sessionManager };
};