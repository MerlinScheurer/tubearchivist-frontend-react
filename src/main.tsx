import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import Routes from "./configuration/routes/RouteList";
import "./style.css";
import Base from "./pages/Base";
import About from "./pages/About";
import Channels from "./pages/Channels";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import Logout from "./pages/Logout";
import Playlist from "./pages/Playlist";
import Playlists from "./pages/Playlists";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import Video from "./pages/Video";
import Login from "./pages/Login";
import SettingsActions from "./pages/SettingsActions";
import SettingsApplication from "./pages/SettingsApplication";
import SettingsScheduling from "./pages/SettingsScheduling";
import SettingsUser from "./pages/SettingsUser";
import loadUserConfig from "./api/loader/loadUserConfig";
import loadAuth from "./api/loader/loadAuth";
import ChannelBase from "./pages/ChannelBase";
import ChannelVideo from "./pages/ChannelVideo";
import ChannelPlaylist from "./pages/ChannelPlaylist";
import ChannelAbout from "./pages/ChannelAbout";
import ChannelStream from "./pages/ChannelStream";

const router = createBrowserRouter(
  [
    {
      path: Routes.Home,
      loader: async () => {
        console.log("------------ after reload");

        const userConfig = await loadUserConfig();

        return { userConfig };
      },
      element: <Base />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />,
          loader: async () => {
            const authResponse = await loadAuth();
            if (authResponse.status === 403) {
              return redirect(Routes.Login);
            }

            const userConfig = await loadUserConfig();

            return { userConfig };
          },
        },
        {
          path: Routes.Video(":videoId"),
          element: <Video />,
          loader: async () => {
            const authResponse = await loadAuth();
            if (authResponse.status === 403) {
              return redirect(Routes.Login);
            }

            return {};
          },
        },
        {
          path: Routes.Channels,
          element: <Channels />,
          loader: async () => {
            const authResponse = await loadAuth();
            if (authResponse.status === 403) {
              return redirect(Routes.Login);
            }

            const userConfig = await loadUserConfig();

            return { userConfig };
          },
        },
        {
          path: Routes.Channel(":channelId"),
          element: <ChannelBase />,
          loader: async () => {
            const authResponse = await loadAuth();
            if (authResponse.status === 403) {
              return redirect(Routes.Login);
            }

            return {};
          },
          children: [
            {
              index: true,
              path: Routes.ChannelVideo(":channelId"),
              element: <ChannelVideo />,
              loader: async () => {
                const authResponse = await loadAuth();
                if (authResponse.status === 403) {
                  return redirect(Routes.Login);
                }

                const userConfig = await loadUserConfig();

                return { userConfig };
              },
            },
            {
              path: Routes.ChannelStream(":channelId"),
              element: <ChannelStream />,
              loader: async () => {
                const authResponse = await loadAuth();
                if (authResponse.status === 403) {
                  return redirect(Routes.Login);
                }

                return {};
              },
            },
            {
              path: Routes.ChannelShort(":channelId"),
              element: <ChannelStream />,
              loader: async () => {
                const authResponse = await loadAuth();
                if (authResponse.status === 403) {
                  return redirect(Routes.Login);
                }

                return {};
              },
            },
            {
              path: Routes.ChannelPlaylist(":channelId"),
              element: <ChannelPlaylist />,
              loader: async () => {
                const authResponse = await loadAuth();
                if (authResponse.status === 403) {
                  return redirect(Routes.Login);
                }

                return {};
              },
            },
            {
              path: Routes.ChannelAbout(":channelId"),
              element: <ChannelAbout />,
              loader: async () => {
                const authResponse = await loadAuth();
                if (authResponse.status === 403) {
                  return redirect(Routes.Login);
                }

                return {};
              },
            },
          ],
        },
        {
          path: Routes.Playlists,
          element: <Playlists />,
          loader: async () => {
            const authResponse = await loadAuth();
            if (authResponse.status === 403) {
              return redirect(Routes.Login);
            }

            return {};
          },
        },
        {
          path: Routes.Playlist(":playlistId"),
          element: <Playlist />,
          loader: async () => {
            const authResponse = await loadAuth();
            if (authResponse.status === 403) {
              return redirect(Routes.Login);
            }

            return {};
          },
        },
        {
          path: Routes.Search,
          element: <Search />,
          loader: async () => {
            const authResponse = await loadAuth();
            if (authResponse.status === 403) {
              return redirect(Routes.Login);
            }

            return {};
          },
        },
        {
          path: Routes.Settings,
          element: <Settings />,
          loader: async () => {
            const authResponse = await loadAuth();
            if (authResponse.status === 403) {
              return redirect(Routes.Login);
            }

            return {};
          },
        },
        {
          path: Routes.SettingsActions,
          element: <SettingsActions />,
          loader: async () => {
            const authResponse = await loadAuth();
            if (authResponse.status === 403) {
              return redirect(Routes.Login);
            }

            return {};
          },
        },
        {
          path: Routes.SettingsApplication,
          element: <SettingsApplication />,
          loader: async () => {
            const authResponse = await loadAuth();
            if (authResponse.status === 403) {
              return redirect(Routes.Login);
            }

            return {};
          },
        },
        {
          path: Routes.SettingsScheduling,
          element: <SettingsScheduling />,
          loader: async () => {
            const authResponse = await loadAuth();
            if (authResponse.status === 403) {
              return redirect(Routes.Login);
            }

            return {};
          },
        },
        {
          path: Routes.SettingsUser,
          element: <SettingsUser />,
          loader: async () => {
            const authResponse = await loadAuth();
            if (authResponse.status === 403) {
              return redirect(Routes.Login);
            }

            return {};
          },
        },
        {
          path: Routes.About,
          element: <About />,
        },
      ],
    },
    {
      path: Routes.Login,
      element: <Login />,
      errorElement: <ErrorPage />,
    },
    {
      path: Routes.Logout,
      element: <Logout />,
      errorElement: <ErrorPage />,
    },
  ],
  { basename: "/new" },
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
