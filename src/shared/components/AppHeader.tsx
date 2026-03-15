import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import {
	AppBar,
	Toolbar,
	Typography,
	Box,
	IconButton,
	Tooltip,
	Button,
	useTheme,
} from '@mui/material';

import { STORAGE_KEYS } from 'src/constants/task';
import { useTaskStore } from 'src/features/task/store/taskStore';
import { useThemeStore } from 'src/shared/store/themeStore';
import { sessionStorage } from 'src/utils/storage';

export const AppHeader: React.FC = () => {
	const location = useLocation();
	const theme = useTheme();
	const mode = useThemeStore((state) => state.mode);
	const toggleTheme = useThemeStore((state) => state.toggleTheme);
	const openAddTaskForm = useTaskStore((state) => state.openAddTaskForm);

	const [userName, setUserName] = useState<string | null>(null);

	useEffect(() => {
		const storedUserName = sessionStorage.get<string>(
			STORAGE_KEYS.USER_NAME,
		);
		setUserName(storedUserName);
	}, [location.pathname]);

	const handleThemeToggle = () => {
		toggleTheme();
	};

	return (
		<AppBar
			position='static'
			data-testid='app-header'
			sx={{
				bgcolor: theme.palette.mode === 'dark' ? '#1a2035' : '#1565c0',
				boxShadow:
					theme.palette.mode === 'dark'
						? '0 1px 0 rgba(255,255,255,0.08)'
						: '0 1px 4px rgba(0,0,0,0.2)',
			}}
		>
			<Toolbar sx={{ py: 1 }}>
				<Typography
					variant='h6'
					component='div'
					sx={{
						fontWeight: 600,
						fontSize: { xs: '0.95rem', sm: '1.1rem' },
						mr: { xs: 2, sm: 3 },
					}}
				>
					Task Management Dashboard
				</Typography>

				<Button
					aria-label='add task'
					data-testid='add-task-button'
					onClick={openAddTaskForm}
					startIcon={<AddIcon />}
					sx={{
						bgcolor: 'rgba(255,255,255,0.15)',
						color: '#fff',
						fontWeight: 800,
						fontSize: { xs: '0.9rem', sm: '1rem' },
						textTransform: 'none',
						borderRadius: 2,
						px: { xs: 2, sm: 2.5 },
						py: 1,
						boxShadow: 'none',
						whiteSpace: 'nowrap',
						'& .MuiButton-startIcon': {
							mr: 0.75,
							'& svg': { fontSize: '1.3rem' },
						},
						'&:hover': {
							bgcolor: 'rgba(255,255,255,0.28)',
							boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
						},
					}}
				>
					Add Task
				</Button>

				<Box sx={{ flexGrow: 1 }} />

				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: { xs: 1.5, sm: 2.5 },
					}}
				>
					{userName && (
						<Typography
							variant='body2'
							data-testid='greeting-message'
							sx={{
								fontWeight: 800,
								display: { xs: 'none', sm: 'block' },
								color: '#fff',
								fontSize: { sm: '1rem', md: '1.05rem' },
								letterSpacing: 0.3,
								px: 1.5,
								py: 0.5,
								borderRadius: 2,
								bgcolor: 'rgba(255,255,255,0.12)',
							}}
						>
							Welcome, {userName}!
						</Typography>
					)}
					<Tooltip
						title={
							mode === 'light'
								? 'Switch to Dark Mode'
								: 'Switch to Light Mode'
						}
						arrow
						slotProps={{
							tooltip: {
								sx: {
									fontSize: '0.78rem',
									fontWeight: 700,
									px: 1.2,
									py: 0.4,
									borderRadius: 1.5,
									bgcolor:
										theme.palette.mode === 'dark'
											? '#2a3a5c'
											: '#0d47a1',
									color: '#fff',
									backdropFilter: 'blur(4px)',
									boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
									letterSpacing: 0.2,
								},
							},
							arrow: {
								sx: {
									color:
										theme.palette.mode === 'dark'
											? '#2a3a5c'
											: '#0d47a1',
								},
							},
						}}
					>
						<IconButton
							onClick={handleThemeToggle}
							aria-label='toggle theme'
							data-testid='toggle-theme-button'
							sx={{
								color: '#fff',
								bgcolor: 'rgba(255,255,255,0.12)',
								borderRadius: 2,
								p: 1,
								transition: 'all 0.2s ease',
								'&:hover': {
									bgcolor: 'rgba(255,255,255,0.25)',
									transform: 'rotate(20deg)',
								},
							}}
						>
							{mode === 'light' ? (
								<DarkModeIcon fontSize='small' />
							) : (
								<LightModeIcon fontSize='small' />
							)}
						</IconButton>
					</Tooltip>
				</Box>
			</Toolbar>
		</AppBar>
	);
};
