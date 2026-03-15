import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
	Container,
	Box,
	TextField,
	Button,
	Typography,
	Paper,
} from '@mui/material';

import { STORAGE_KEYS } from 'src/constants/task';
import { sessionStorage } from 'src/utils/storage';

export const LandingPage: React.FC = () => {
	const [userName, setUserName] = useState<string>('');
	const navigate = useNavigate();

	const handleContinue = () => {
		if (userName.trim()) {
			sessionStorage.set(STORAGE_KEYS.USER_NAME, userName.trim());
		}
		navigate('/dashboard', { replace: true });
	};

	useEffect(() => {
		sessionStorage.remove(STORAGE_KEYS.USER_NAME);
	}, []);

	return (
		<Box
			sx={{
				minHeight: 'calc(100vh - 64px)',
				display: 'flex',
				alignItems: 'center',
				py: { xs: 2, sm: 4, md: 8 },
				px: { xs: 1, sm: 2 },
			}}
		>
			<Container maxWidth='sm' sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
				<Paper
					elevation={2}
					sx={{
						p: { xs: 3, sm: 4, md: 5 },
						borderRadius: 2,
					}}
				>
					<Box
						sx={{
							textAlign: 'center',
							mb: { xs: 2, sm: 3, md: 4 },
						}}
					>
						<Typography
							variant='h4'
							component='h1'
							gutterBottom
							sx={{
								fontWeight: 700,
								fontSize: {
									xs: '1.5rem',
									sm: '1.75rem',
									md: '2.25rem',
								},
								color: 'primary.main',
							}}
						>
							Task Management Dashboard
						</Typography>
						<Typography
							variant='body1'
							color='text.secondary'
							sx={{ mt: 1 }}
						>
							Welcome! Get started by entering your name
							(optional).
						</Typography>
					</Box>

					<Box sx={{ mb: 3 }}>
						<TextField
							fullWidth
							label='Enter your name'
							value={userName}
							onChange={(e) => setUserName(e.target.value)}
							placeholder='Your name (optional)'
							variant='outlined'
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									handleContinue();
								}
							}}
							data-testid='user-name-input'
						/>
					</Box>

					<Box sx={{ mb: 3 }}>
						<Typography
							variant='caption'
							color='text.secondary'
							sx={{ fontStyle: 'italic' }}
							data-testid='disclaimer'
						>
							* This information is optional and is only used
							within the application. It is not persisted anywhere
							outside of your current session.
						</Typography>
					</Box>

					<Button
						fullWidth
						variant='contained'
						size='large'
						onClick={handleContinue}
						sx={{ fontWeight: 600, py: 1.25 }}
						data-testid='continue-button'
					>
						Continue
					</Button>
				</Paper>
			</Container>
		</Box>
	);
};
