import axios from 'axios';
import {User} from '../types';
import {useSessionManager} from "./sessionManager";
import {Language} from "../types/language";
import {Category} from "../types/category";
import {Album} from "../types/album";
import {Review} from "../types/review";

export interface RegisterDto {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

export const API = (sessionManager: ReturnType<typeof useSessionManager>) => {
    const url = 'http://localhost:8080';

    const client = axios.create({
        baseURL: url,
        paramsSerializer: {
            indexes: null,
        },
        withCredentials: true,
    });

    const handleErrors = async <T>(fn: () => Promise<T>): Promise<T | null> => {
        try {
            return await fn();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 403) {
                console.error('Unauthorized access. Redirecting to login or refreshing session.');
                sessionManager.logout();
                return null;
            }
            throw error;
        }
    };

    const getCurrentUserId = () => {
        const userId = sessionStorage.getItem('current_user_id');
        if (!userId) {
            console.error('No user ID found in session storage.');
            throw new Error('User not authenticated');
        }
        return userId;
    };

    return {
        users: () => ({
            login: async (email: string, password: string) => {
                return client<User>('/auth/login', {
                    method: 'POST',
                    data: {
                        email,
                        password,
                    },
                });
            },

            register: async (data: RegisterDto) => {
                return client<User>('/auth/register', {
                    method: 'POST',
                    data,
                });
            },

            logout: async () => {
                return client('/auth/logout', {
                    method: 'POST',
                });
            },

            getById: (id: string) =>
                handleErrors(() =>
                    client<User>(`/users/${id}`, {
                        method: 'GET',
                    })
                ),

            getAll: () =>
                handleErrors(() =>
                    client<User[]>('/users', {
                        method: 'GET',
                    })
                ),

            modifyRole: (userId: string, action: string) =>
                client.patch('/users/modifyRole', {
                    userID: userId,
                    action,
                }),

            changePhoto: (data: FormData) => {
                const currentUserId = getCurrentUserId();
                return client.post('/users/changePhoto', data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        current_user_id: currentUserId,
                    },
                });
            },
        }),

        languages: () => ({
            get: () =>
                handleErrors(() =>
                    client<Language[]>('/languages/', {
                        method: 'GET',
                    })
                ),
        }),

        categories: () => ({
            get: () =>
                handleErrors(() =>
                    client<Category[]>('/categories/', {
                        method: 'GET',
                    })
                ),
        }),

        albums: () => ({
            getByParams: (params?: { title?: string; author?: string; category?: string; language?: string }) => {
                const queryParams = new URLSearchParams(params as Record<string, string>);
                const currentUserId = getCurrentUserId();
                return handleErrors(() =>
                    client<Album[]>(`/albums/?${queryParams.toString()}`, {
                        headers: {current_user_id: currentUserId},
                        method: 'GET',
                    })
                );
            },

            getByID: (id: string) => {
                const currentUserId = getCurrentUserId();
                return handleErrors(() =>
                    client<Album>(`/albums/${id}`, {
                        headers: {current_user_id: currentUserId},
                        method: 'GET',
                    })
                );
            },

            getReviews: (id: string) =>
                handleErrors(() =>
                    client<Review[]>(`/reviews/${id}`, {
                        method: 'GET',
                    })
                ),

            getFavorites: () => {
                const currentUserId = getCurrentUserId();
                return handleErrors(() =>
                    client<Album[]>('/favAlbums', {
                        headers: {current_user_id: currentUserId},
                        method: 'GET',
                    })
                );
            },

            getTop: () => {
                const currentUserId = getCurrentUserId();
                return handleErrors(() =>
                    client<Album[]>('/topAlbums', {
                        headers: {current_user_id: currentUserId},
                        method: 'GET',
                    })
                );
            },

            getPending: () =>
                handleErrors(() =>
                    client<Album[]>('/pendingAlbums', {
                        method: 'GET',
                    })
                ),

            add: (data: FormData) => {
                const currentUserId = getCurrentUserId();
                return client.post('/albums/add', data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        current_user_id: currentUserId,
                    },
                });
            },

            modifyStatus: (albumId: string, action: string) =>
                client.patch('/albums/modifyStatus', {
                    albumID: albumId,
                    action,
                }),

            getUserAlbums: () => {
                const currentUserId = getCurrentUserId();
                return handleErrors(() =>
                    client<Album[]>('/userAlbums', {
                        headers: {current_user_id: currentUserId},
                        method: 'GET',
                    })
                );
            },
        }),

        favorites: () => ({
            toggle: (albumId: string) => {
                const currentUserId = getCurrentUserId();
                return client.post('/toggleFavorite', {albumId}, {
                    headers: {current_user_id: currentUserId},
                });
            },
        }),

        reviews: () => ({
            add: (data: object) => {
                const currentUserId = getCurrentUserId();
                return client.post('/reviews/add', data, {
                    headers: {current_user_id: currentUserId},
                });
            },

            getPending: () =>
                handleErrors(() =>
                    client<Review[]>('/pendingReviews', {
                        method: 'GET',
                    })
                ),

            getUserReviews: () => {
                const currentUserId = getCurrentUserId();
                return handleErrors(() =>
                    client<Review[]>('/userReviews', {
                        headers: {current_user_id: currentUserId},
                        method: 'GET',
                    })
                );
            },

            modifyStatus: (reviewId: string, action: string) =>
                client.patch('/reviews/modifyStatus', {
                    reviewId,
                    action,
                }),
        }),
    }
}