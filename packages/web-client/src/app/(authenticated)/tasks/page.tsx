'use client';

import { useState } from 'react';
import {
	Sheet,
	Typography,
	Input,
	Button,
	List,
	ListItem,
	ListItemContent,
	Checkbox,
	IconButton,
	Stack,
	Box,
	LinearProgress,
} from '@mui/joy';
import { Edit, Delete, Save, Cancel } from '@mui/icons-material';
import type { SxProps } from '@mui/joy/styles/types';
import {
	useTaskControllerGetTasks,
	useTaskControllerCreateTask,
	useTaskControllerUpdateTask,
	useTaskControllerDeleteTask,
} from '@/generated/endpoints';

type Task = {
	id: string;
	description: string;
	completed: boolean;
};

function TaskItem({ task, onMutate }: { task: Task; onMutate: () => void }) {
	const { trigger: updateTask } = useTaskControllerUpdateTask(task.id);
	const { trigger: deleteTask } = useTaskControllerDeleteTask(task.id);
	const [isEditing, setIsEditing] = useState(false);
	const [editText, setEditText] = useState(task.description);

	const handleToggleComplete = async () => {
		try {
			await updateTask({ completed: !!task.completed });
			onMutate();
		} catch (err) {
			console.error(err);
		}
	};

	const handleSaveEdit = async () => {
		try {
			await updateTask({ description: editText });
			setIsEditing(false);
			onMutate();
		} catch (err) {
			console.error(err);
		}
	};

	const handleDelete = async () => {
		if (window.confirm('このタスクを削除してもよろしいですか？')) {
			try {
				await deleteTask();
				onMutate();
			} catch (err) {
				console.error(err);
			}
		}
	};

	return (
		<ListItem
			sx={{
				py: 1,
				px: 2,
				borderRadius: 'sm',
				':hover': {
					bgcolor: 'background.level1',
				},
			}}
		>
			<Checkbox
				checked={task.completed}
				onChange={handleToggleComplete}
				sx={{ mr: 2 }}
			/>
			<ListItemContent>
				{isEditing ? (
					<Input
						value={editText}
						onChange={(e) => setEditText(e.target.value)}
						size="sm"
						sx={{ flex: 1 }}
					/>
				) : (
					<Typography
						sx={{
							textDecoration: task.completed ? 'line-through' : 'none',
							color: task.completed ? 'neutral.500' : 'text.primary',
						}}
					>
						{task.description}
					</Typography>
				)}
			</ListItemContent>
			<Stack direction="row" spacing={1}>
				{isEditing ? (
					<>
						<IconButton
							size="sm"
							variant="plain"
							color="success"
							onClick={handleSaveEdit}
						>
							<Save />
						</IconButton>
						<IconButton
							size="sm"
							variant="plain"
							color="neutral"
							onClick={() => {
								setIsEditing(false);
								setEditText(task.description);
							}}
						>
							<Cancel />
						</IconButton>
					</>
				) : (
					<IconButton
						size="sm"
						variant="plain"
						color="primary"
						onClick={() => setIsEditing(true)}
					>
						<Edit />
					</IconButton>
				)}
				<IconButton
					size="sm"
					variant="plain"
					color="danger"
					onClick={handleDelete}
				>
					<Delete />
				</IconButton>
			</Stack>
		</ListItem>
	);
}

export default function TasksPage() {
	const { data, error, mutate } = useTaskControllerGetTasks();
	const createTaskMutation = useTaskControllerCreateTask();
	const [newTask, setNewTask] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleAddTask = async () => {
		if (!newTask.trim()) return;
		setIsLoading(true);
		try {
			await createTaskMutation.trigger({ description: newTask });
			setNewTask('');
			mutate();
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleAddTask();
		}
	};

	const tasks = Array.isArray(data) ? (data as Task[]) : [];
	const completedTasks = tasks.filter((task) => task.completed).length;
	const progress =
		tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

	const containerSx: SxProps = {
		mt: 4,
		maxWidth: '800px',
		mx: 'auto',
		borderRadius: 'md',
		p: 3,
	};

	return (
		<Sheet variant="outlined" sx={containerSx}>
			<Typography level="h2" sx={{ mb: 2, textAlign: 'center' }}>
				タスク管理
			</Typography>

			{tasks.length > 0 && (
				<Box sx={{ mb: 3 }}>
					<Typography level="body-sm" sx={{ mb: 1 }}>
						進捗状況: {completedTasks} / {tasks.length} タスク完了
					</Typography>
					<LinearProgress
						determinate
						value={progress}
						thickness={8}
						variant="soft"
						color="primary"
						sx={{ borderRadius: 'md' }}
					/>
				</Box>
			)}

			<Stack direction="row" spacing={1} sx={{ mb: 3 }}>
				<Input
					placeholder="新しいタスクを入力"
					value={newTask}
					onChange={(e) => setNewTask(e.target.value)}
					onKeyPress={handleKeyPress}
					sx={{ flex: 1 }}
				/>
				<Button onClick={handleAddTask} disabled={!newTask.trim() || isLoading}>
					{isLoading ? '追加中...' : '追加'}
				</Button>
			</Stack>

			{!!error && (
				<Typography
					color="danger"
					level="body-sm"
					sx={{ textAlign: 'center', mb: 2 }}
				>
					タスクの取得に失敗しました。
				</Typography>
			)}

			<List
				variant="outlined"
				sx={{
					bgcolor: 'background.surface',
					borderRadius: 'sm',
					'--List-decoratorSize': '48px',
				}}
			>
				{tasks.map((task) => (
					<TaskItem key={task.id} task={task} onMutate={mutate} />
				))}
				{tasks.length === 0 && (
					<ListItem>
						<ListItemContent>
							<Typography level="body-sm" sx={{ textAlign: 'center' }}>
								タスクがありません
							</Typography>
						</ListItemContent>
					</ListItem>
				)}
			</List>
		</Sheet>
	);
}
