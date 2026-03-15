import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	Typography,
	useTheme,
} from '@mui/material';

import type { IConfirmationDialogProps } from 'src/shared/types/dialogTypes';

export const ConfirmationDialog: React.FC<IConfirmationDialogProps> = ({
	title,
	modalOpen,
	handleModalClose,
	modalContent,
	handleYes,
	handleNo,
}) => {
	const theme = useTheme();

	if (!modalOpen) return null;

	return (
		<Dialog
			PaperProps={{
				sx: {
					borderRadius: 2,
					width: '420px',
					padding: 1,
				},
			}}
			open={modalOpen}
			onClose={handleModalClose ?? handleNo}
		>
			<DialogContent>
				<Typography component='div' fontSize='18px' fontWeight={600}>
					{title}
				</Typography>
				<Box
					sx={{
						borderColor:
							theme.palette.mode === 'dark'
								? theme.palette.error.dark
								: theme.palette.error.light,
						borderRadius: 1,
						borderStyle: 'dashed',
						borderWidth: '1px',
						padding: 2,
						marginTop: 2,
						backgroundColor:
							theme.palette.mode === 'dark'
								? theme.palette.error.dark + '20'
								: '#fdf7f7',
						textAlign: 'center',
					}}
				>
					<Typography
						component='div'
						color='text.secondary'
						fontSize='12px'
					>
						{modalContent}
					</Typography>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button variant='contained' onClick={handleNo}>
					No
				</Button>
				<Button onClick={handleYes} color='error' variant='outlined'>
					Yes
				</Button>
			</DialogActions>
		</Dialog>
	);
};
