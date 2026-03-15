import React, {
	forwardRef,
	useMemo,
	useState,
	useEffect,
	useCallback,
	useRef,
} from 'react';
import { FixedSizeList as List } from 'react-window';

import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import {
	Box,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Chip,
	OutlinedInput,
	type SelectChangeEvent,
	Typography,
	Paper,
	useMediaQuery,
	useTheme,
	ToggleButton,
	ToggleButtonGroup,
} from '@mui/material';

import { TASK_PRIORITIES, TASK_STATUSES } from 'src/constants/task';
import { TaskCard } from 'src/features/task/components/TaskCard';
import { useTaskStore } from 'src/features/task/store/taskStore';
import type {
	FilterState,
	Task,
	TaskPriority,
	TaskStatus,
} from 'src/features/task/types/types';
import { kebabToTitleCase } from 'src/utils/formatter';
import { getFilterState, saveFilterState } from 'src/utils/storage';
import {
	filterByPriority,
	filterTasksByStatus,
	searchTasks,
} from 'src/utils/task';

type ViewMode = 'list' | 'grid';

const SCROLL_PADDING = 8;

const innerElementType = forwardRef<
	HTMLDivElement,
	{ style?: React.CSSProperties }
>(({ style, ...rest }, ref) => (
	<div
		ref={ref}
		style={{
			...style,
			height:
				typeof style?.height === 'number'
					? style.height + SCROLL_PADDING
					: style?.height,
		}}
		{...rest}
	/>
));
innerElementType.displayName = 'ListInnerElement';

const VirtualizedTaskItem: React.FC<{
	index: number;
	style: React.CSSProperties;
	data: Task[];
}> = ({ index, style, data }) => {
	const task = data[index];
	if (!task) return null;
	return (
		<Box
			style={{ ...style, top: (style.top as number) + SCROLL_PADDING }}
			sx={{ px: 1, pr: 2 }}
		>
			<TaskCard task={task} variant='list' />
		</Box>
	);
};

