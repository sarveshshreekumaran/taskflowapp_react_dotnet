export interface TaskItem {
    id: number;
    title: string;
    description: string;
    isCompleted: boolean;
    createdAt: string;
    dueDate?: string; 
}

export interface UserSession {
    email: string;
    token: string;
}

export interface AuthResponse {
    token: string;
    message?: string; 
}


export interface RegisterDto {
    email: string;
    password?: string;
}

export interface LoginDto {
    email: string;
    password?: string;
}