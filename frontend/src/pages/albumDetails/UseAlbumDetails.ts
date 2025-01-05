import { useEffect, useState } from 'react';
import { API } from '../../utils/api';
import { useSessionManager } from "../../utils/sessionManager";
import { Album } from "../../types/album";
import {useNavigate, useParams} from "react-router-dom";

export const useAlbumDetails = () => {
    const [album, setAlbum] = useState<Album | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const sessionManager = useSessionManager();
    const { albumId } = useParams<{ albumId: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        if (albumId) {
            fetchData(albumId);
        }
    }, [albumId]);

    const fetchData = async (albumId: string) => {
        try {
            setLoading(true);
            const responseAlbum = await API(sessionManager).albums().getByID(albumId);
            setLoading(false);

            if (responseAlbum && responseAlbum.data) {
                setAlbum(responseAlbum.data);
            }
        } catch (error) {
            console.error('Failed to fetch album details:', error);
            navigate('/');
        }
    };

    return { album, fetchData };
};
