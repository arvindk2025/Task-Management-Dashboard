import { create } from 'zustand';

import { DEMO_TASKS, STORAGE_KEYS } from 'src/constants/task';
import type {
	Task,
	TaskFormData,
	TaskStore,
} from 'src/features/task/types/types';
import { localStorage } from 'src/utils/storage';
import { generateTaskId } from 'src/utils/task';

const loadTasksFromStorage = (): Task[] => {
	const stored = localStorage.get<Task[]>(STORAGE_KEYS.TASKS) || [];
	const demoIds = new Set(DEMO_TASKS.map((t) => t.id));
	const userTasks = stored.filter((t) => !demoIds.has(t.id));
	// Merge: latest demo task state (from stored, if modified) + user-added tasks
	const demoTasksCurrent = DEMO_TASKS.map((demo) => {
		const modified = stored.find((t) => t.id === demo.id);
		return modified ?? demo;
	});
	return [...demoTasksCurrent, ...userTasks];
};

const saveTasksToStorage = (tasks: Task[]): void => {
	localStorage.set(STORAGE_KEYS.TASKS, tasks);
};

export const useTaskStore = create<TaskStore>((set) => ({
	tasks: [],
	isAddTaskFormOpen: false,

	openAddTaskForm: () => set({ isAddTaskFormOpen: true }),
	closeAddTaskForm: () => set({ isAddTaskFormOpen: false }),

	loadTasks: () => {
		const tasks = loadTasksFromStorage();
		set({ tasks });
	},

	addTask: (formData: TaskFormData) => {
		const now = new Date().toISOString();
		const newTask: Task = {
			id: generateTaskId(),
			title: formData.title,
			description: formData.description,
			dueDate: formData.dueDate,
			status: formData.status,
			priority: formData.priority,
			createdAt: now,
			updatedAt: now,
		};

		set((state) => {
			const updatedTasks = [...state.tasks, newTask];
			saveTasksToStorage(updatedTasks);
			return { tasks: updatedTasks };
		});
	},

	updateTask: (id: string, formData: TaskFormData) => {
		set((state) => {
			const updatedTasks = state.tasks.map((task) => {
				if (task.id === id) {
					return {
						...task,
						title: formData.title,
						description: formData.description,
						dueDate: formData.dueDate,
						status: formData.status,
						priority: formData.priority,
						updatedAt: new Date().toISOString(),
					};
				}
				return task;
			});
			saveTasksToStorage(updatedTasks);
			return { tasks: updatedTasks };
		});
	},

	deleteTask: (id: string) => {
		set((state) => {
			const updatedTasks = state.tasks.filter((task) => task.id !== id);
			saveTasksToStorage(updatedTasks);
			return { tasks: updatedTasks };
		});
	},
}));
