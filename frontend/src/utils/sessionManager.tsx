import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { API } from './api';

interface SessionManager {
    currentUser: User | undefined;
    setCurrentUser: (user: User) => void;
    logout: () => void;
    fetchUser: (userId: string) => void;
}

const STORAGE_KEY = 'current_user_id';

class CurrentUserIdManager {
    currentUser: User | undefined;

    setCurrentUserId(userId: string | undefined) {
        if (!userId) {
            sessionStorage.removeItem(STORAGE_KEY);
            return;
        }

        sessionStorage.setItem(STORAGE_KEY, userId);
    }

    getCurrentUserId() {
        return sessionStorage.getItem(STORAGE_KEY);
    }
}

const SessionManagerContext = createContext<SessionManager>({
    currentUser: undefined,
    setCurrentUser: () => {},
    logout: () => {},
    fetchUser: () => {},
});

export const useSessionManager = () => useContext(SessionManagerContext);

interface Props {
    children: ReactNode;
}

const cacheUser = (user: User | undefined) => {
    if (!user) {
        sessionStorage.removeItem('user');
        return;
    }

    sessionStorage.setItem('user', JSON.stringify(user));
};

const getCachedUser = (): User | undefined => {
    const user = sessionStorage.getItem('user');
    if (!user) {
        return undefined;
    }

    return JSON.parse(user);
};

export const SessionManagerProvider: React.FC<Props> = ({ children }: Props) => {
    const navigate = useNavigate();

    const currentUserIdManager = useMemo(() => new CurrentUserIdManager(), []);
    const currentUserId = currentUserIdManager.getCurrentUserId();

    const [user, setUser] = useState<User | undefined>(getCachedUser());

    useEffect(() => {
        if (!currentUserId) {
            return;
        }

        fetchUser(currentUserId);
    }, [currentUserId]);

    useEffect(() => {
        cacheUser(user);
    }, [user]);

    const fetchUser = async (currentUserId: string) => {
        try {
            const response = await API(sessionManager).users().getById(currentUserId);
            setUser(response.data);

        } catch (error) {
            console.trace(error);

            currentUserIdManager.setCurrentUserId(undefined);
            setUser(undefined);
            navigate('/login?logout=1');
        }
    };

    const sessionManager: SessionManager = {
        currentUser: user,
        setCurrentUser: (user: User) => {
            currentUserIdManager.setCurrentUserId(user.id);
            setUser(user);
        },
        logout: () => {
            API(sessionManager).users().logout();

            currentUserIdManager.setCurrentUserId(undefined);
            setUser(undefined);
            navigate('/login?logout=1');
        },
        fetchUser: (userId: string) => fetchUser(userId),
    };

    return <SessionManagerContext.Provider value={sessionManager}>{children}</SessionManagerContext.Provider>;
};
