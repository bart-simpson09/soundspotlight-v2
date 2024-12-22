export interface AuthCheckResponse {
    isAuthenticated: boolean;
    user?: {
        sub: string;
        email: string;
        role: string;
        exp: number;
    };
}