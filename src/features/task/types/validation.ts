import * as yup from 'yup';

import { TASK_PRIORITIES, TASK_STATUSES } from 'src/constants/task';

const getTodayLocal = (): Date => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return today;
};

export const TaskCreateValidationSchema = yup.object({
	title: yup.string().required('Title is required').trim(),
	description: yup.string().required('Description is required').trim(),
	dueDate: yup
		.string()
		.required('Due date is required')
		.test('is-valid-date', 'Due date must be today or later', (value) => {
			if (!value) return false;
			const selectedDate = new Date(value);
			selectedDate.setHours(0, 0, 0, 0);
			return selectedDate >= getTodayLocal();
		}),
	status: yup
		.string()
		.oneOf(TASK_STATUSES, 'Invalid status')
		.required('Status is required'),
	priority: yup
		.string()
		.oneOf(TASK_PRIORITIES, 'Invalid priority')
		.required('Priority is required'),
});
