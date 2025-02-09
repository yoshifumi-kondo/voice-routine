'use client';

import React, { useState } from 'react';
import {
	Sheet,
	Typography,
	Button,
	FormControl,
	FormLabel,
	Select,
	Option,
	Stack,
	Alert,
} from '@mui/joy';
import { Phone, PhoneCallback } from '@mui/icons-material';
import { useCallControllerInitiateCallToUser } from '@/generated/endpoints';
import { SxProps } from '@mui/joy/styles/types';

export default function CallInitiateToUserPage() {
	const [callType, setCallType] = useState<'CREATED' | 'CONFIRMED'>('CREATED');
	const { trigger, isMutating, error } = useCallControllerInitiateCallToUser();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await trigger({ type: callType });
			alert('通話リクエストを送信しました');
		} catch (err) {
			console.error(err);
		}
	};

	const getCallTypeInfo = (type: string) => {
		switch (type) {
			case 'CREATED':
				return {
					icon: <Phone />,
					label: 'タスク作成コール',
					description: 'タスクを新規作成するための通話を開始します',
				};
			case 'CONFIRMED':
				return {
					icon: <PhoneCallback />,
					label: 'タスク確認コール',
					description: 'タスクの達成状況を確認するための通話を開始します',
				};
			default:
				return { icon: <Phone />, label: '', description: '' };
		}
	};

	const currentCallType = getCallTypeInfo(callType);

	const containerSx: SxProps = {
		mt: 4,
		maxWidth: '400px',
		mx: 'auto',
		borderRadius: 'md',
		p: 3,
	};
	return (
		<Sheet variant="outlined" sx={containerSx}>
			<form onSubmit={handleSubmit}>
				<Stack spacing={3}>
					<Stack
						direction="row"
						spacing={1}
						alignItems="center"
						justifyContent="center"
					>
						{currentCallType.icon}
						<Typography level="h2">通話確認</Typography>
					</Stack>

					<FormControl>
						<FormLabel>コールタイプ</FormLabel>
						<Select
							value={callType}
							onChange={(_, newValue) =>
								setCallType(newValue as 'CREATED' | 'CONFIRMED')
							}
						>
							<Option value="CREATED">タスク作成コール</Option>
							<Option value="CONFIRMED">タスク確認コール</Option>
						</Select>
					</FormControl>

					<Typography level="body-sm" color="neutral">
						{currentCallType.description}
					</Typography>

					<Button
						type="submit"
						loading={isMutating}
						loadingPosition="start"
						startDecorator={currentCallType.icon}
						size="lg"
					>
						{isMutating ? '送信中...' : '通話リクエスト送信'}
					</Button>
				</Stack>
			</form>

			{!!error && (
				<Alert variant="soft" color="danger" sx={{ mt: 2 }}>
					エラー: {(error as Error)?.message || '不明なエラー'}
				</Alert>
			)}
		</Sheet>
	);
}
