'use client'

import { Player } from '@/components/player'
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
				<div className="flex-grow pb-24">{children}</div>
				<Player />
			</section>
		</main>
	)
}
