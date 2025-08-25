export const APP_URL = process.env.APP_URL as string

export const PUBLIC_URL = {
	home: () => '/',

	auth: () => '/auth',

	track: (id: string) => `/track/${id}`,
	album: (id: string) => `/album/${id}`,
	artist: (id: string) => `/artist/${id}`,

	profile: '/profile',

	library: {
		myPlaylists: '/library/playlists',
		favoriteTracks: '/library/tracks',
		favoriteAlbums: '/library/albums',
	},

	studio: {
		home: '/studio',
		albums: {
			list: '/studio/albums',
			create: '/studio/albums/create',
			edit: (id: string) => `/studio/albums/edit/${id}`,
		},
		tracks: {
			list: '/studio/tracks',
			create: '/studio/tracks/create',
			edit: (id: string) => `/studio/tracks/edit/${id}`,
		},
		profile: '/studio/profile/edit',
	},

	search: '/search',
}
