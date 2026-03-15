import { useForm, Controller } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import {
	TextField,
	Button,
	Box,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { type Dayjs } from 'dayjs';

import {
	DEFAULT_DUE_AFTER_DAYS,
	DEFAULT_PRIORITY,
	DEFAULT_STATUS,
	TASK_PRIORITIES,
	TASK_STATUSES,
} from 'src/constants/task';
import { useTaskStore } from 'src/features/task/store/taskStore';
import type {
	TaskFormData,
	TaskFormProps,
	TaskPriority,
} from 'src/features/task/types/types';
import { TaskCreateValidationSchema } from 'src/features/task/types/validation';
import { kebabToTitleCase } from 'src/utils/formatter';
import { getDefaultDueDate } from 'src/utils/task';

export const getColorByPriority = (priority: TaskPriority): string => {
	switch (priority) {
		case 'high':
			return '#f44336';
		case 'medium':
			return '#ff9800';
		case 'low':
			return '#2196f3';
		default:
			return '#2196f3';
	}
};

export const TaskForm: React.FC<TaskFormProps> = ({
	onClose,
	initialData,
	taskId,
}) => {
	const addTask = useTaskStore((state) => state.addTask);
	const updateTask = useTaskStore((state) => state.updateTask);
	const isEditMode = !!initialData && !!taskId;

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset,
	} = useForm<TaskFormData>({
		resolver: yupResolver(TaskCreateValidationSchema),
		defaultValues: initialData || {
			title: '',
			description: '',
			dueDate: getDefaultDueDate(DEFAULT_DUE_AFTER_DAYS),
			status: DEFAULT_STATUS,
			priority: DEFAULT_PRIORITY,
		},
	});

	const onSubmit = (data: TaskFormData) => {
		if (isEditMode && taskId) {
			updateTask(taskId, data);
		} else {
			addTask(data);
			reset();
		}
		onClose();
	};

	return (
		<Box component='form' onSubmit={handleSubmit(onSubmit)}>
			{/* Form fields */}
			<Box
				sx={{
					px: 3,
					pt: 2.5,
					pb: 2,
					display: 'flex',
					flexDirection: 'column',
					gap: 2.5,
				}}
			>
				<TextField
					fullWidth
					placeholder='What needs to be done?'
					{...register('title')}
					error={!!errors.title}
					helperText={errors.title?.message}
					variant='standard'
					autoFocus
					sx={{
						'& .MuiInput-input': {
							fontSize: { xs: '1rem', sm: '1.2rem' },
							fontWeight: 600,
						},
						'& .MuiInput-underline:before': {
							borderBottomColor: 'divider',
						},
					}}
				/>
				<TextField
					fullWidth
					placeholder='Description (optional)...'
					multiline
					rows={3}
					{...register('description')}
					error={!!errors.description}
					helperText={errors.description?.message}
					variant='outlined'
					size='small'
					sx={{
						'& .MuiOutlinedInput-root': { borderRadius: 2 },
						'& .MuiInputBase-input': {
							fontSize: { xs: '0.875rem', sm: '0.95rem' },
						},
					}}
				/>

				{/* Status / Priority / Due Date row */}
				<Box
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', sm: 'row' },
						gap: 1.5,
						alignItems: { xs: 'stretch', sm: 'center' },
						flexWrap: 'wrap',
					}}
				>
					<FormControl size='small' sx={{ flex: 1, minWidth: 120 }}>
						<InputLabel id='status-label'>Status</InputLabel>
						<Controller
							name='status'
							control={control}
							render={({ field }) => (
								<Select
									{...field}
									labelId='status-label'
									label='Status'
									error={!!errors.status}
									sx={{ borderRadius: 2 }}
								>
									{TASK_STATUSES.map((status) => (
										<MenuItem key={status} value={status}>
											{kebabToTitleCase(status)}
										</MenuItem>
									))}
								</Select>
							)}
						/>
					</FormControl>

					<FormControl size='small' sx={{ flex: 1, minWidth: 120 }}>
						<InputLabel id='priority-label'>Priority</InputLabel>
						<Controller
							name='priority'
							control={control}
							render={({ field }) => (
								<Select
									{...field}
									labelId='priority-label'
									label='Priority'
									error={!!errors.priority}
									sx={{ borderRadius: 2 }}
								>
									{TASK_PRIORITIES.map((priority) => (
										<MenuItem
											key={priority}
											value={priority}
										>
											{kebabToTitleCase(priority)}
										</MenuItem>
									))}
								</Select>
							)}
						/>
					</FormControl>

					<Controller
						name='dueDate'
						control={control}
						render={({ field }) => (
							<DatePicker
								label='Due Date'
								value={field.value ? dayjs(field.value) : null}
								onChange={(newValue: Dayjs | null) => {
									if (!newValue) {
										field.onChange('');
										return;
									}
									const date = newValue
										.startOf('day')
										.toDate();
									date.setHours(0, 0, 0, 0);
									field.onChange(date.toISOString());
								}}
								slotProps={{
									textField: {
										size: 'small',
										error: !!errors.dueDate,
										helperText: errors.dueDate?.message,
										sx: {
											flex: 1,
											minWidth: 140,
											'& .MuiOutlinedInput-root': {
												borderRadius: 2,
											},
										},
									},
								}}
								minDate={
									initialData &&
									dayjs(initialData.dueDate).isBefore(dayjs())
										? undefined
										: dayjs()
								}
							/>
						)}
					/>
				</Box>
			</Box>

			{/* Footer with actions */}
			<Box
				sx={(theme) => ({
					px: 3,
					py: 2,
					display: 'flex',
					justifyContent: 'flex-end',
					gap: 1.5,
					flexDirection: { xs: 'column-reverse', sm: 'row' },
					borderTop: '1px solid',
					borderColor: 'divider',
					bgcolor:
						theme.palette.mode === 'dark'
							? 'rgba(255,255,255,0.03)'
							: 'rgba(21,101,192,0.04)',
				})}
			>
				<Button
					type='button'
					variant='outlined'
					color='error'
					onClick={onClose}
					sx={{
						borderRadius: 2,
						fontWeight: 600,
						textTransform: 'none',
						fontSize: '0.95rem',
						px: 3,
					}}
				>
					Cancel
				</Button>
				<Button
					type='submit'
					variant='contained'
					sx={{
						borderRadius: 2,
						fontWeight: 800,
						fontSize: '1rem',
						textTransform: 'none',
						bgcolor: '#1565c0',
						color: '#fff',
						boxShadow: 'none',
						px: 3,
						'&:hover': {
							backgroundColor: '#0d47a1',
							boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
						},
					}}
				>
					{isEditMode ? 'Update Task' : 'Save Task'}
				</Button>
			</Box>
		</Box>
	);
};