export const TaskList: React.FC = () => {
	const tasks = useTaskStore((state) => state.tasks);
	const theme = useTheme();
	const containerRef = useRef<HTMLDivElement>(null);

	const isSmallScreen = useMediaQuery('(max-width: 425px)');
	const itemHeight = isSmallScreen ? 185 : 160;

	const [listHeight, setListHeight] = useState(600);
	const [viewMode, setViewMode] = useState<ViewMode>('list');

	const [filterState, setFilterState] = useState<FilterState>(() => {
		const saved = getFilterState();
		return {
			statuses: saved?.statuses || [],
			priorities: saved?.priorities || [],
			searchQuery: saved?.searchQuery || '',
		};
	});

	const [searchQuery, setSearchQuery] = useState<string>(
		filterState.searchQuery,
	);

	const filteredTasks = useMemo(() => {
		let result = [...tasks];
		result = filterTasksByStatus(result, filterState.statuses);
		result = filterByPriority(result, filterState.priorities);
		result = searchTasks(result, filterState.searchQuery);
		// Default ordering: newest first by createdAt
		result = result.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() -
				new Date(a.createdAt).getTime(),
		);
		return result;
	}, [tasks, filterState]);

	const handleStatusChange = useCallback(
		(event: SelectChangeEvent<TaskStatus[]>) => {
			const value = event.target.value;
			setFilterState((prev) => ({
				...prev,
				statuses:
					typeof value === 'string' ? [value as TaskStatus] : value,
			}));
		},
		[],
	);

	const handlePriorityChange = useCallback(
		(event: SelectChangeEvent<TaskPriority[]>) => {
			const value = event.target.value;
			setFilterState((prev) => ({
				...prev,
				priorities:
					typeof value === 'string' ? [value as TaskPriority] : value,
			}));
		},
		[],
	);

	const handleSearchInputChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setSearchQuery(event.target.value);
		},
		[],
	);

	const debouncedSearch = useCallback((value: string) => {
		setFilterState((prev) => ({ ...prev, searchQuery: value }));
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			debouncedSearch(searchQuery);
		}, 300);
		return () => clearTimeout(timer);
	}, [searchQuery, debouncedSearch]);

	useEffect(() => {
		saveFilterState(filterState);
	}, [filterState]);

	useEffect(() => {
		if (tasks.length === 0) {
			setFilterState({ statuses: [], priorities: [], searchQuery: '' });
			setSearchQuery('');
		}
	}, [tasks.length]);

	useEffect(() => {
		const updateHeight = () => {
			if (containerRef.current) {
				const containerHeight = containerRef.current.clientHeight;
				const paperElement = containerRef.current.querySelector(
					'[class*="MuiPaper"]',
				) as HTMLElement;
				const filterBarHeight = paperElement?.offsetHeight || 0;
				const margins = isSmallScreen ? 24 : 32;
				const calculatedHeight = Math.max(
					containerHeight - filterBarHeight - margins,
					200,
				);
				setListHeight(calculatedHeight);
			} else {
				const offset = window.innerWidth < 600 ? 300 : 280;
				setListHeight(window.innerHeight - offset);
			}
		};

		updateHeight();
		window.addEventListener('resize', updateHeight);
		const resizeObserver = new ResizeObserver(updateHeight);
		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
		}
		return () => {
			window.removeEventListener('resize', updateHeight);
			resizeObserver.disconnect();
		};
	}, [isSmallScreen]);

	return (
		<Box
			ref={containerRef}
			sx={{
				display: 'flex',
				flexDirection: 'column',
				flex: 1,
				minHeight: 0,
			}}
		>
			<Paper
				sx={{
					p: { xs: 1.5, sm: 2 },
					mb: { xs: 2, sm: 2.5 },
					borderRadius: 3,
					boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
					background:
						theme.palette.mode === 'dark'
							? theme.palette.background.paper
							: '#e8edf5',
				}}
			>
				{/* Single row: Search | Status Filter | Priority Filter | View Toggle */}
				<Box
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', sm: 'row' },
						gap: { xs: 1.5, sm: 1.5 },
						alignItems: { sm: 'center' },
					}}
				>
					{/* Search */}
					<TextField
						label='Search Tasks'
						value={searchQuery}
						onChange={handleSearchInputChange}
						placeholder='Search by title or description...'
						size='small'
						sx={{
							flex: { sm: 2, md: 2.5 },
							'& .MuiOutlinedInput-root': { borderRadius: 2 },
						}}
					/>

					{/* Filter by Status */}
					<FormControl
						size='small'
						sx={{
							flex: { sm: 1 },
							minWidth: { xs: '100%', sm: 0 },
						}}
					>
						<InputLabel id='filter-status-label'>Status</InputLabel>
						<Select
							labelId='filter-status-label'
							data-testid='filter-status-select'
							multiple
							value={filterState.statuses}
							onChange={handleStatusChange}
							input={<OutlinedInput label='Status' />}
							MenuProps={{
								PaperProps: {
									sx: {
										bgcolor:
											theme.palette.mode === 'dark'
												? theme.palette.background.paper
												: '#e8edf5',
										borderRadius: 2,
										boxShadow:
											'0 4px 16px rgba(0,0,0,0.12)',
									},
								},
							}}
							renderValue={(selected) => (
								<Box
									sx={{
										display: 'flex',
										flexWrap: 'wrap',
										gap: 0.5,
									}}
								>
									{selected.map((value) => (
										<Chip
											key={value}
											label={kebabToTitleCase(value)}
											size='small'
										/>
									))}
								</Box>
							)}
						>
							{TASK_STATUSES.map((status) => (
								<MenuItem
									key={status}
									value={status}
									data-testid={`filter-status-${status}`}
								>
									{kebabToTitleCase(status)}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{/* Filter by Priority */}
					<FormControl
						size='small'
						sx={{
							flex: { sm: 1 },
							minWidth: { xs: '100%', sm: 0 },
						}}
					>
						<InputLabel id='filter-priority-label'>
							Priority
						</InputLabel>
						<Select
							labelId='filter-priority-label'
							data-testid='filter-priority-select'
							multiple
							value={filterState.priorities}
							onChange={handlePriorityChange}
							input={<OutlinedInput label='Priority' />}
							MenuProps={{
								PaperProps: {
									sx: {
										bgcolor:
											theme.palette.mode === 'dark'
												? theme.palette.background.paper
												: '#e8edf5',
										borderRadius: 2,
										boxShadow:
											'0 4px 16px rgba(0,0,0,0.12)',
									},
								},
							}}
							renderValue={(selected) => (
								<Box
									sx={{
										display: 'flex',
										flexWrap: 'wrap',
										gap: 0.5,
									}}
								>
									{selected.map((value) => (
										<Chip
											key={value}
											label={kebabToTitleCase(value)}
											size='small'
										/>
									))}
								</Box>
							)}
						>
							{TASK_PRIORITIES.map((priority) => (
								<MenuItem
									key={priority}
									value={priority}
									data-testid={`filter-priority-${priority}`}
								>
									{kebabToTitleCase(priority)}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{/* View Toggle */}
					<Box
						sx={{
							border: `1px solid ${
								theme.palette.mode === 'dark'
									? 'rgba(255,255,255,0.23)'
									: 'rgba(0,0,0,0.23)'
							}`,
							borderRadius: 1,
							height: 40,
							display: 'flex',
							alignItems: 'center',
							px: 0.5,
							flexShrink: 0,
							'&:hover': {
								borderColor: theme.palette.text.primary,
							},
						}}
					>
						<ToggleButtonGroup
							value={viewMode}
							exclusive
							onChange={(_, val) => val && setViewMode(val)}
							aria-label='view mode'
							size='small'
							sx={{ border: 'none' }}
						>
							<ToggleButton
								value='list'
								aria-label='list view'
								data-testid='list-view-button'
								sx={{
									border: 'none',
									px: 1.5,
									gap: 0.5,
									py: 0.5,
								}}
							>
								<ViewListIcon fontSize='small' />
								<Typography
									variant='caption'
									sx={{ fontWeight: 600 }}
								>
									List
								</Typography>
							</ToggleButton>
							<ToggleButton
								value='grid'
								aria-label='grid view'
								data-testid='grid-view-button'
								sx={{
									border: 'none',
									px: 1.5,
									gap: 0.5,
									py: 0.5,
								}}
							>
								<GridViewIcon fontSize='small' />
								<Typography
									variant='caption'
									sx={{ fontWeight: 600 }}
								>
									Card
								</Typography>
							</ToggleButton>
						</ToggleButtonGroup>
					</Box>
				</Box>
			</Paper>

			{filteredTasks.length === 0 ? (
				<Box
					sx={{
						textAlign: 'center',
						py: { xs: 4, sm: 6, md: 8 },
						px: { xs: 1, sm: 2 },
						borderRadius: 3,
						background:
							theme.palette.mode === 'dark'
								? theme.palette.background.default
								: '#f0f4fb',
					}}
				>
					<Typography
						variant='h6'
						color='text.secondary'
						sx={{ fontWeight: 600, mb: 1 }}
					>
						No tasks found
					</Typography>
					<Typography
						variant='body2'
						color='text.secondary'
						sx={{ mt: 1, fontSize: '0.95rem' }}
					>
						{tasks.length === 0
							? 'Create your first task using the "Add Task" button above!'
							: 'Try adjusting your filters or search query.'}
					</Typography>
				</Box>
			) : viewMode === 'grid' ? (
				<Box
					sx={{
						overflowY: 'auto',
						flex: 1,
						px: { xs: 1, sm: 1.5 },
						pt: '6px',
					}}
				>
					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: {
								xs: '1fr',
								sm: 'repeat(2, 1fr)',
								md: 'repeat(3, 1fr)',
							},
							gridAutoRows: '1fr',
							gap: 2,
						}}
					>
						{filteredTasks.map((task) => (
							<TaskCard
								key={task.id}
								task={task}
								variant='grid'
							/>
						))}
					</Box>
				</Box>
			) : (
				<Box
					sx={{
						width: '100%',
						flex: 1,
						minHeight: 0,
						'& > div': { width: '100% !important' },
					}}
				>
					<List
						height={listHeight}
						innerElementType={innerElementType}
						itemCount={filteredTasks.length}
						itemSize={itemHeight}
						itemData={filteredTasks}
						width='100%'
					>
						{VirtualizedTaskItem}
					</List>
				</Box>
			)}
		</Box>
	);
};
