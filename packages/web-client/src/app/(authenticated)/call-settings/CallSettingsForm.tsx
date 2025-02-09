'use client';

import React, { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
	Typography,
	Button,
	FormControl,
	FormLabel,
	Select,
	Option,
	Stack,
	Alert,
} from '@mui/joy';
import { Schedule } from '@mui/icons-material';
import { useCallScheduleControllerUpdateCallSchedule } from '@/generated/endpoints';

const timeZones = ['Asia/Tokyo'];

type FormValues = {
	taskCreationCallTimeUTC: string;
	taskConfirmCallTimeUTC: string;
	callTimeZone: string;
};

interface CallSettingsFormProps {
	schedule: FormValues;
	refreshSchedule: () => void;
}

export const CallSettingsForm: React.FC<CallSettingsFormProps> = ({
	schedule,
	refreshSchedule,
}) => {
	const { control, handleSubmit } = useForm<FormValues>({
		defaultValues: schedule,
	});

	const updateCallScheduleMutation =
		useCallScheduleControllerUpdateCallSchedule();
	const [message, setMessage] = useState<{
		type: 'success' | 'error';
		text: string;
	} | null>(null);

	
	const timeOptions = useMemo(() => {
		const options = [];
		for (let hour = 0; hour < 24; hour++) {
			for (let minute = 0; minute < 60; minute += 15) {
				const formattedHour = hour.toString().padStart(2, '0');
				const formattedMinute = minute.toString().padStart(2, '0');
				options.push({
					value: `${formattedHour}:${formattedMinute}`,
					label: `${formattedHour}:${formattedMinute}`,
				});
			}
		}
		return options;
	}, []);

	const onSubmit = async (data: FormValues) => {
		try {
			await updateCallScheduleMutation.trigger(data);
			setMessage({ type: 'success', text: '設定が更新されました' });
			refreshSchedule();
		} catch (err) {
			console.error(err);
			setMessage({ type: 'error', text: '設定の更新に失敗しました' });
		}
	};

	return (
		<Stack spacing={3}>
			<Stack
				direction="row"
				spacing={1}
				alignItems="center"
				justifyContent="center"
			>
				<Schedule sx={{ fontSize: 30, color: 'primary.main' }} />
				<Typography level="h2">電話日時設定</Typography>
			</Stack>

			<form onSubmit={handleSubmit(onSubmit)}>
				<Stack spacing={3}>
					{}
					<Controller
						name="taskCreationCallTimeUTC"
						control={control}
						render={({ field: { onChange, value, ...restField } }) => (
							<FormControl>
								<FormLabel>タスク作成コール時間</FormLabel>
								<Select
									{...restField}
									value={value || ''}
									placeholder={value || '時間を選択'}
									onChange={(_event, newValue) => onChange(newValue)}
								>
									{timeOptions.map((option) => (
										<Option key={option.value} value={option.value}>
											{option.label}
										</Option>
									))}
								</Select>
							</FormControl>
						)}
					/>

					{/* タスク確認コール時間 */}
					<Controller
						name="taskConfirmCallTimeUTC"
						control={control}
						render={({ field: { onChange, value, ...restField } }) => (
							<FormControl>
								<FormLabel>タスク確認コール時間</FormLabel>
								<Select
									{...restField}
									value={value || ''}
									placeholder={value || '時間を選択'}
									onChange={(_event, newValue) => onChange(newValue)}
								>
									{timeOptions.map((option) => (
										<Option key={option.value} value={option.value}>
											{option.label}
										</Option>
									))}
								</Select>
							</FormControl>
						)}
					/>

					{/* コールタイムゾーン */}
					<Controller
						name="callTimeZone"
						control={control}
						render={({ field: { onChange, value, ...restField } }) => (
							<FormControl>
								<FormLabel>コールタイムゾーン</FormLabel>
								<Select
									{...restField}
									value={value || ''}
									placeholder="選択してください"
									onChange={(_event, newValue) => onChange(newValue)}
								>
									{timeZones.map((zone) => (
										<Option key={zone} value={zone}>
											{zone}
										</Option>
									))}
								</Select>
							</FormControl>
						)}
					/>

					<Button
						type="submit"
						loading={updateCallScheduleMutation.isMutating}
						loadingPosition="start"
						variant="solid"
						size="lg"
					>
						設定を更新
					</Button>
				</Stack>
			</form>

			{message && (
				<Alert
					variant="soft"
					color={message.type === 'success' ? 'success' : 'danger'}
					sx={{ mt: 2 }}
				>
					{message.text}
				</Alert>
			)}
		</Stack>
	);
};
