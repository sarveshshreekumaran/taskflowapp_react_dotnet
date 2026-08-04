import React, { useState } from "react";
import { taskService } from "../services/task.service.js";
import type { TaskItem } from "../types/index.js";

interface TaskFormProps {
    existingTask?: TaskItem;
    onSaveSuccess: () => void;
    onCancel: () => void;
}

export default function TaskForm({ existingTask, onSaveSuccess, onCancel }: TaskFormProps) {
    const [title, setTitle] = useState<string>(existingTask?.title || "");
    const [description, setDescription] = useState<string>(existingTask?.description || "");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const isEditMode = !!existingTask;

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isEditMode && existingTask) {
                const updatedPayload: TaskItem = {
                    ...existingTask,
                    title,
                    description
                }

                await taskService.updateTask(existingTask.id, updatedPayload);
            } else {
                await taskService.createTask({
                    title,
                    description,
                    isCompleted: false
                })
                
            }
            onSaveSuccess();
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: '500px', margin: "20px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "6px", background: "#fff" }}>
            <h3>{isEditMode ? 'Edit Task Details' : "Create New Task Assignment"}</h3>

            {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: "block", marginBottom: '5px', fontWeight: "500" }}>Task Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="What needs to be done?"
                        style={{ width: '100%', padding: "8px", boxSizing: "border-box", border: "1px solid #ccc", borderRadius: "4px" }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: "block", marginBottom: '5px', fontWeight: "500" }}>Detailed Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        placeholder="Add context or notes here..."
                        style={{ width: '100%', padding: "8px", boxSizing: "border-box", border: "1px solid #ccc", borderRadius: "4px", resize: "vertical" }}
                    />
                </div>

                <div style={{ display: 'flex', gap: "10px", justifyContent: "end" }}>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            style={{ padding: "8px 16px", background: "#6c757d", color: '#fff', border: "none", borderRadius: "4px", cursor: "pointer" }}
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ padding: "8px 16px", background: "#007bff", color: '#fff', border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                        {loading ? 'Saving Changes...' : isEditMode ? 'Update Task' : 'Save Task'}
                    </button>
                </div>
            </form>
        </div>
    )
}