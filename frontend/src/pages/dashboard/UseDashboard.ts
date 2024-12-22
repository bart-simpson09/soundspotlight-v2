import { useEffect, useState } from 'react';
import { API } from '../../utils/api';
import {useSessionManager} from "../../utils/sessionManager";
import {Author} from "../../types/author";

export const useDashboard = () => {
    const [authors, setAuthors] = useState<Author[] | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const sessionManager = useSessionManager();

    useEffect(() => {
        fetchData();
    }, [sessionManager.currentUser]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await API(sessionManager).authors().get();
            setLoading(false);
            if( !response ) {
                return;
            }

            setAuthors(response.data);
        } catch (error) {
            console.trace(error);
            setLoading(false);

            alert('Failed to fetch books.');
        }
    };


    return {  authors, loading };
};
