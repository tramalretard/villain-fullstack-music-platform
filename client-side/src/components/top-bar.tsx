import { Input } from './ui/input'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from './ui/button'
import { Logos } from './logos'
import { Search } from 'lucide-react'

interface Props {
	className?: string
}

export const TopBar: React.FC<Props> = ({ className }) => {
	return (
		<div
			className={cn(
				'flex items-center justify-between bg-foreground/5 p-3.5 rounded-sm',
				className
			)}
		>
			<Logos />
			<div className="relative w-[750px]">
				<Search
					className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
					strokeWidth={1}
				/>
				<Input placeholder="Поиск..." className="pl-10" />
			</div>
			<div className="space-x-10">
				<Link href="#" className="text-foreground/50">
					Исполнителям
				</Link>
				<Button className="min-w-35">Войти</Button>
			</div>
		</div>
	)
}
