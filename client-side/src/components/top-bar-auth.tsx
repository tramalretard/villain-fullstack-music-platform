import Image from 'next/image'

export const TopBarAuth: React.FC = () => {
	return (
		<>
			<div className='pt-3.5 pl-3.5'>
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
			</div>
		</>
	)
}
