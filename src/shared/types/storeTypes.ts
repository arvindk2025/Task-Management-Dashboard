export type ThemeMode = 'light' | 'dark';

export interface ThemeState {
	mode: ThemeMode;
	toggleTheme: () => void;
}
