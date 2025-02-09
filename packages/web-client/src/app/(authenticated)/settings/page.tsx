
'use client';

import { useState } from 'react';
import {
	Box,
	Typography,
	Card,
	Stack,
	Divider,
	Button,
	Modal,
	ModalDialog,
	ModalClose,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/joy';
import { ExitToApp, DeleteForever } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { auth } from '@/libs/firebase';
import { useUserControllerResignUser } from '@/generated/endpoints';
import Link from 'next/link';
import { SxProps } from '@mui/joy/styles/types';

export default function SettingsPage() {
	const [openResignModal, setOpenResignModal] = useState(false);
	const {
		trigger: resignTrigger,
		isMutating,
		error,
	} = useUserControllerResignUser();
	const router = useRouter();

	const handleSignOut = async () => {
		try {
			await auth.signOut();
			router.push('/auth');
		} catch (error) {
			console.error('Sign out error:', error);
		}
	};

	const handleResign = async () => {
		try {
			await resignTrigger();
			await auth.signOut();
			router.push('/auth');
		} catch (err) {
			console.error('退会処理中にエラーが発生しました:', err);
		}
	};

	const containerSx: SxProps = {
		mt: 4,
		maxWidth: '400px',
		mx: 'auto',
		borderRadius: 'md',
		p: 3,
	};

	return (
		<>
			{}
			<Card variant="outlined" sx={containerSx}>
				<Typography level="h4">アカウント操作</Typography>
				<Divider sx={{ my: 2 }} />
				<Stack spacing={2}>
					<Button
						variant="outlined"
						color="neutral"
						startDecorator={<ExitToApp />}
						onClick={handleSignOut}
					>
						サインアウト
					</Button>
					<Button
						variant="outlined"
						color="danger"
						startDecorator={<DeleteForever />}
						onClick={() => setOpenResignModal(true)}
						disabled={isMutating}
					>
						アカウント削除
					</Button>

					<Box textAlign="center" mt={2}>
						<Link href="/terms">利用規約・プライバシーポリシー</Link>
					</Box>
				</Stack>
			</Card>

			<Modal open={openResignModal} onClose={() => setOpenResignModal(false)}>
				<ModalDialog variant="outlined" role="alertdialog">
					<ModalClose />
					<DialogTitle>
						<Typography level="h4" color="danger">
							アカウント削除の確認
						</Typography>
					</DialogTitle>
					<Divider />
					<DialogContent>
						<Typography level="body-md" sx={{ mb: 2 }}>
							アカウントを削除すると、以下のデータが完全に削除されます：
						</Typography>
						<Stack spacing={1} sx={{ ml: 2 }}>
							<Typography level="body-sm">• すべてのタスクデータ</Typography>
							<Typography level="body-sm">• 電話設定</Typography>
							<Typography level="body-sm">• その他のアカウント情報</Typography>
						</Stack>
						<Typography level="body-md" sx={{ mt: 2, color: 'danger.500' }}>
							この操作は取り消すことができません。
						</Typography>
					</DialogContent>
					<DialogActions>
						<Button
							variant="plain"
							color="neutral"
							onClick={() => setOpenResignModal(false)}
						>
							キャンセル
						</Button>
						<Button
							variant="solid"
							color="danger"
							onClick={handleResign}
							loading={isMutating}
						>
							削除を確定
						</Button>
					</DialogActions>
				</ModalDialog>
			</Modal>

			{!!error && (
				<Card variant="soft" color="danger" sx={{ mt: 2 }}>
					<Typography>
						エラー: {(error as Error)?.message || '不明なエラー'}
					</Typography>
				</Card>
			)}
		</>
	);
}
