'use client';

import { useCallScheduleControllerGetCallSchedule } from '@/generated/endpoints';
import { CircularProgress, Typography, Box, Sheet } from '@mui/joy';
import { CallSettingsForm } from './CallSettingsForm';
import { SxProps } from '@mui/joy/styles/types';

export default function CallSettingsPage() {
	const {
		data: schedule,
		isLoading,
		error,
		mutate: refreshSchedule,
	} = useCallScheduleControllerGetCallSchedule();

	if (isLoading) {
		return (
			<Box
				sx={{
					minHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<CircularProgress size="lg" />
			</Box>
		);
	}

	if (error) {
		return (
			<Typography color="danger" level="h4" sx={{ textAlign: 'center' }}>
				スケジュール取得エラー
			</Typography>
		);
	}

	if (!schedule) {
		return (
			<Typography level="h4" sx={{ textAlign: 'center' }}>
				スケジュールが設定されていません
			</Typography>
		);
	}

	const containerSx: SxProps = {
		mt: 4,
		maxWidth: '400px',
		mx: 'auto',
		borderRadius: 'md',
		p: 3,
	};

	return (
		<Sheet variant="outlined" sx={containerSx}>
			<CallSettingsForm schedule={schedule} refreshSchedule={refreshSchedule} />
		</Sheet>
	);
}
