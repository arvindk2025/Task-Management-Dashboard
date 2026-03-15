import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ThemeState } from 'src/shared/types/storeTypes';

export const useThemeStore = create<ThemeState>()(
	persist(
		(set) => ({
			mode: 'light',
			toggleTheme: () =>
				set((state) => ({
					mode: state.mode === 'light' ? 'dark' : 'light',
				})),
		}),
		{
			name: 'theme-storage',
		},
	),
);
