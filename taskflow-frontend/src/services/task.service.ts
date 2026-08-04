import apiClient from "../api/client.js";
import type { TaskItem } from "../types/index.js";


export const taskService = {
    async getAllTasks(): Promise<TaskItem[]> {
        const response = await apiClient.get<TaskItem[]>('/tasks');
        return response.data;
    },

    async createTask(task: Omit<TaskItem, 'id' | 'createdAt'>): Promise<TaskItem> {
        const response = await apiClient.post<TaskItem>('/tasks', task);
        return response.data;
    },

    async updateTask(id: number, task: TaskItem): Promise<void> {
        await apiClient.put(`/tasks/${id}`, task);
    },

    async deleteTask(id: number): Promise<void> {
        await apiClient.delete(`/tasks/${id}`)
    }


}