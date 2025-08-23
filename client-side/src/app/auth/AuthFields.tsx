import { useState } from 'react'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { validateEmail, validatePassword } from '@/lib/regex'
import { IAuthForm } from '@/types/auth.interface'
import { UseFormReturn } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'

interface Props {
	form: UseFormReturn<IAuthForm, any, undefined>
	isPending: boolean
	isRegistration: boolean
}

export const AuthFields: React.FC<Props> = ({ form, isPending }) => {
	const [showPassword, setShowPassword] = useState(false)

	return (
		<>
			<FormField
				control={form.control}
				name="email"
				rules={{
					required: 'Обязательно укажите почту',
					pattern: {
						value: validateEmail,
						message: 'Введите корректную почту',
					},
				}}
				render={({ field }) => (
					<FormItem>
						<FormLabel>Email</FormLabel>
						<FormControl>
							<Input
								{...field}
								placeholder="helloworld@email.com"
								type="email"
								disabled={isPending}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="password"
				rules={{
					required: 'Обязательно укажите пароль',
					pattern: {
						value: validatePassword,
						message:
							'Пароль должен содержать минимум 8 символов, включая заглавную и строчную буквы, цифру и спецсимвол',
					},
				}}
				render={({ field }) => (
					<FormItem>
						<FormLabel>Пароль</FormLabel>
						<div className="relative">
							<FormControl>
								<Input
									{...field}
									placeholder="********"
									type={showPassword ? 'text' : 'password'}
									disabled={isPending}
									className="pr-10"
								/>
							</FormControl>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground cursor-pointer"
								aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
							>
								{showPassword ? (
									<Eye className="h-5 w-5" />
								) : (
									<EyeOff className="h-5 w-5" />
								)}
							</button>
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	)
}
