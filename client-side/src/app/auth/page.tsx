import type { Metadata } from 'next'
import { Auth } from './Auth'
import { NO_INDEX_PAGE } from '@/constants/seo-constants'
import { TopBarAuth } from '@/components/top-bar-auth'

export const metadata: Metadata = {
	title: 'Авторизация',
	...NO_INDEX_PAGE,
}

export default function AuthPage() {
	return (
		<>
			<TopBarAuth />
			<Auth />
		</>
	)
}
