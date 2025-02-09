
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthState from 'react-firebase-hooks/auth/useAuthState';
import {
	Menu,
	Close,
	Home,
	Task,
	Schedule,
	PhoneCallback,
	Settings,
} from '@mui/icons-material';
import {
	Sheet,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemContent,
	ListItemDecorator,
	Typography,
	Box,
	Drawer,
	Stack,
} from '@mui/joy';
import { auth } from '@/libs/firebase';

export default function AuthenticatedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const router = useRouter();
	const [user, loading] = useAuthState(auth);

	useEffect(() => {
		if (!loading && !user) {
			router.push('/auth');
		}
	}, [user, loading, router]);

	const menuItems = [
		{ href: '/', icon: <Home />, label: 'ホーム' },
		{ href: '/tasks', icon: <Task />, label: 'タスク管理' },
		{ href: '/call-settings', icon: <Schedule />, label: '電話日時設定' },
		{ href: '/try-call', icon: <PhoneCallback />, label: '通話確認' },
		{ href: '/settings', icon: <Settings />, label: 'アカウント設定' },
	];

	if (loading) {
		return (
			<Box
				sx={{
					minHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Typography level="h3">Loading...</Typography>
			</Box>
		);
	}

	if (!user) return null;

	return (
		<Box sx={{ minHeight: '100vh', bgcolor: 'background.body' }}>
			{}
			<Sheet
				sx={{
					position: 'fixed',
					top: 0,
					width: '100%',
					zIndex: 9999,
					p: 2,
					borderBottom: '1px solid',
					borderColor: 'divider',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 2,
				}}
			>
				<Link href="/" style={{ textDecoration: 'none' }}>
					<Typography level="h4" sx={{ color: 'primary.main' }}>
						Voice routine
					</Typography>
				</Link>

				{}
				<IconButton
					variant="outlined"
					color="neutral"
					onClick={() => setIsMenuOpen(true)}
					sx={{ display: { sm: 'none' } }}
				>
					<Menu />
				</IconButton>

				{}
				<List
					orientation="horizontal"
					sx={{
						display: { xs: 'none', sm: 'flex' },
						gap: 2,
					}}
				>
					{menuItems.map((item) => (
						<ListItem key={item.href}>
							<Link href={item.href} style={{ textDecoration: 'none' }}>
								<ListItemButton>
									<ListItemDecorator>{item.icon}</ListItemDecorator>
									<ListItemContent>{item.label}</ListItemContent>
								</ListItemButton>
							</Link>
						</ListItem>
					))}
				</List>
			</Sheet>

			{}
			<Drawer
				variant="plain"
				open={isMenuOpen}
				onClose={() => setIsMenuOpen(false)}
				sx={{ display: { sm: 'none' } }}
			>
				<Box
					sx={{
						minWidth: 260,
						p: 2,
					}}
				>
					<Stack spacing={2}>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
							}}
						>
							<Typography level="h4">メニュー</Typography>
							<IconButton
								variant="plain"
								color="neutral"
								onClick={() => setIsMenuOpen(false)}
							>
								<Close />
							</IconButton>
						</Box>

						<List
							size="sm"
							sx={{
								'--ListItem-radius': '8px',
								'--List-gap': '8px',
							}}
						>
							{menuItems.map((item) => (
								<ListItem key={item.href}>
									<Link
										href={item.href}
										style={{ textDecoration: 'none', width: '100%' }}
										onClick={() => setIsMenuOpen(false)}
									>
										<ListItemButton>
											<ListItemDecorator>{item.icon}</ListItemDecorator>
											<ListItemContent>{item.label}</ListItemContent>
										</ListItemButton>
									</Link>
								</ListItem>
							))}
						</List>
					</Stack>
				</Box>
			</Drawer>

			{}
			<Box
				component="main"
				sx={{
					pt: { xs: 8, sm: 9 },
					pb: 4,
					px: 2,
					maxWidth: '1200px',
					mx: 'auto',
				}}
			>
				{children}
			</Box>
		</Box>
	);
}
