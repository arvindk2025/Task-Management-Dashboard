import type {
	Task,
	TaskStatus,
	TaskPriority,
} from 'src/features/task/types/types';

export const TASK_STATUSES: TaskStatus[] = ['todo', 'in-progress', 'completed'];

export const TASK_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

export const DEFAULT_DUE_AFTER_DAYS = 7;

export const DEFAULT_STATUS: TaskStatus = 'todo';

export const DEFAULT_PRIORITY: TaskPriority = 'medium';

export const STORAGE_KEYS = {
	TASKS: 'task-management-tasks',
	FILTER_STATE: 'task-management-filter-state',
	USER_NAME: 'userName',
} as const;

export const DEMO_TASKS: Task[] = [
	{
		id: 'demo-task-1',
		title: 'DSA',
		description: 'Practice 10 questions per day.',
		status: 'in-progress',
		priority: 'medium',
		dueDate: '2026-03-21',
		createdAt: '2026-03-15T05:00:00.000Z',
		updatedAt: '2026-03-15T05:00:00.000Z',
	},
	{
		id: 'demo-task-2',
		title: 'React Js',
		description: 'Also see some interview questions daily.',
		status: 'completed',
		priority: 'high',
		dueDate: '2026-03-21',
		createdAt: '2026-03-15T04:00:00.000Z',
		updatedAt: '2026-03-15T04:00:00.000Z',
	},
	{
		id: 'demo-task-3',
		title: 'Javascript',
		description:
			'Study daily 3-4 hours & see 10 minutes interview question.',
		status: 'todo',
		priority: 'high',
		dueDate: '2026-03-21',
		createdAt: '2026-03-15T03:00:00.000Z',
		updatedAt: '2026-03-15T03:00:00.000Z',
	},
	{
		id: 'demo-task-4',
		title: 'System Design',
		description:
			'Study 1 system design concept daily and practice designing 1 real-world system per week.',
		status: 'completed',
		priority: 'high',
		dueDate: '2026-03-21',
		createdAt: '2026-03-15T02:00:00.000Z',
		updatedAt: '2026-03-15T02:00:00.000Z',
	},
	{
		id: 'demo-task-5',
		title: 'TypeScript',
		description:
			'Learn TypeScript types, interfaces, and generics with 1 hour of practice daily.',
		status: 'in-progress',
		priority: 'low',
		dueDate: '2026-03-21',
		createdAt: '2026-03-15T01:00:00.000Z',
		updatedAt: '2026-03-15T01:00:00.000Z',
	},
];
