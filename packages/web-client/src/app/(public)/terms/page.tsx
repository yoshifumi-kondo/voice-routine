'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Box, Typography, Button, List, ListItem } from '@mui/joy';

export default function TermsPage() {
	const [termsAgreed, setTermsAgreed] = useState<boolean>(false);

	useEffect(() => {
		const agreed = localStorage.getItem('termsAgreed');
		setTermsAgreed(!!agreed);
	}, []);

	const handleAgree = () => {
		localStorage.setItem('termsAgreed', 'true');
		setTermsAgreed(true);
	};

	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				p: 4,
				backgroundColor: '#f9fafb', 
			}}
		>
			<Box sx={{ width: '100%', maxWidth: 800 }}>
				<Typography level="h1" component="h1" textAlign="center" mb={3}>
					利用規約・プライバシーポリシー
				</Typography>

				{}
				<Box component="section" mb={4}>
					<Typography level="h2" component="h2" mb={2}>
						利用規約
					</Typography>
					<Typography level="body-lg" mb={2}>
						本サービス（以下「本サービス」）は、Zenn
						のハッカソン向けに個人が提供するサービスです。ユーザーは本サービスの利用に際し、以下の利用規約に同意のうえご利用いただくものとします。
					</Typography>
					<List component="ol" sx={{ listStyleType: 'decimal', pl: 2 }}>
						<ListItem component="li" sx={{ display: 'list-item', mb: 1 }}>
							<Typography component="span">
								<strong>定義</strong>:
								「ユーザー」とは、本サービスに登録・利用する全ての個人またはチームを指します。
							</Typography>
						</ListItem>
						<ListItem component="li" sx={{ display: 'list-item', mb: 1 }}>
							<Typography component="span">
								<strong>利用条件</strong>:
								ユーザーは、登録時に提供された情報に変更があった場合、速やかに当方に通知するものとします。
							</Typography>
						</ListItem>
						<ListItem component="li" sx={{ display: 'list-item', mb: 1 }}>
							<Typography component="span">
								<strong>禁止事項</strong>:
								不正行為、第三者への迷惑行為、その他法令または公序良俗に反する行為を禁止します。
							</Typography>
						</ListItem>
						<ListItem component="li" sx={{ display: 'list-item', mb: 1 }}>
							<Typography component="span">
								<strong>免責事項</strong>:
								本サービスの利用により発生した損害について、当方は一切の責任を負いません。ただし、故意または重過失による場合はこの限りではありません。
							</Typography>
						</ListItem>
						<ListItem component="li" sx={{ display: 'list-item', mb: 1 }}>
							<Typography component="span">
								<strong>サービスの変更・終了</strong>:
								当方は、本サービスの内容、提供方法、利用規約の変更、または本サービスの一時停止・終了を予告なく行う権利を有します。
							</Typography>
						</ListItem>
					</List>
				</Box>

				{}
				<Box component="section" mb={4}>
					<Typography level="h2" component="h2" mb={2}>
						個人情報の取扱いについて
					</Typography>
					<Typography level="body-lg" mb={2}>
						当方は、ユーザーの個人情報の保護を最重要視し、以下の方針に基づいて個人情報を適切に管理・利用いたします。
					</Typography>
					<List component="ol" sx={{ listStyleType: 'decimal', pl: 2 }}>
						<ListItem component="li" sx={{ display: 'list-item', mb: 1 }}>
							<Typography component="span">
								<strong>収集する情報</strong>:
								氏名、電話番号、メールアドレス、その他ユーザーが登録時に提供する情報を収集します。
							</Typography>
						</ListItem>
						<ListItem component="li" sx={{ display: 'list-item', mb: 1 }}>
							<Typography component="span">
								<strong>利用目的</strong>:
								ユーザー認証、サービス提供、利用状況の分析、及びサービス向上のために利用いたします。
							</Typography>
						</ListItem>
						<ListItem component="li" sx={{ display: 'list-item', mb: 1 }}>
							<Typography component="span">
								<strong>第三者提供</strong>:
								ユーザーの同意がある場合や、法令に基づく場合を除き、第三者に提供することはありません。
							</Typography>
						</ListItem>
						<ListItem component="li" sx={{ display: 'list-item', mb: 1 }}>
							<Typography component="span">
								<strong>安全管理措置</strong>:
								ユーザー情報の漏洩、改ざん、紛失を防止するために、適切な技術的および組織的措置を講じます。
							</Typography>
						</ListItem>
						<ListItem component="li" sx={{ display: 'list-item', mb: 1 }}>
							<Typography component="span">
								<strong>情報の保存期間および削除</strong>: 本サービスは Zenn
								のハッカソン向けに提供されるものであり、ハッカソンの審査期間が終了したその年内に、登録された個人情報は自動的に削除されるものとします。
							</Typography>
						</ListItem>
					</List>
				</Box>

				{!termsAgreed && (
					<Box textAlign="center">
						<Link href="/auth">
							<Button variant="solid" color="primary" onClick={handleAgree}>
								同意して戻る
							</Button>
						</Link>
					</Box>
				)}
			</Box>
		</Box>
	);
}
