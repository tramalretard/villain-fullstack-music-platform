import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { SITE_DESCRIPTION, SITE_NAME } from '@/constants/seo-constants'
import { Toaster } from '@/components/ui/sonner'
import { Providers } from '@/components/providers/query-provider'
import { ThemeProvider } from 'next-themes'
import { ButtonToggleTheme } from '@/components/ui/button-toggle-theme'
import { Container } from '@/components/container'

const montserrat = Montserrat({
	variable: '--font-montserrat',
	subsets: ['cyrillic', 'latin'],
})

export const metadata: Metadata = {
	title: {
		absolute: SITE_NAME,
	},

	description: SITE_DESCRIPTION,
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="ru" suppressHydrationWarning>
			<body className={`${montserrat.variable} $} antialiased`}>
				<Container>
					<Providers>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange
						>
							{children}
							<Toaster />
							<ButtonToggleTheme className="fixed bottom-5 left-5 z-50" />
						</ThemeProvider>
					</Providers>
				</Container>
			</body>
		</html>
	)
}
