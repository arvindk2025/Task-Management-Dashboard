import React, { useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
	Card,
	CardContent,
	Typography,
	Chip,
	Box,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	Divider,
	Select,
	MenuItem,
	type SelectChangeEvent,
	useMediaQuery,
	useTheme,
} from '@mui/material';

import { TASK_STATUSES } from 'src/constants/task';
import { useTaskStore } from 'src/features/task/store/taskStore';
import type { TaskStatus, TaskCardProps } from 'src/features/task/types/types';
import { ConfirmationDialog } from 'src/shared/components/ConfirmationDialog';
import { formatDate, kebabToTitleCase } from 'src/utils/formatter';

import { getColorByPriority, TaskForm } from './TaskForm';

const statusColors: Record<TaskStatus, string> = {
	todo: '#757575',
	'in-progress': '#1565c0',
	completed: '#2e7d32',
};

export const TaskCard = ({ task, variant = 'list' }: TaskCardProps) => {
	const deleteTask = useTaskStore((state) => state.deleteTask);
	const updateTask = useTaskStore((state) => state.updateTask);

	const theme = useTheme();
	const isSmallScreen = useMediaQuery('(max-width: 425px)');

	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const isCompleted = task.status === 'completed';
	const isOverdue =
		new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0)) &&
		!isCompleted;

	const handleEdit = () => setIsEditDialogOpen(true);
	const handleEditDialogClose = () => setIsEditDialogOpen(false);
	const handleDeleteDialogClose = () => setIsDeleteDialogOpen(false);

	const handleDelete = () => {
		deleteTask(task.id);
		setIsDeleteDialogOpen(false);
	};

	const handleStatusChange = (e: SelectChangeEvent) => {
		const newStatus = e.target.value as TaskStatus;
		if (newStatus === task.status) return;
		updateTask(task.id, {
			title: task.title,
			description: task.description,
			dueDate: task.dueDate,
			priority: task.priority,
			status: newStatus,
		});
	};

	const statusSelect = (
		<Select
			value={task.status}
			onChange={handleStatusChange}
			size='small'
			variant='outlined'
			sx={{
				fontSize: '0.8rem',
				fontWeight: 700,
				color: '#fff',
				height: 28,
				backgroundColor: statusColors[task.status],
				borderRadius: '14px',
				'& .MuiOutlinedInput-notchedOutline': {
					border: 'none',
				},
				'&:hover .MuiOutlinedInput-notchedOutline': {
					border: 'none',
				},
				'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
					border: 'none',
				},
				'& .MuiSelect-icon': {
					color: '#fff',
					fontSize: '1rem',
				},
				'& .MuiSelect-select': {
					py: 0,
					px: 1.25,
				},
			}}
		>
			{TASK_STATUSES.map((s) => (
				<MenuItem key={s} value={s} sx={{ fontSize: '0.875rem' }}>
					{kebabToTitleCase(s)}
				</MenuItem>
			))}
		</Select>
	);

	return (
		<>
			<Card
				sx={{
					mb: variant === 'list' ? 2 : 0,
					height: variant === 'grid' ? '100%' : 'auto',
					minHeight: variant === 'grid' ? 160 : 'auto',
					display: variant === 'grid' ? 'flex' : 'block',
					flexDirection: variant === 'grid' ? 'column' : undefined,
					opacity: isCompleted ? 0.75 : 1,
					borderRadius: 3,
					border: `1.5px solid ${statusColors[task.status]}`,
					bgcolor:
						theme.palette.mode === 'dark'
							? theme.palette.background.paper
							: '#f5f8ff',
					boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
					transition: 'all 0.3s ease',
					'&:hover': {
						transform: 'translateY(-4px)',
						boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
					},
				}}
			>
				{variant === 'grid' ? (
					/* ── GRID LAYOUT ── */
					<CardContent
						sx={{
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							p: 2,
							'&:last-child': { pb: 2 },
						}}
					>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'flex-start',
								mb: 1,
								gap: 1,
							}}
						>
							<Typography
								variant='subtitle1'
								sx={{
									fontWeight: 700,
									fontSize: '1rem',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
									flex: 1,
									minWidth: 0,
								}}
							>
								{task.title}
							</Typography>

							<Box
								sx={{
									display: 'flex',
									gap: 0.5,
									flexShrink: 0,
								}}
							>
								<IconButton
									size='small'
									onClick={handleEdit}
									sx={{ p: 0.5 }}
									aria-label='edit task'
								>
									<EditIcon sx={{ fontSize: 16 }} />
								</IconButton>
								<IconButton
									size='small'
									onClick={() => setIsDeleteDialogOpen(true)}
									sx={{ p: 0.5 }}
									aria-label='delete task'
								>
									<DeleteIcon
										sx={{ fontSize: 16 }}
										color='error'
									/>
								</IconButton>
							</Box>
						</Box>

						<Typography
							variant='body2'
							color='text.secondary'
							sx={{
								mb: 2,
								display: '-webkit-box',
								WebkitLineClamp: 2,
								WebkitBoxOrient: 'vertical',
								overflow: 'hidden',
								lineHeight: 1.5,
								minHeight: '3em',
							}}
						>
							{task.description}
						</Typography>

						<Box sx={{ flex: 1 }} />
						<Divider sx={{ mb: 1 }} />

						<Box
							sx={{
								display: 'flex',
								flexWrap: 'wrap',
								gap: 0.75,
								alignItems: 'center',
							}}
						>
							{statusSelect}
							<Chip
								label={kebabToTitleCase(task.priority)}
								size='small'
								sx={{
									backgroundColor: getColorByPriority(
										task.priority,
									),
									color: 'white',
								}}
							/>
							<Chip
								label={`Due: ${formatDate(task.dueDate)}`}
								variant='outlined'
								size='small'
								color={isOverdue ? 'error' : 'default'}
							/>
						</Box>
					</CardContent>
				) : (
					/* ── LIST LAYOUT ── */
					<CardContent>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'flex-start',
								gap: 1,
							}}
						>
							<Box sx={{ flex: 1, minWidth: 0 }}>
								<Typography
									variant='h6'
									gutterBottom
									sx={{
										textOverflow: 'ellipsis',
										overflow: 'hidden',
										whiteSpace: 'nowrap',
										fontSize: {
											xs: '1rem',
											sm: '1.25rem',
										},
									}}
								>
									{task.title}
								</Typography>

								<Typography
									variant='body2'
									color='text.secondary'
									paragraph
									sx={{
										textOverflow: 'ellipsis',
										overflow: 'hidden',
										whiteSpace: 'nowrap',
										fontSize: '0.875rem',
									}}
								>
									{task.description}
								</Typography>

								<Box
									sx={{
										display: 'flex',
										gap: 1,
										flexWrap: 'wrap',
										alignItems: 'center',
										mt: 1,
										minHeight: isSmallScreen
											? '64px'
											: 'auto',
										alignContent: isSmallScreen
											? 'flex-end'
											: 'flex-start',
									}}
								>
									{statusSelect}
									<Chip
										label={kebabToTitleCase(task.priority)}
										sx={{
											backgroundColor: getColorByPriority(
												task.priority,
											),
											color: 'white',
										}}
									/>
									<Chip
										label={`Due: ${formatDate(task.dueDate)}`}
										variant='outlined'
										color={isOverdue ? 'error' : 'default'}
									/>
								</Box>
							</Box>

							<IconButton
								size='small'
								onClick={handleEdit}
								sx={{ mt: -1, mr: -1 }}
								aria-label='edit task'
							>
								<EditIcon fontSize='small' />
							</IconButton>
							<IconButton
								size='small'
								onClick={() => setIsDeleteDialogOpen(true)}
								sx={{ mt: -1, mr: -1 }}
								aria-label='delete task'
							>
								<DeleteIcon fontSize='small' color='error' />
							</IconButton>
						</Box>
					</CardContent>
				)}
			</Card>

			<Dialog
				open={isEditDialogOpen}
				onClose={handleEditDialogClose}
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
					Edit Task
					<IconButton
						aria-label='close'
						onClick={handleEditDialogClose}
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
					<TaskForm
						onClose={handleEditDialogClose}
						initialData={{
							title: task.title,
							description: task.description,
							dueDate: task.dueDate,
							status: task.status,
							priority: task.priority,
						}}
						taskId={task.id}
					/>
				</DialogContent>
			</Dialog>

			<ConfirmationDialog
				modalOpen={isDeleteDialogOpen}
				handleModalClose={handleDeleteDialogClose}
				handleYes={handleDelete}
				handleNo={handleDeleteDialogClose}
				title='Delete this Task ?'
				modalContent='This action cannot be undone.'
			/>
		</>
	);
};
