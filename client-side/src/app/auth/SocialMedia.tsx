import { Button } from '@/components/ui/button'
import { SERVER_URL } from '@/config/api.constants'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

interface Props {
	className?: string
}

export const SocialMedia: React.FC<Props> = ({ className }) => {
	const router = useRouter()

	return (
		<div className={className}>
			<Button
				className="w-full"
				variant="outline"
				size="sm"
				onClick={() => router.push(`${SERVER_URL}/api/auth/google`)}
			>
				Продолжить через аккаунт Google
				<FcGoogle />
			</Button>

			<Button
				className="w-full"
				variant="outline"
				size="sm"
				onClick={() => router.push(`${SERVER_URL}/api/auth/github`)}
			>
				Продолжить через аккаунт GitHub
				<FaGithub />
			</Button>
		</div>
	)
}
