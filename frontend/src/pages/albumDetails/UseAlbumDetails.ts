import { useEffect, useState } from 'react';
import { API } from '../../utils/api';
import { useSessionManager } from "../../utils/sessionManager";
import { Album } from "../../types/album";
import {useNavigate, useParams} from "react-router-dom";
import {Review} from "../../types/review";

export const useAlbumDetails = () => {
    const [album, setAlbum] = useState<Album | undefined>(undefined);
    const [reviews, setReviews] = useState<Review[] | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const sessionManager = useSessionManager();
    const { albumId } = useParams<{ albumId: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        if(!sessionManager.currentUser){
            return;
        }

        if (albumId) {
            fetchData(albumId);
        }
    }, [albumId]);

    const fetchData = async (albumId: string) => {
        try {
            setLoading(true);
            const responseAlbum = await API(sessionManager).albums().getByID(albumId);
            const responseReviews = await API(sessionManager).albums().getReviews(albumId);
            setLoading(false);

            if (responseAlbum && responseAlbum.data) {
                setAlbum(responseAlbum.data);
            }

            if (responseReviews && responseReviews.data) {
                setReviews(responseReviews.data);
            }

        } catch (error) {
            console.error('Failed to fetch album details:', error);
            navigate('/');
        }
    };

    const toggleFavorite = async (albumId: string) => {
        try {
            await API(sessionManager).favorites().toggle(albumId);
        } catch (error) {
            console.error(error);
        }
    };

    const addReview = async (reviewDate: object) => {
        try {
            setLoading(true);
            await API(sessionManager).reviews().add(reviewDate);
            setLoading(false);
            alert("Review added and sent to administration!");
        } catch (error) {
            console.error(error);
        }
    }

    return { album, fetchData, toggleFavorite, addReview, reviews };
};
