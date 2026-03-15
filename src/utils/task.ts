import type {
	Task,
	TaskStatus,
	TaskPriority,
} from 'src/features/task/types/types';

export const generateTaskId = (): string => {
	return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getDefaultDueDate = (daysAfter: number = 7): string => {
	const date = new Date();
	date.setDate(date.getDate() + daysAfter);
	date.setHours(0, 0, 0, 0);
	return date.toISOString();
};

export const filterTasksByStatus = (
	tasks: Task[],
	statuses: TaskStatus[],
): Task[] => {
	if (statuses.length === 0) return tasks;
	return tasks.filter((task) => statuses.includes(task.status));
};

export const searchTasks = (tasks: Task[], query: string): Task[] => {
	if (!query.trim()) return tasks;
	const lowerQuery = query.toLowerCase();
	return tasks.filter(
		(task) =>
			task.title.toLowerCase().includes(lowerQuery) ||
			task.description.toLowerCase().includes(lowerQuery),
	);
};

export const filterByPriority = (
	tasks: Task[],
	priorities: TaskPriority[],
): Task[] => {
	if (priorities.length === 0) return tasks;
	return tasks.filter((task) => priorities.includes(task.priority));
};
