import axios from 'axios';
import {User} from '../types';
import {useSessionManager} from "./sessionManager";
import {Author} from "../types/author";
import {Language} from "../types/language";
import {Category} from "../types/category";
import {Album} from "../types/album";

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

    return {
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

        user: (id: string) => ({
            get: async () => {
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
            getByParams: async (status: string, params?: { title?: string; author?: string; category?: string; language?: string }) => {
                try {
                    const queryParams = new URLSearchParams({ status });

                    if (params) {
                        Object.entries(params).forEach(([key, value]) => {
                            if (value) {
                                queryParams.append(key, value);
                            }
                        });
                    }

                    const queryString = queryParams.toString();

                    return await client<Album[]>(`/albums/?${queryString}`, {
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
    }
}