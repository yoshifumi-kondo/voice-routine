
'use client';

import { Box, Typography, Grid, Card, AspectRatio, Button } from '@mui/joy';
import { Task, Schedule, Settings, PhoneCallback } from '@mui/icons-material';
import Link from 'next/link';

const features = [
	{
		title: 'タスク管理',
		description: '電話やUIから作成したタスクの確認・管理ができます',
		icon: <Task sx={{ fontSize: 40 }} />,
		href: '/tasks',
		color: 'primary',
	},
	{
		title: '電話日時設定',
		description: 'タスクの作成と確認の電話日時を設定できます',
		icon: <Schedule sx={{ fontSize: 40 }} />,
		href: '/call-settings',
		color: 'success',
	},
	{
		title: '通話確認',
		description: 'タスク作成・確認用の電話機能をテストできます',
		icon: <PhoneCallback sx={{ fontSize: 40 }} />,
		href: '/try-call',
		color: 'neutral',
	},
	{
		title: 'アカウント設定',
		description: 'アカウントの管理やサインアウトができます',
		icon: <Settings sx={{ fontSize: 40 }} />,
		href: '/settings',
		color: 'warning',
	},
] as const;

export default function AuthHomePage() {
	return (
		<Box>
			{}
			<Box
				sx={{
					textAlign: 'center',
					py: { xs: 4, md: 6 },
				}}
			>
				<Typography
					level="h1"
					sx={{
						fontSize: { xs: '2rem', md: '3rem' },
						mb: 2,
					}}
				>
					Voice routine へようこそ
				</Typography>
				<Typography
					level="body-lg"
					sx={{
						maxWidth: '600px',
						mx: 'auto',
						mb: 4,
						color: 'text.secondary',
					}}
				>
					電話でタスクを作成・管理できる シンプルなタスク管理アプリです
				</Typography>
			</Box>

			{}
			<Grid
				container
				spacing={2}
				sx={{
					maxWidth: '900px',
					mx: 'auto',
					px: { xs: 2, sm: 4 },
				}}
			>
				{features.map((feature) => (
					<Grid key={feature.title} xs={12} sm={6}>
						<Card
							variant="outlined"
							sx={{
								height: '100%',
								transition: 'transform 0.2s, box-shadow 0.2s',
								':hover': {
									transform: 'translateY(-4px)',
									boxShadow: 'md',
								},
							}}
						>
							<AspectRatio
								ratio="1"
								sx={{
									width: 50,
									bgcolor: `${feature.color}.softBg`,
									borderRadius: 'sm',
									mb: 2,
								}}
							>
								{feature.icon}
							</AspectRatio>
							<Typography level="h4" component="h3" sx={{ mb: 1 }}>
								{feature.title}
							</Typography>
							<Typography
								level="body-sm"
								sx={{
									mb: 2,
									color: 'text.secondary',
								}}
							>
								{feature.description}
							</Typography>
							<Link href={feature.href} style={{ textDecoration: 'none' }}>
								<Button variant="solid" color={feature.color} fullWidth>
									開く
								</Button>
							</Link>
						</Card>
					</Grid>
				))}
			</Grid>
		</Box>
	);
}
