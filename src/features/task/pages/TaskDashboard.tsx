import React, { useEffect, useMemo } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import {
	Container,
	Box,
	Paper,
	Typography,
	Grid,
	Dialog,
	DialogTitle,
	DialogContent,
	IconButton,
	useTheme,
} from '@mui/material';

import { TaskForm } from 'src/features/task/components/TaskForm';
import { TaskList } from 'src/features/task/components/TaskList';
import { useTaskStore } from 'src/features/task/store/taskStore';

const STAT_CARDS = [
	{
		key: 'total',
		label: 'Total Tasks',
		light: { bg: '#dbeafe', text: '#1e40af' },
		dark: { bg: '#1e2a3a', text: '#93c5fd' },
	},
	{
		key: 'pending',
		label: 'Pending Tasks',
		light: { bg: '#fef3c7', text: '#92400e' },
		dark: { bg: '#2a1f35', text: '#c4b5fd' },
	},
	{
		key: 'completed',
		label: 'Completed Tasks',
		light: { bg: '#dcfce7', text: '#166534' },
		dark: { bg: '#0d2318', text: '#86efac' },
	},
];

const StatCard: React.FC<{
	label: string;
	count: number;
	bg: string;
	textColor: string;
}> = ({ label, count, bg, textColor }) => (
	<Paper
		elevation={0}
		sx={{
			p: { xs: 1.5, sm: 2 },
			borderRadius: 2,
			bgcolor: bg,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			gap: 1,
			border: '1px solid',
			borderColor: 'divider',
		}}
	>
		<Typography
			variant='body2'
			sx={{
				color: textColor,
				fontWeight: 700,
				opacity: 0.85,
				letterSpacing: 0.2,
			}}
		>
			{label}
		</Typography>
		<Typography
			variant='h5'
			sx={{ fontWeight: 700, lineHeight: 1, color: textColor }}
		>
			{count}
		</Typography>
	</Paper>
);

export const TaskDashboard: React.FC = () => {
	const theme = useTheme();
	const tasks = useTaskStore((state) => state.tasks);
	const loadTasks = useTaskStore((state) => state.loadTasks);
	const isAddTaskFormOpen = useTaskStore((state) => state.isAddTaskFormOpen);
	const closeAddTaskForm = useTaskStore((state) => state.closeAddTaskForm);

	useEffect(() => {
		loadTasks();
	}, [loadTasks]);

	const totalTasks = tasks.length;
	const completedTasks = useMemo(
		() => tasks.filter((t) => t.status === 'completed').length,
		[tasks],
	);
	const pendingTasks = useMemo(
		() => tasks.filter((t) => t.status !== 'completed').length,
		[tasks],
	);

	const counts = {
		total: totalTasks,
		pending: pendingTasks,
		completed: completedTasks,
	};
	const isDark = theme.palette.mode === 'dark';

	return (
		<Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
			<Container
				maxWidth='lg'
				sx={{
					py: { xs: 2, sm: 3, md: 4 },
					px: { xs: 1, sm: 2 },
					display: 'flex',
					flexDirection: 'column',
					flex: 1,
					minHeight: 0,
				}}
			>
				{/* Stats Summary */}
				<Grid
					container
					spacing={{ xs: 1, sm: 1.5 }}
					sx={{ mb: { xs: 1.5, sm: 2 }, flexShrink: 0 }}
				>
					{STAT_CARDS.map((card) => (
						<Grid key={card.key} size={{ xs: 12, sm: 4 }}>
							<StatCard
								label={card.label}
								count={counts[card.key as keyof typeof counts]}
								bg={isDark ? card.dark.bg : card.light.bg}
								textColor={
									isDark ? card.dark.text : card.light.text
								}
							/>
						</Grid>
					))}
				</Grid>

				{/* Task List */}
				<Box
					sx={{
						flex: 1,
						minHeight: 0,
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<TaskList />
				</Box>
			</Container>

			{/* Add Task Dialog */}
			<Dialog
				open={isAddTaskFormOpen}
				onClose={closeAddTaskForm}
				maxWidth='sm'
				fullWidth
				PaperProps={{
					sx: (theme) => ({
						borderRadius: 3,
						backgroundImage: 'none',
						bgcolor:
							theme.palette.mode === 'dark'
								? '#1e2535'
								: '#f5f8ff',
						boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
					}),
				}}
			>
				<DialogTitle
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						px: 3,
						py: 2,
						bgcolor: '#1565c0',
						color: '#fff',
						borderRadius: '12px 12px 0 0',
						fontWeight: 700,
						fontSize: '1.1rem',
					}}
				>
					Add New Task
					<IconButton
						aria-label='close'
						onClick={closeAddTaskForm}
						size='small'
						sx={{
							color: '#fff',
							'&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
						}}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent sx={{ p: 0 }}>
					<TaskForm onClose={closeAddTaskForm} />
				</DialogContent>
			</Dialog>
		</Box>
	);
};
