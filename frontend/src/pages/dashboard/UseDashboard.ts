import { useEffect, useState } from 'react';
import { API } from '../../utils/api';
import {useSessionManager} from "../../utils/sessionManager";
import {Language} from "../../types/language";

export const useDashboard = () => {
    const [languages, setLanguages] = useState<Language[] | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const sessionManager = useSessionManager();

    useEffect(() => {
        fetchData();
    }, [sessionManager.currentUser]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await API(sessionManager).languages().get();
            setLoading(false);
            if( !response ) {
                return;
            }

            setLanguages(response.data);
        } catch (error) {
            console.trace(error);
            setLoading(false);

            alert('Failed to fetch books.');
        }
    };


    return {  languages, loading };
};
