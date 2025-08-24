import { ChevronLeft } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

interface Props {
	className?: string
	isCollapsed: boolean
	setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

export const ButtonSidebar: React.FC<Props> = ({
	className,
	isCollapsed,
	setIsCollapsed,
}) => {
	return (
		<Button
			onClick={() => setIsCollapsed(!isCollapsed)}
			className="flex justify-center items-center min-h-210 w-12 bg-foreground/3 rounded-l-none hover:bg-foreground/6"
		>
			<ChevronLeft
				strokeWidth={1}
				className={cn(
					'text-foreground transition-transform duration-300 ease-in-out',
					isCollapsed && 'rotate-180'
				)}
			/>
		</Button>
	)
}
