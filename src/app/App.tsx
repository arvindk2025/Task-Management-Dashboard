import React, { Suspense, useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';

import {
	CircularProgress,
	ThemeProvider,
	createTheme,
	CssBaseline,
	Box,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useThemeStore } from 'src/shared/store/themeStore';

import { router } from './router';

const App: React.FC = () => {
	const mode = useThemeStore((state) => state.mode);

	const theme = useMemo(
		() =>
			createTheme({
				palette: { mode },
			}),
		[mode],
	);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<Suspense
					fallback={
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								minHeight: '100vh',
							}}
						>
							<CircularProgress />
						</Box>
					}
				>
					<RouterProvider router={router} />
				</Suspense>
			</LocalizationProvider>
		</ThemeProvider>
	);
};

export default App;
