import Image from 'next/image'
import Link from 'next/link'

export const Logos: React.FC = () => {
	return (
		<>
			<Link href="/">
				<Image
					src="/logos/light-logo-villain.svg"
					alt="villain-logo-light"
					width={135}
					height={40}
					className="hidden dark:block"
				/>
				<Image
					src="/logos/dark-logo-villain.svg"
					alt="villain-logo-dark"
					width={135}
					height={40}
					className="dark:hidden"
				/>
			</Link>
		</>
	)
}
