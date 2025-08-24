import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'

interface Props {
	className?: string
}

export const UserInSidebar: React.FC<Props> = ({ className }) => {
	return (
		<Button className="flex justify-start p-7 pl-4" variant="ghost">
			<Avatar className="h-10 w-10">
				<AvatarImage src="https://github.com/tramalretard.png" />
				<AvatarFallback>TR</AvatarFallback>
			</Avatar>
			<div className="flex flex-col items-start">
				<p>tramalretard</p>
				<p className="text-xs text-foreground/50">
					ID: cmeav2enf0000bcdg5nhgll5l
				</p>
			</div>
		</Button>
	)
}
