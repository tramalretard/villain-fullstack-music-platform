export const SERVER_URL = process.env.SERVER_URL as string

export const API_PREFIX = 'api'

export const API_URL = {
	root: (path = '') => `/${API_PREFIX}${path}`,

	auth: {
		login: () => API_URL.root('/auth/login'),
		register: () => API_URL.root('/auth/register'),
		logout: () => API_URL.root('/auth/logout'),
		accessToken: () => API_URL.root('/auth/login/access-token'),
	},

	users: {
		updateAvatar: () => API_URL.root('/user/avatar'),
	},

	tracks: {
		getById: (id: string) => API_URL.root(`/track/get-by/${id}`),

		artists: {
			addTrack: () => API_URL.root('/track/add'),
			updateTrack: (id: string) => API_URL.root(`/track/update/${id}`),
			deleteTrack: (id: string) => API_URL.root(`/track/delete/${id}`),
			updateImageTrack: (id: string) => API_URL.root(`/track/image/${id}`),
			submitForPublication: (id: string) =>
				API_URL.root(`/track/publish/${id}`),
			assignTrackToAlbum: (trackId: string, albumId: string) =>
				API_URL.root(`/track/${trackId}/to/${albumId}`),
		},

		listenTrack: (id: string) => API_URL.root(`/track/listen/${id}`),

		markTrackAsFavorite: (id: string) => API_URL.root(`/track/mark/${id}`),
	},

	playlists: {
		getById: (id: string) => API_URL.root(`/playlist/get-by/${id}`),
		getMyPlaylists: (id: string) => API_URL.root(`/playlist/get-my`),
		createPlaylist: () => API_URL.root('/playlist/create'),
		deletePlaylist: (id: string) => API_URL.root(`/playlist/delete/${id}`),
		updatePlaylist: (id: string) => API_URL.root(`/playlist/update/${id}`),
		addTrackToMarked: () => API_URL.root('/add/marked'),
		removeTrackFromMarked: () => API_URL.root('/remove/marked'),
		addTrackToPlaylist: (playlistId: string) =>
			API_URL.root(`/playlist/${playlistId}/add-track`),
		removeTrackFromPlaylist: (playlistId: string) =>
			API_URL.root(`/playlist/${playlistId}/remove-track`),
	},

	artists: {
		getById: (id: string) => API_URL.root(`/artist/get-by/${id}`),
		updateProfile: () => API_URL.root('/artist/update'),
		updateImageProfile: () => API_URL.root('/artist/image'),
	},

	albums: {
		getById: (id: string) => API_URL.root(`/album/get-by/${id}`),
		createAlbum: () => API_URL.root('/album/create'),
		updateAlbum: (id: string) => API_URL.root(`/album/update/${id}`),
		deleteAlbum: (id: string) => API_URL.root(`/album/delete/${id}`),
		updateImageAlbum: (id: string) => API_URL.root(`/album/image/${id}`),
		markAlbumAsFavorite: (id: string) => API_URL.root(`/album/favorite/${id}`),
		getMyFavoriteAlbums: () => API_URL.root('/album/favorites/my'),
		submitForPublication: (id: string) => API_URL.root(`/album/publish/${id}`),
	},

	files: {
		root: (path = '') => API_URL.root(`/files${path}`),
		uploads: {
			avatars: (fileName: string) => `/uploads/avatars/${fileName}`,
			albumCovers: (fileName: string) => `/uploads/album-covers/${fileName}`,
			artistProfiles: (fileName: string) =>
				`/uploads/artist-profiles/${fileName}`,
			trackCovers: (fileName: string) => `/uploads/track-covers/${fileName}`,
			tracks: (filePath: string) => `/uploads/tracks/${filePath}`,
		},
	},
}
