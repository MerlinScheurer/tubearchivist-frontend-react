const Routes = {
  Home: "/",
  Channels: "/channel/",
  Channel: (id: string) => `/channel/${id}`,
  ChannelVideo: (id: string) => `/channel/${id}`,
  ChannelStream: (id: string) => `/channel/${id}/streams/`,
  ChannelShort: (id: string) => `/channel/${id}/shorts/`,
  ChannelPlaylist: (id: string) => `/channel/${id}/playlist/`,
  ChannelAbout: (id: string) => `/channel/${id}/about/`,
  Playlists: "/playlist/",
  Playlist: (id: string) => `/playlist/${id}`,
  Downloads: "/downloads/",
  DownloadsByChannelId: (channelId: string) =>
    `/downloads/?channel=${channelId}`,
  Search: "/search/",
  Settings: "/settings/",
  SettingsUser: "/settings/user/",
  SettingsApplication: "/settings/application/",
  SettingsScheduling: "/settings/scheduling/",
  SettingsActions: "/settings/actions/",
  Login: "/Login/",
  Logout: "/logout/",
  Video: (id: string) => `/video/${id}`,
  About: "/about/",
};

export default Routes;
