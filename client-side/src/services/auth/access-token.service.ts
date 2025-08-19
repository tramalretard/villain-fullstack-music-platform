import Cookies from 'js-cookie'

export enum Tokens {
	'ACCESS_TOKEN' = 'accessToken',
	'REFRESH_TOKEN' = 'refreshToken',
}

export const getAccessToken = () => {
	const accessToken = Cookies.get(Tokens.ACCESS_TOKEN)

	return accessToken || null
}

export const saveTokenInStorage = (accessToken: string) => {
	const now = new Date()

	const expiryDate = new Date(now.getTime() + 30 * 60 * 1000)

	Cookies.set(Tokens.ACCESS_TOKEN, accessToken, {
		domain: process.env.APP_DOMAIN,
		sameSite: 'strict',
		expires: expiryDate,
	})
}

export const removeTokenFromStorage = () => {
	Cookies.remove(Tokens.ACCESS_TOKEN)
}
