import { Home, ListMusic } from 'lucide-react'

import React from 'react'
import { ActiveTab } from './sidebar'
import { SidebarMenuItem } from './sidebar-menu-item'
import { FavoritesAccordion } from './favorites-accordion'

interface Props {
	activeTab: ActiveTab
	setActiveTab: (tab: ActiveTab) => void
	isFavoritesOpen: boolean
	setIsFavoritesOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const SidebarMenu: React.FC<Props> = ({
	activeTab,
	setActiveTab,
	isFavoritesOpen,
	setIsFavoritesOpen,
}) => {
	return (
		<div className="min-w-82">
			<div className="space-y-3.5">
				<SidebarMenuItem
					icon={<Home strokeWidth={1} />}
					label="Главная"
					isActive={activeTab === 'home'}
					onClick={() => setActiveTab('home')}
				/>
				<SidebarMenuItem
					icon={<ListMusic strokeWidth={1} />}
					label="Плейлисты"
					isActive={activeTab === 'playlists'}
					onClick={() => setActiveTab('playlists')}
				/>
				<FavoritesAccordion
					isOpen={isFavoritesOpen}
					onToggle={() => setIsFavoritesOpen(prev => !prev)}
					activeTab={activeTab}
					setActiveTab={setActiveTab}
				/>
			</div>
		</div>
	)
}
