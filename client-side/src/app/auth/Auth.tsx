'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { useAuthForm } from '@/hooks/useAuthForm'
import React from 'react'
import { AuthFields } from './AuthFields'
import { SocialMedia } from './SocialMedia'

export const Auth: React.FC = ({}) => {
	const [isRegistration, setIsRegistration] = React.useState(false)

	const { onSubmit, form, isPending } = useAuthForm(isRegistration)

	return (
		<div className="flex items-center pt-30 justify-center bg-background">
			<Card className="flex justify-center items-center border-none p-10 w-[840px] h-[600px] bg-foreground/5">
				<CardHeader className="text-center w-full">
					<CardTitle className="text-2xl font-bold">
						{isRegistration ? 'Зарегистрировать аккаунт' : 'Войти в аккаунт'}
					</CardTitle>
				</CardHeader>
				<CardContent className="w-[500px]">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<AuthFields
								form={form}
								isPending={isPending}
								isRegistration={isRegistration}
							/>
							<Button disabled={isPending} className="w-full h-10">
								{isRegistration ? 'Регистрация' : 'Вход'}
							</Button>
						</form>
					</Form>
					<SocialMedia className="space-y-3 w-full pt-8" />
				</CardContent>
				<CardFooter className="flex justify-center pt-4 text-sm">
					<Button
						variant="link"
						onClick={() => setIsRegistration(!isRegistration)}
						className="cursor-pointer font-medium text-foreground/50"
					>
						{isRegistration ? 'или войдите' : 'или зарегистрируйтесь'}
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}
