import { cn } from '@/lib/utils'
import { AudioLines, ChevronDown, GalleryVerticalEnd, Star } from 'lucide-react'
import { SidebarMenuItem } from './sidebar-menu-item'
import { ActiveTab } from './sidebar'

interface Props {
	isOpen: boolean
	onToggle: () => void
	activeTab: ActiveTab
	setActiveTab: (tab: ActiveTab) => void
}

export const FavoritesAccordion: React.FC<Props> = ({
	isOpen,
	onToggle,
	activeTab,
	setActiveTab,
}) => {
	return (
		<div>
			<div
				onClick={onToggle}
				className="flex items-center justify-between gap-4 p-4 rounded-lg text-foreground/50 cursor-pointer hover:bg-foreground/5"
			>
				<div className="flex items-center gap-4">
					<Star strokeWidth={1} />
					<p>Отмеченное</p>
				</div>
				<ChevronDown
					strokeWidth={1}
					className={cn(
						'transition-transform duration-300',
						isOpen && 'rotate-180'
					)}
				/>
			</div>

			<div
				className={cn(
					'transition-all duration-300 ease-in-out overflow-hidden pl-6',
					isOpen ? 'max-h-40' : 'max-h-0'
				)}
			>
				<div className="space-y-3.5 pt-3.5">
					<SidebarMenuItem
						icon={<AudioLines strokeWidth={1} />}
						label="Треки"
						isActive={activeTab === 'fav-tracks'}
						onClick={() => setActiveTab('fav-tracks')}
						isSubItem
					/>
					<SidebarMenuItem
						icon={<GalleryVerticalEnd strokeWidth={1} />}
						label="Альбомы"
						isActive={activeTab === 'fav-albums'}
						onClick={() => setActiveTab('fav-albums')}
						isSubItem
					/>
				</div>
			</div>
		</div>
	)
}
