const Routes = {
    Home: '/',
    Channels: '/channel/',
    Channel: (id: string) => `/channel/${id}`,
    Playlists: '/playlist/',
    Playlist: (id: string) => `/playlist/${id}`,
    Downloads: '/downloads/',
    Search: '/search/',
    Settings: '/settings/',
    SettingsUser: '/settings/user/',
    SettingsApplication: '/settings/application/',
    SettingsScheduling: '/settings/scheduling/',
    SettingsActions: '/settings/actions/',
    Login: '/Login/',
    Logout: '/logout/',
    Video: (id: string) => `/video/${id}`,
    About: '/about/',
};

export default Routes;
