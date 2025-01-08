import axios from 'axios';
import {User} from '../types';
import {useSessionManager} from "./sessionManager";
import {Author} from "../types/author";
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

export interface AddAlbumDto {
    cover: string
    title: string;
    author: string;
    language: string;
    category: string;
    releaseDate: string;
    numberOfSongs: number;
    description: string;
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

            getById: async (id: string) => {
                try {
                    return await client<User>(`/users/${id}`, {
                        method: 'GET',
                    });
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        if (error.response?.status === 403) {
                            console.error('Unauthorized access. Redirecting to login or refreshing session.');
                            sessionManager.logout();
                        }
                    }
                    throw error;
                }
            },

            getAll: async () => {
                try {
                    return await client<User[]>(`/users`, {
                        method: 'GET',
                    });
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        if (error.response?.status === 403) {
                            console.error('Unauthorized access. Redirecting to login or refreshing session.');
                            sessionManager.logout();
                        }
                    }
                    throw error;
                }
            },

            modifyRole: async (userId: string, action: string) => {
                return client.patch('/users/modifyRole', {
                    userID: userId,
                    action: action
                });
            },
        }),

        authors: () => ({
            get: async () => {
                try {
                    return await client<Author[]>(`/authors/`, {
                        method: 'GET',
                    });
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        if (error.response?.status === 403) {
                            console.error('Unauthorized access. Redirecting to login or refreshing session.');
                            sessionManager.logout();

                            return null;
                        }
                    }
                    throw error;
                }
            },
        }),

        languages: () => ({
            get: async () => {
                try {
                    return await client<Language[]>(`/languages/`, {
                        method: 'GET',
                    });
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        if (error.response?.status === 403) {
                            console.error('Unauthorized access. Redirecting to login or refreshing session.');
                            sessionManager.logout();

                            return null;
                        }
                    }
                    throw error;
                }
            },
        }),

        categories: () => ({
            get: async () => {
                try {
                    return await client<Category[]>(`/categories/`, {
                        method: 'GET',
                    });
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        if (error.response?.status === 403) {
                            console.error('Unauthorized access. Redirecting to login or refreshing session.');
                            sessionManager.logout();

                            return null;
                        }
                    }
                    throw error;
                }
            },
        }),

        albums: () => ({
            getByParams: async (params?: { title?: string; author?: string; category?: string; language?: string }) => {
                try {
                    const queryParams = new URLSearchParams();

                    if (params) {
                        Object.entries(params).forEach(([key, value]) => {
                            if (value) {
                                queryParams.append(key, value);
                            }
                        });
                    }

                    const queryString = queryParams.toString();

                    const currentUserId = sessionStorage.getItem('current_user_id');

                    if (!currentUserId) {
                        console.error('No user ID found in session storage.');
                        return new Error('User not authenticated');
                    }

                    return await client<Album[]>(`/albums/?${queryString}`, {
                        headers: {
                            'current_user_id': currentUserId,
                        },
                        method: 'GET',
                    });
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        if (error.response?.status === 403) {
                            console.error('Unauthorized access. Redirecting to login or refreshing session.');
                            sessionManager.logout();

                            return null;
                        }
                    }
                    throw error;
                }
            },

            getByID: async (id: string) => {
                const currentUserId = sessionStorage.getItem('current_user_id');

                if (!currentUserId) {
                    console.error('No user ID found in session storage.');
                    throw new Error('User not authenticated');
                }

                    try {
                        return await client<Album>(`/albums/${id}`, {
                            headers: {
                                'current_user_id': currentUserId,
                            },
                            method: 'GET',
                        });
                    } catch (error) {
                        if (axios.isAxiosError(error)) {
                            if (error.response?.status === 403) {
                                console.error('Unauthorized access. Redirecting to login or refreshing session.');
                                sessionManager.logout();

                                return null;
                            } else if (error.response?.status === 404) {
                                console.error(`Error: ${error.response.data.message}`);
                            }
                        }

                        throw error;
                    }
            },

            getFavorites: async () => {
                const currentUserId = sessionStorage.getItem('current_user_id');

                if (!currentUserId) {
                    console.error('No user ID found in session storage.');
                    throw new Error('User not authenticated');
                }

                try {
                    return await client<Album[]>(`/favAlbums`, {
                        headers: {
                            'current_user_id': currentUserId,
                        },
                        method: 'GET',
                    });
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        if (error.response?.status === 403) {
                            console.error('Unauthorized access. Redirecting to login or refreshing session.');
                            sessionManager.logout();

                            return null;
                        } else if (error.response?.status === 404) {
                            console.error(`Error: ${error.response.data.message}`);
                        }
                    }

                    throw error;
                }
            },

            getTop: async () => {
                const currentUserId = sessionStorage.getItem('current_user_id');

                if (!currentUserId) {
                    console.error('No user ID found in session storage.');
                    throw new Error('User not authenticated');
                }

                try {
                    return await client<Album[]>(`/topAlbums`, {
                        headers: {
                            'current_user_id': currentUserId,
                        },
                        method: 'GET',
                    });
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        if (error.response?.status === 403) {
                            console.error('Unauthorized access. Redirecting to login or refreshing session.');
                            sessionManager.logout();

                            return null;
                        } else if (error.response?.status === 404) {
                            console.error(`Error: ${error.response.data.message}`);
                        }
                    }

                    throw error;
                }
            },

            getPending: async () => {
                try {
                    return await client<Album[]>(`/pendingAlbums`, {
                        method: 'GET',
                    });
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        if (error.response?.status === 403) {
                            console.error('Unauthorized access. Redirecting to login or refreshing session.');
                            sessionManager.logout();

                            return null;
                        } else if (error.response?.status === 404) {
                            console.error(`Error: ${error.response.data.message}`);
                        }
                    }

                    throw error;
                }
            },

            add: async (data: FormData) => {
                const currentUserId = sessionStorage.getItem('current_user_id');

                if (!currentUserId) {
                    console.error('No user ID found in session storage.');
                    throw new Error('User not authenticated');
                }

                return client.post('/albums/add', data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'current_user_id': currentUserId,
                    },
                    method: 'POST',
                    data,
                });
            },

            modifyStatus: async (albumId: string, action: string) => {
                return client.patch('/albums/modifyStatus', {
                    albumID: albumId,
                    action: action
                });
            },
        }),

        favorites: () => ({
            toggle: async (albumId: string) => {
                const currentUserId = sessionStorage.getItem('current_user_id');

                if (!currentUserId) {
                    console.error('No user ID found in session storage.');
                    throw new Error('User not authenticated');
                }

                return client.post('/toggleFavorite', {
                    albumId
                }, {
                    headers: {
                        'current_user_id': currentUserId,
                    },
                    method: 'POST',
                });
            },
        }),

        reviews: () => ({
            add: async (data: object) => {
                const currentUserId = sessionStorage.getItem('current_user_id');

                if (!currentUserId) {
                    console.error('No user ID found in session storage.');
                    throw new Error('User not authenticated');
                }

                return client.post('/reviews/add', data, {
                    headers: {
                        'current_user_id': currentUserId,
                    },
                    method: 'POST',
                });
            },

            getPending: async () => {
                try {
                    return await client<Review[]>(`/pendingReviews`, {
                        method: 'GET',
                    });
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        if (error.response?.status === 403) {
                            console.error('Unauthorized access. Redirecting to login or refreshing session.');
                            sessionManager.logout();

                            return null;
                        } else if (error.response?.status === 404) {
                            console.error(`Error: ${error.response.data.message}`);
                        }
                    }

                    throw error;
                }
            },

            modifyStatus: async (reviewId: string, action: string) => {
                return client.patch('/reviews/modifyStatus', {
                    albumID: reviewId,
                    action: action
                });
            },
        }),
    }
}