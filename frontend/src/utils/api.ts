import axios from 'axios';
import {User} from '../types';

export interface RegisterDto {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

export const API = () => {
    const url = 'http://localhost:8080';
    console.log(url);

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
        }
    }
}