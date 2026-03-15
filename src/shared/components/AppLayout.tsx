import { Outlet } from 'react-router-dom';

import { Box, useTheme } from '@mui/material';

import { AppHeader } from 'src/shared/components/AppHeader';

export const AppLayout: React.FC = () => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				height: '100vh',
				display: 'flex',
				flexDirection: 'column',
				overflow: 'hidden',
				bgcolor:
					theme.palette.mode === 'dark'
						? theme.palette.background.default
						: '#f5f7fa',
			}}
		>
			<AppHeader />
			<Box
				sx={{
					flex: 1,
					overflow: 'auto',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Outlet />
			</Box>
		</Box>
	);
};
