import path from 'path';

import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
	resolve: {
		alias: {
			src: path.resolve(__dirname, 'src'),
		},
	},

	plugins: [
		react(),
		checker({
			eslint: {
				lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
			},
			overlay: {
				initialIsOpen: false,
			},
			typescript: true,
		}),
		visualizer({
			filename: 'dist/stats.html',
			open: false,
			gzipSize: true,
		}),
	],
});
