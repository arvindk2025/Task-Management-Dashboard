export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
	id: string;
	title: string;
	description: string;
	status: TaskStatus;
	priority: TaskPriority;
	dueDate: string;
	createdAt: string;
	updatedAt: string;
}

export interface TaskStore {
	tasks: Task[];
	isAddTaskFormOpen: boolean;
	addTask: (formData: TaskFormData) => void;
	updateTask: (id: string, formData: TaskFormData) => void;
	deleteTask: (id: string) => void;
	loadTasks: () => void;
	openAddTaskForm: () => void;
	closeAddTaskForm: () => void;
}

export interface TaskFormData {
	title: string;
	description: string;
	dueDate: string;
	status: TaskStatus;
	priority: TaskPriority;
}

export interface FilterState {
	statuses: TaskStatus[];
	priorities: TaskPriority[];
	searchQuery: string;
}

export interface TaskCardProps {
	task: Task;
	variant?: 'list' | 'grid';
}

export interface TaskFormProps {
	onClose: () => void;
	initialData?: TaskFormData;
	taskId?: string;
}
