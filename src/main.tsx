import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import Routes from "./configuration/routes/RouteList";
import "./style.css";
import Base from "./Base";
import About from "./pages/About";
import Channel from "./pages/Channel";
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

import loadUserConfig from "./loader/loadUserConfig";
import loadAuth from "./loader/loadAuth";

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
          element: <Channel />,
          loader: async () => {
            const authResponse = await loadAuth();
            if (authResponse.status === 403) {
              return redirect(Routes.Login);
            }

            return {};
          },
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
