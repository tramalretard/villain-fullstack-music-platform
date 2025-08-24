import { cn } from '@/lib/utils'
import React from 'react'

interface Props {
	icon: React.ReactNode
	label: string
	isActive: boolean
	onClick: () => void
	isSubItem?: boolean
}

export const SidebarMenuItem: React.FC<Props> = ({
	icon,
	label,
	isActive,
	onClick,
	isSubItem = false,
}) => {
	return (
		<div
			onClick={onClick}
			className={cn(
				'flex items-center gap-4 rounded-lg cursor-pointer transition-colors',
				isSubItem ? 'p-3 text-sm' : 'p-4',
				isActive
					? 'bg-foreground/5 text-foreground'
					: 'text-foreground/50 hover:bg-foreground/5'
			)}
		>
			{icon}
			<p>{label}</p>
		</div>
	)
}
