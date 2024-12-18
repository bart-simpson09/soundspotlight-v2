import axios from 'axios';
import {User} from '../types';
import {useSessionManager} from "./sessionManager";

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
                        if (error.response?.status === 401) {
                            console.error('Unauthorized access. Redirecting to login or refreshing session.');
                            sessionManager.logout();
                        }
                    }
                    throw error;
                }
            },
        })
    }
}