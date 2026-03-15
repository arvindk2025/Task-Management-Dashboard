import { STORAGE_KEYS } from 'src/constants/task';
import type { FilterState } from 'src/features/task/types/types';

export const localStorage = {
	get: <T>(key: string): T | null => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? (JSON.parse(item) as T) : null;
		} catch {
			return null;
		}
	},
	set: <T>(key: string, value: T): void => {
		try {
			window.localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error('Failed to save to localStorage:', error);
		}
	},
	remove: (key: string): void => {
		try {
			window.localStorage.removeItem(key);
		} catch (error) {
			console.error('Failed to remove from localStorage:', error);
		}
	},
};

export const sessionStorage = {
	get: <T>(key: string): T | null => {
		try {
			const item = window.sessionStorage.getItem(key);
			return item ? (JSON.parse(item) as T) : null;
		} catch {
			return null;
		}
	},
	set: <T>(key: string, value: T): void => {
		try {
			window.sessionStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error('Failed to save to sessionStorage:', error);
		}
	},
	remove: (key: string): void => {
		try {
			window.sessionStorage.removeItem(key);
		} catch (error) {
			console.error('Failed to remove from sessionStorage:', error);
		}
	},
};

export const getFilterState = (): FilterState | null => {
	return localStorage.get<FilterState>(STORAGE_KEYS.FILTER_STATE);
};

export const saveFilterState = (state: FilterState): void => {
	localStorage.set(STORAGE_KEYS.FILTER_STATE, state);
};
