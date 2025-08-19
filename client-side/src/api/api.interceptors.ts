import { SERVER_URL } from '@/config/api.constants'
import axios, {
	AxiosError,
	CreateAxiosDefaults,
	InternalAxiosRequestConfig,
} from 'axios'
import {
	getAccessToken,
	removeTokenFromStorage,
} from '@/services/auth/access-token.service'
import { errorCatch, getContentType } from './api.helper'
import { authService } from '@/services/auth/auth.service'

declare module 'axios' {
	interface InternalAxiosRequestConfig {
		_isRetry?: boolean
	}
}

const options: CreateAxiosDefaults = {
	baseURL: SERVER_URL,
	headers: getContentType(),
	withCredentials: true,
}

const axiosDefault = axios.create(options)

const axiosWithAuth = axios.create(options)

axiosWithAuth.interceptors.request.use(config => {
	const accessToken = getAccessToken()

	if (config.headers && accessToken)
		config.headers.Authorization = `Bearer ${accessToken}`

	return config
})

axiosWithAuth.interceptors.response.use(
	config => config,
	async (error: AxiosError) => {
		const originalRequest = error.config as InternalAxiosRequestConfig

		if (
			(error?.response?.status === 401 ||
				errorCatch(error) === 'jwt expired' ||
				errorCatch(error) === 'jwt must be provided') &&
			originalRequest &&
			!originalRequest._isRetry
		) {
			originalRequest._isRetry = true

			try {
				await authService.getNewTokens()

				return axiosWithAuth.request(originalRequest)
			} catch (refreshError: any) {
				if (
					errorCatch(refreshError) === 'jwt expired' ||
					errorCatch(refreshError) === 'Unauthorized'
				)
					removeTokenFromStorage()

				if (typeof window !== 'undefined') {
					window.location.replace('/auth')
				}

				return Promise.reject(refreshError)
			}
		}

		return Promise.reject(errorCatch(error))
	}
)

export { axiosDefault, axiosWithAuth }
