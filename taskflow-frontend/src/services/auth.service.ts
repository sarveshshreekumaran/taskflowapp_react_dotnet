import apiClient from "../api/client.js";
import type { RegisterDto, LoginDto } from "../types/index.js"

export const authService = {
    async register(data: RegisterDto): Promise<{ message: string }> {
        const response = await apiClient.post<{ message: string }>('/auth/register', data);
        return response.data;
    },

    async login(data: LoginDto): Promise<{ message: string }> {
        const response = await apiClient.post<{ message: string }>('/auth/login', data);
        return response.data;
    },

    async logout(): Promise<{ message: string }> {
        const response = await apiClient.post<{ message: string }>('/auth/logout');
        return response.data;
    },

    async checkSessionStatus(): Promise<boolean> {
        try {
            const response = await apiClient.get("auth/me");
            console.log(response)
            return response.data.isAuthenticated;
            
        } catch (error) {
            console.log(error);
            return false 
        }

    }
}

