import { cn } from '@/lib/utils'
import { useState } from 'react'
import { UserInSidebar } from './user-in-sidebar'
import { ButtonSidebar } from './button-sidebar'
import { SidebarMenu } from './sidebar-menu'

interface Props {
	className?: string
}

export type ActiveTab = 'home' | 'playlists' | 'fav-tracks' | 'fav-albums'

export const Sidebar: React.FC<Props> = ({ className }) => {
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [activeTab, setActiveTab] = useState<ActiveTab>('home')
	const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)

	return (
		<div className={cn('flex transition-all duration-300 ease-in-out')}>
			<div
				className={cn(
					'flex flex-col justify-between bg-foreground/3 rounded-sm rounded-r-none overflow-hidden',
					'transition-all duration-300 ease-in-out',
					isCollapsed ? 'w-0 p-0' : 'w-87 p-2.5',
					className
				)}
			>
				<SidebarMenu
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					isFavoritesOpen={isFavoritesOpen}
					setIsFavoritesOpen={setIsFavoritesOpen}
				/>

				<UserInSidebar />
			</div>
			<ButtonSidebar
				isCollapsed={isCollapsed}
				setIsCollapsed={setIsCollapsed}
			/>
		</div>
	)
}
