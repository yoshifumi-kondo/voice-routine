'use client';

import { useState, useEffect } from 'react';
import {
	getAuth,
	signInWithPhoneNumber,
	RecaptchaVerifier,
	signInWithCredential,
	PhoneAuthProvider,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { app, auth } from '@/libs/firebase';
import { signIn } from 'next-auth/react';
import { Box, Card, Typography, Button, Input, Link } from '@mui/joy';
import {
	userControllerGetUser,
	useUserControllerSignUp,
} from '@/generated/endpoints';
import useAuthState from 'react-firebase-hooks/auth/useAuthState';

export default function LoginPage() {
	const [phoneNumber, setPhoneNumber] = useState('');
	const [verificationId, setVerificationId] = useState('');
	const [otp, setOtp] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isNewUser, setIsNewUser] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();
	const { trigger: signUp } = useUserControllerSignUp();
	const [user] = useAuthState(auth);

	// 利用規約の同意状態を確認し、未同意なら /terms へリダイレクト
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const termsAgreed = localStorage.getItem('termsAgreed');
			if (termsAgreed !== 'true') {
				router.push('/terms');
			}
		}
	}, [router]);

	
	useEffect(() => {
		if (user) {
			router.push('/');
		}
	}, [user, router]);

	
	const formatPhoneNumber = (number: string) =>
		number.startsWith('0') ? `+81${number.slice(1)}` : number;

	const handleSendOTP = async () => {
		setIsLoading(true);
		setError('');

		try {
			const auth = getAuth(app);
			const recaptchaVerifier = new RecaptchaVerifier(
				auth,
				'recaptcha-container',
				{ size: 'invisible' },
			);
			await recaptchaVerifier.render();

			const formattedPhone = formatPhoneNumber(phoneNumber);
			const confirmationResult = await signInWithPhoneNumber(
				auth,
				formattedPhone,
				recaptchaVerifier,
			);
			setVerificationId(confirmationResult.verificationId);
		} catch (error) {
			console.error(error);
			setError('認証コードの送信に失敗しました');
		} finally {
			setIsLoading(false);
		}
	};

	const handleVerifyOTP = async () => {
		setIsLoading(true);
		setError('');

		try {
			const auth = getAuth(app);
			const credential = PhoneAuthProvider.credential(verificationId, otp);
			const userCredential = await signInWithCredential(auth, credential);
			const idToken = await userCredential.user.getIdToken();

			if (isNewUser) {
				await signUp({ token: idToken });
			}

			const user = await userControllerGetUser();
			if (!user) {
				await auth.signOut();
				setError('ユーザーが見つかりません');
				return;
			}

			const result = await signIn('credentials', {
				token: idToken,
				redirect: false,
			});
			if (result?.error) {
				setError('認証に失敗しました');
			} else {
				router.push('/');
			}
		} catch (error) {
			console.error(error);
			setError('認証に失敗しました');
		} finally {
			setIsLoading(false);
		}
	};

	
	if (user) {
		return null;
	}

	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				p: 2,
				bgcolor: 'background.body',
			}}
		>
			<Card
				variant="outlined"
				sx={{
					width: '100%',
					maxWidth: 400,
					p: 3,
					borderRadius: 'md',
					boxShadow: 'md',
				}}
			>
				<Typography level="h3" textAlign="center" mb={3}>
					{isNewUser ? '新規登録' : 'ログイン'}
				</Typography>
				{!verificationId ? (
					<>
						<Input
							type="tel"
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(e.target.value)}
							placeholder="電話番号 (例: 09012345678)"
							sx={{ mb: 2 }}
						/>
						{}
						<Box id="recaptcha-container" sx={{ mb: 2 }} />
						<Button
							onClick={handleSendOTP}
							disabled={isLoading || !phoneNumber}
							fullWidth
							sx={{ mb: 1 }}
						>
							{isLoading ? '送信中...' : '認証コードを送信'}
						</Button>
						<Button
							onClick={() => setIsNewUser(!isNewUser)}
							variant="outlined"
							fullWidth
						>
							{isNewUser ? 'ログインへ' : '新規登録へ'}
						</Button>
					</>
				) : (
					<>
						<Input
							type="text"
							value={otp}
							onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, ''))}
							placeholder="認証コード (6桁)"
							slotProps={{ input: { maxLength: 6 } }}
							sx={{ mb: 2 }}
						/>
						<Button
							onClick={handleVerifyOTP}
							disabled={isLoading || otp.length !== 6}
							fullWidth
						>
							{isLoading ? '認証中...' : isNewUser ? '登録' : 'ログイン'}
						</Button>
					</>
				)}
				{error && (
					<Typography level="body-sm" color="danger" textAlign="center" mt={2}>
						{error}
					</Typography>
				)}
				<Box textAlign="center" mt={2}>
					<Link
						onClick={() => router.push('/terms')}
						sx={{ cursor: 'pointer' }}
					>
						利用規約・プライバシーポリシー
					</Link>
				</Box>
			</Card>
		</Box>
	);
}
