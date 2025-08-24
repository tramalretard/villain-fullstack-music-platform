'use client'

import { Sidebar } from '@/components/sidebar/sidebar'
import { TopBar } from '@/components/top-bar'

export default function HomeLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<main>
			<TopBar />
			<section className="flex">
				<Sidebar />
				<div>{children}</div>
			</section>
		</main>
	)
}
